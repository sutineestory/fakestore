/* eslint-env jest */
import * as mockAsyncStorage from '@react-native-async-storage/async-storage/jest';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

// The in-memory storage is shared by every test in a file; start each empty.
beforeEach(() => {
  mockAsyncStorage.clearAllMockStorages();
});
