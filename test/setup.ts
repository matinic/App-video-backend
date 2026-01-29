/**
 * Global test setup configuration
 * Runs before all tests
 */

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

/**
 * Jest config recommendations:
 * 
 * Add to jest.config.ts:
 * setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
 * moduleNameMapper: {
 *   '^@/(.*)$': '<rootDir>/src/$1',
 *   '^@test/(.*)$': '<rootDir>/test/$1'
 * },
 * testMatch: [
 *   '<rootDir>/test/unit/**/*.test.ts',
 *   '<rootDir>/test/integration/**/*.test.ts'
 * ]
 */
