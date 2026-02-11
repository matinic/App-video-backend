
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
  rating: null,
  duration: null,
  commentCount: 0,
  publishedAt: new Date('2024-01-01'),
};

export const mockVideos = [
  mockVideo,
  {
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
    rating: null,
    duration: null,
    commentCount: 0,
    publishedAt: new Date('2024-01-01'),
  },
];

export const createMockVideo = (overrides = {}) => ({
  ...mockVideo,
  ...overrides,
});
