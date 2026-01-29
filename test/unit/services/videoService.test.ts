import { prismaMock, mockVideo, createMockVideo } from '@test/mocks';
import VideoService from '@/services/video.service';

describe('VideoService', () => {
  let videoService: VideoService;

  beforeEach(() => {
    videoService = new VideoService(prismaMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createVideo', () => {
    it('should create a new video', async () => {
      const newVideo = createMockVideo({ title: 'New Video' });
      prismaMock.video.create.mockResolvedValue(newVideo);

      const result = await videoService.createVideo({
        title: 'New Video',
        description: 'New Description',
        url: 'https://example.com/video.mp4',
        thumbnail: 'https://example.com/thumb.jpg',
        authorId: '123',
        categoryId: 'cat-1',
        tags: [{ name: 'test' }],
      });

      expect(result).toEqual(newVideo);
      expect(prismaMock.video.create).toHaveBeenCalled();
    });

    it('should throw error when video creation fails', async () => {
      prismaMock.video.create.mockRejectedValue(new Error('Database error'));

      await expect(
        videoService.createVideo({
          title: 'New Video',
          description: 'New Description',
          url: 'https://example.com/video.mp4',
          thumbnail: 'https://example.com/thumb.jpg',
          authorId: '123',
          categoryId: 'cat-1',
          tags: [],
        })
      ).rejects.toThrow('Database error');
    });
  });

  describe('getVideoById', () => {
    it('should return video by id', async () => {
      prismaMock.video.findUnique.mockResolvedValue(mockVideo);

      const result = await videoService.getVideoById({ id: mockVideo.id });

      expect(result).toEqual(mockVideo);
      expect(prismaMock.video.findUnique).toHaveBeenCalledWith({
        where: { id: mockVideo.id },
      });
    });

    it('should return null if video not found', async () => {
      prismaMock.video.findUnique.mockResolvedValue(null);

      const result = await videoService.getVideoById({ id: 'invalid-id' });

      expect(result).toBeNull();
    });
  });

  describe('getVideosPublished', () => {
    it('should return published videos', async () => {
      const videos = [mockVideo];
      prismaMock.video.findMany.mockResolvedValue(videos);

      const result = await videoService.getVideosPublished({
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });

      expect(result).toEqual(videos);
      expect(prismaMock.video.findMany).toHaveBeenCalled();
    });

    it('should return empty array if no published videos', async () => {
      prismaMock.video.findMany.mockResolvedValue([]);

      const result = await videoService.getVideosPublished({
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });

      expect(result).toEqual([]);
    });
  });

  describe('deleteVideo', () => {
    it('should soft delete a video', async () => {
      const deletedVideo = createMockVideo({ deleted: true });
      prismaMock.video.update.mockResolvedValue(deletedVideo);

      const result = await videoService.deleteVideo({ id: mockVideo.id });

      expect(result).toEqual(deletedVideo);
      expect(prismaMock.video.update).toHaveBeenCalled();
    });
  });

  describe('updateVideo', () => {
    it('should update video', async () => {
      const updatedVideo = createMockVideo({ title: 'Updated Title' });
      prismaMock.video.update.mockResolvedValue(updatedVideo);

      const result = await videoService.updateVideo({
        videoId: mockVideo.id,
        title: 'Updated Title',
      });

      expect(result).toEqual(updatedVideo);
    });
  });
});
