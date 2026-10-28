module.exports = {
  preset: '@react-native/jest-preset',
  // After the environment, so the setup file can register a global beforeEach.
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    // Use lucide's prebuilt CommonJS build; its ESM build would make Babel
    // transform every icon module on a cold cache.
    '^lucide-react-native$':
      '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community|-async-storage)?|@react-navigation)/)',
  ],
};
