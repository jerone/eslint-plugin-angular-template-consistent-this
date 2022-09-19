/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "text-summary", "lcov", "cobertura"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!**/node_modules/**",
    "!**/external/**",
  ],
  reporters: [
    "default",
    [
      // Needed for CI workflow Github Action Job Summary.
      // See https://github.com/dorny/test-reporter#supported-formats
      "jest-junit",
      {
        outputDirectory: "coverage",
        ancestorSeparator: " › ",
        uniqueOutputName: "false",
        suiteNameTemplate: "{filepath}",
        classNameTemplate: "{classname}",
        titleTemplate: "{title}",
      },
    ],
  ],
  testEnvironment: "node",
};
