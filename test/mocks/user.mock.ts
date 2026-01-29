export const mockUser = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedPassword123',
  image: 'https://example.com/avatar.jpg',
  refreshToken: 'refreshToken123',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockUsers = [
  mockUser,
  {
    id: '456',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'hashedPassword456',
    image: 'https://example.com/avatar2.jpg',
    refreshToken: 'refreshToken456',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

export const createMockUser = (overrides = {}) => ({
  ...mockUser,
  ...overrides,
});
