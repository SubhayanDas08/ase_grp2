export default {
    preset: "ts-jest",
    testEnvironment: "node", // Or "node" if you're testing backend code
    transform: {
      "^.+\\.tsx?$": "ts-jest", // Transform .ts and .tsx files using ts-jest
    },
    moduleNameMapper: {
      // Map any module aliases (if used in your code) to the actual paths
      "^@src/(.*)$": "<rootDir>/src/$1",
    },
    // Other Jest configurations can be added here
  };