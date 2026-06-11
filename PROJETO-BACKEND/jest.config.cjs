const { TextEncoder, TextDecoder } = require('util');


global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  coverageReporters: ['text', 'lcov', 'html']
};