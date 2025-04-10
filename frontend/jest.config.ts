import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  transform: {
    "^.+\\.[tj]sx?$": "ts-jest", // Handles both .ts/.tsx and .js/.jsx with ts-jest
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
  },

  transformIgnorePatterns: [
    "/node_modules/(?!(axios|@tauri-apps)/)", // allow transpiling of some node_modules (e.g. ESM)
  ],

  globals: {
    "ts-jest": {
      isolatedModules: true,
      tsconfig: "tsconfig.json",
    },
  },
};

export default config;
