// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['lcov', 'text', 'html'],
  transform: {
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/config/fileTransformer.js',
    '.(js|jsx)': '<rootDir>/config/jestPreprocess.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.cache/'],
  moduleFileExtensions: ['jsx', 'js', 'module.css', '.css', 'json'],
  moduleNameMapper: {
    '\\.module\\.(css|less)$': 'identity-obj-proxy',
    '.(css)$': 'identity-obj-proxy',
  },
};
