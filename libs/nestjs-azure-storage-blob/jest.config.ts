import { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.(spec|test).ts'],
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};

export default config;
