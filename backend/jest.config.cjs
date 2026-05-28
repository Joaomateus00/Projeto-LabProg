module.exports = {
    testEnvironment: 'jest-environment-jsdom', 
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
    },
    
    
    coverageReporters: ['text', 'lcov', 'html']
};