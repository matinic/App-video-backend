export const mockVideo = {
  id: 'video-123',
  title: 'Test Video',
  description: 'This is a test video',
  url: 'https://example.com/video.mp4',
  thumbnail: 'https://example.com/thumbnail.jpg',
  authorId: '123',
  categoryId: 'cat-1',
  published: true,
  deleted: false,
  deletedAt: null,
  views: 100,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockVideos = [
  mockVideo,
  {
    id: 'video-456',
    title: 'Another Video',
    description: 'Another test video',
    url: 'https://example.com/video2.mp4',
    thumbnail: 'https://example.com/thumbnail2.jpg',
    authorId: '456',
    categoryId: 'cat-2',
    published: true,
    deleted: false,
    deletedAt: null,
    views: 200,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

export const createMockVideo = (overrides = {}) => ({
  ...mockVideo,
  ...overrides,
});
