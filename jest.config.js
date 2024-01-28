module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
  moduleNameMapper: {
    ".*app.service": "./app.service.mock.ts",
  },
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
      stringifyContentPathRegex: "\\.html$",
      diagnostics: {
        ignoreCodes: [151001],
      },
    },
  },
};
