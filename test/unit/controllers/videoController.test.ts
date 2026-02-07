import { Request, Response } from 'express';
import { prismaMock, mockVideo } from '@test/mocks';
import VideoService from '@/services/video.service';
import VideoController from '@/controllers/video.controller';
import UserService from '@/services/user.service';
import NotificationService from '@/services/notification.service';

describe('VideoController', () => {
  let videoController: VideoController;
  let userService: UserService;
  let videoService: VideoService;
  let notificationService: NotificationService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    userService = new UserService(prismaMock);
    videoService = new VideoService(prismaMock);
    notificationService = new NotificationService(prismaMock);
    videoController = new VideoController(userService, videoService, notificationService);

    mockRequest = {
      validatedBody: {
        title: 'Test Video',
        description: 'Test Description',
        url: 'https://example.com/video.mp4',
        thumbnail: 'https://example.com/thumb.jpg',
        categoryId: 'cat-1',
        tags: [],
      },
      user: { id: '123', name: 'John' },
      validatedParams: { id: 'video-123' },
      validatedQuery: { skip: 0, take: 10, orderBy: { createdAt: 'desc' } },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createVideo', () => {
    it('should create a new video and return success', async () => {
      prismaMock.video.create.mockResolvedValue(mockVideo);
      prismaMock.user.findMany.mockResolvedValue([]);
      prismaMock.notification.create.mockResolvedValue({} as any);

      await videoController.createVideo(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      prismaMock.video.create.mockRejectedValue(new Error('Database error'));

      await videoController.createVideo(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getVideoById', () => {
    it('should return video by id', async () => {
      prismaMock.video.findUnique.mockResolvedValue(mockVideo);

      await videoController.getVideoById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockVideo);
    });

    it('should return 404 if video not found', async () => {
      prismaMock.video.findUnique.mockResolvedValue(null);

      await videoController.getVideoById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteVideo', () => {
    it('should delete video and return success', async () => {
      prismaMock.video.update.mockResolvedValue(mockVideo);

      await videoController.deleteVideo(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      prismaMock.video.update.mockRejectedValue(new Error('Database error'));

      await videoController.deleteVideo(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
