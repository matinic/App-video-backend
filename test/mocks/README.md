import { prismaMock } from './mocks/prisma';
import { mockUser } from './mocks/user.mock';
import { mockVideo } from './mocks/video.mock';

/**
 * Example: How to use mocks in tests
 * 
 * 1. Import mocks:
 *    import { prismaMock, mockUser, createMockUser } from '@test/mocks';
 * 
 * 2. Setup mock responses in beforeEach:
 *    prismaMock.user.findUnique.mockResolvedValue(mockUser);
 * 
 * 3. Use in tests:
 *    const user = await userService.getUserById('123');
 *    expect(user).toEqual(mockUser);
 * 
 * 4. Override mocks for specific tests:
 *    const customUser = createMockUser({ name: 'Custom Name' });
 *    prismaMock.user.findUnique.mockResolvedValue(customUser);
 */

describe('Mock Examples', () => {
  it('should demonstrate Prisma mock setup', () => {
    // Setup
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    // The mock is ready to be used in services
    expect(prismaMock.user.findUnique).toBeDefined();
  });

  it('should demonstrate video mock', () => {
    // Setup
    prismaMock.video.create.mockResolvedValue({
      id: 'video-123',
      title: 'Test Video',
      description: 'Test Description',
      url: 'https://example.com/video.mp4',
      thumbnail: 'https://example.com/thumb.jpg',
      authorId: '123',
      categoryId: 'cat-1',
      published: true,
      deleted: false,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(prismaMock.video.create).toBeDefined();
  });
});
