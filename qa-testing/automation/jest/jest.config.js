module.exports = {
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
  
  // A list of paths to directories that Jest should use to search for files in
  roots: [
    "<rootDir>/src"
  ],
  
  // The test environment that will be used for testing
  testEnvironment: "node",
  
  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/**/*.js?(x)",
    "**/?(*.)+(spec|test).js?(x)"
  ],
  
  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/mocks/**",
    "!src/types/**",
    "!src/index.js"
  ],
  
  // The directory where Jest should store its cached dependency information
  cacheDirectory: ".jest-cache",
  
  // Automatically reset mock state between every test
  resetMocks: true,
  
  // The maximum amount of workers used to run your tests
  maxWorkers: "50%",
  
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  
  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    "/node_modules/",
    "\\.pnp\\.[^\\/]+$"
  ],
  
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
  // Setup files that will be run before each test
  setupFilesAfterEnv: [
    "<rootDir>/setup-tests.js"
  ]
}; 