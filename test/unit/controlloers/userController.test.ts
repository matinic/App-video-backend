import { Request, Response } from 'express';
import { prismaMock, mockUser } from '@test/mocks';
import UserService from '@/services/user.service';
import UserController from '@/controllers/user.controller';
import NotificationService from '@/services/notification.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let notificationService: NotificationService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    userService = new UserService(prismaMock);
    notificationService = new NotificationService(prismaMock);
    userController = new UserController(userService, notificationService);

    mockRequest = {
      validatedBody: {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'hashedPassword',
      },
      user: { id: '123', name: 'John' },
      validatedParams: { id: '123' },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user and return success', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(mockUser);

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should return 409 if user already exists', async () => {
      prismaMock.user.findFirst.mockResolvedValue(mockUser);

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
    });
  });

  describe('getChannelInfo', () => {
    it('should return channel info', async () => {
      mockRequest.validatedParams = { name: mockUser.name };
      prismaMock.user.findFirst.mockResolvedValue(mockUser);

      await userController.getChannelInfo(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      mockRequest.validatedParams = { name: 'NonExistent' };
      prismaMock.user.findFirst.mockResolvedValue(null);

      await userController.getChannelInfo(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return success', async () => {
      prismaMock.user.delete.mockResolvedValue(mockUser);

      await userController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      prismaMock.user.delete.mockRejectedValue(new Error('Database error'));

      await userController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
