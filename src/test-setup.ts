import 'jest-preset-angular/setup-jest';

global.URL = jest.fn((path, base) => ({ path, base })) as any;
global.Worker = jest.fn().mockImplementation(() => ({
  postMessage: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  terminate: jest.fn(),
})) as any;
