export const mockNotification = {
  id: 'notif-123',
  userEmmiterId: '123',
  videoId: 'video-123',
  commentId: null,
  messageId: null,
  notificationTypeId: 'NEW-VIDEO',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockNotifications = [
  mockNotification,
  {
    id: 'notif-456',
    userEmmiterId: '456',
    videoId: null,
    commentId: 'comment-123',
    messageId: null,
    notificationTypeId: 'NEW-COMMENT',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const createMockNotification = (overrides = {}) => ({
  ...mockNotification,
  ...overrides,
});
