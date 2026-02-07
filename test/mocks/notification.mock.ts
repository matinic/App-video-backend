import { Notification } from "@prisma/client";

export const mockNotification: Notification = {
  id: "123456",
  commentId: "comment-id", 
  userEmmiterId: "user-emmiter-id",
  videoId: null,
  messageId: null,
  notificationTypeType: "NEW-COMMENT",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
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
