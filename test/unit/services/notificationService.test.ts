import { prismaMock, mockNotification, createMockNotification } from '@test/mocks';
import NotificationService from '@/services/notification.service';

describe('NotificationService', () => {
  let notificationService: NotificationService;

  beforeEach(() => {
    notificationService = new NotificationService(prismaMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewSubscriptionNotification', () => {
    it('should create a subscription notification', async () => {
      const newNotif = createMockNotification({ notificationTypeId: 'NEW-SUBSCRIPTION' });
      prismaMock.notification.create.mockResolvedValue(newNotif);

      const result = await notificationService.createNewSubscriptionNotification({
        userEmmiterId: '123',
        userDestinationId: '456',
      });

      expect(result).toEqual(newNotif);
      expect(prismaMock.notification.create).toHaveBeenCalled();
    });
  });

  describe('createNewVideoNotification', () => {
    it('should create a new video notification', async () => {
      const newNotif = createMockNotification({ notificationTypeId: 'NEW-VIDEO' });
      prismaMock.notification.create.mockResolvedValue(newNotif);

      const result = await notificationService.createNewVideoNotification({
        userEmmiterId: '123',
        videoId: 'video-123',
        userDestinationIdList: [
          { userDestinationId: '456' },
          { userDestinationId: '789' },
        ],
      });

      expect(result).toEqual(newNotif);
      expect(prismaMock.notification.create).toHaveBeenCalled();
    });
  });

  describe('createNewCommentOnVideoNotification', () => {
    it('should create a comment notification', async () => {
      const newNotif = createMockNotification({ notificationTypeId: 'NEW-COMMENT' });
      prismaMock.notification.create.mockResolvedValue(newNotif);

      const result = await notificationService.createNewCommentOnVideoNotification({
        userEmmiterId: '123',
        commentId: 'comment-123',
        videoId: 'video-123',
        userDestinationId: '456',
      });

      expect(result).toEqual(newNotif);
      expect(prismaMock.notification.create).toHaveBeenCalled();
    });
  });

  describe('getNotification', () => {
    it('should get notifications for a user', async () => {
      const notifications = [
        {
          notification: mockNotification,
        },
      ];
      prismaMock.userNotification.findMany.mockResolvedValue(notifications as any);

      const result = await notificationService.getNotification({ id: '123' });

      expect(result).toEqual(notifications);
      expect(prismaMock.userNotification.findMany).toHaveBeenCalled();
    });

    it('should return empty array if no notifications', async () => {
      prismaMock.userNotification.findMany.mockResolvedValue([]);

      const result = await notificationService.getNotification({ id: '123' });

      expect(result).toEqual([]);
    });
  });

  describe('getNotificationCount', () => {
    it('should return count of unread notifications', async () => {
      prismaMock.userNotification.count.mockResolvedValue(5);

      const result = await notificationService.getNotificationCount({ id: '123' });

      expect(result).toBe(5);
    });
  });

  describe('updateNotification', () => {
    it('should mark notifications as read', async () => {
      prismaMock.userNotification.updateMany.mockResolvedValue({ count: 5 });

      const result = await notificationService.updateNotification({ id: '123' });

      expect(result).toBeDefined();
      expect(prismaMock.userNotification.updateMany).toHaveBeenCalled();
    });
  });
});
