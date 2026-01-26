import { UserService } from '@/services/userService';
import { mockUser } from '@test/fixtures/users';
import { mockDatabase } from '@test/mocks/database.mock';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(mockDatabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com' };
      
      mockDatabase.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(userData);

      expect(result).toEqual(mockUser);
      expect(mockDatabase.create).toHaveBeenCalledWith(userData);
    });

    it('should throw error if email already exists', async () => {
      mockDatabase.create.mockRejectedValue(new Error('Email exists'));

      await expect(
        userService.createUser({ name: 'John', email: 'john@example.com' })
      ).rejects.toThrow('Email exists');
    });
  });
});