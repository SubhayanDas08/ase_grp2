export default {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  preset: "ts-jest/presets/js-with-ts-esm",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "leaflet/dist/leaflet.css": "<rootDir>/__mocks__/leafletStyleMock.js",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "react-leaflet-heatmap-layer":
      "<rootDir>/__mocks__/react-leaflet-heatmap-layer.ts",
  },
  setupFilesAfterEnv: ["<rootDir>/apps/desktop/src/setupTests.ts"],
};
