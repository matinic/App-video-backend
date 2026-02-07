import { prismaMock, mockUser, createMockUser } from '@test/mocks';
import UserService from '@/services/user.service';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(prismaMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUser = createMockUser({ name: 'Alice' });
      prismaMock.user.create.mockResolvedValue(newUser);

      const result = await userService.createUser({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'hashedPassword',
      });

      expect(result).toEqual(newUser);
      expect(prismaMock.user.create).toHaveBeenCalled();
    });

    it('should throw error when user creation fails', async () => {
      prismaMock.user.create.mockRejectedValue(new Error('Database error'));

      await expect(
        userService.createUser({
          name: 'Alice',
          email: 'alice@example.com',
          password: 'hashedPassword',
        })
      ).rejects.toThrow('Database error');
    });
  });

  describe('checkUserName', () => {
    it('should return 1 if name exists', async () => {
      prismaMock.user.findFirst.mockResolvedValue(mockUser);

      const result = await userService.checkUserName({ name: mockUser.name });

      expect(result).toEqual(mockUser);
    });

    it('should return null if name does not exist', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      const result = await userService.checkUserName({ name: 'NonExistent' });

      expect(result).toBeNull();
    });
  });

  describe('checkUserEmail', () => {
    it('should return user if email exists', async () => {
      prismaMock.user.findFirst.mockResolvedValue(mockUser);

      const result = await userService.checkUserEmail({ email: mockUser.email });

      expect(result).toEqual(mockUser);
    });

    it('should return null if email does not exist', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      const result = await userService.checkUserEmail({ email: 'nonexistent@example.com' });

      expect(result).toBeNull();
    });
  });

  describe('deleteUserById', () => {
    it('should delete user by id', async () => {
      prismaMock.user.delete.mockResolvedValue(mockUser);

      const result = await userService.deleteUserById({ id: mockUser.id });

      expect(result).toEqual(mockUser);
    });

    it('should throw error when user not found', async () => {
      prismaMock.user.delete.mockRejectedValue(new Error('User not found'));

      await expect(
        userService.deleteUserById({ id: 'invalid-id' })
      ).rejects.toThrow('User not found');
    });
  });
});