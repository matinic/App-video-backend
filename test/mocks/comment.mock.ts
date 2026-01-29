export const mockComment = {
  id: 'comment-123',
  content: 'Great video!',
  upvotes: 5,
  downvotes: 1,
  userId: '123',
  videoId: 'video-123',
  fatherCommentId: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockComments = [
  mockComment,
  {
    id: 'comment-456',
    content: 'Thanks for sharing!',
    upvotes: 10,
    downvotes: 0,
    userId: '456',
    videoId: 'video-123',
    fatherCommentId: 'comment-123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const createMockComment = (overrides = {}) => ({
  ...mockComment,
  ...overrides,
});
