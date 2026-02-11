export const mockComment = {
  id: 'comment-123',
  content: 'Great video!',
  upvotes: 5,
  downvotes: 1,
  userId: 'user-123',
  videoId: 'video-123',
  commentId: null,
  isDeleted: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  _count: {
    response: 0
  }
};

export const mockComments = [
  mockComment,
  {
    id: 'comment-456',
    content: 'Thanks for sharing!',
    upvotes: 10,
    downvotes: 0,
    userId: 'user-456',
    videoId: 'video-123',
    commentId: 'comment-123',
    isDeleted: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    _count: {
      response: 0
    }
  },
];

export const createMockComment = (overrides = {}) => ({
  ...mockComment,
  ...overrides,
});
