module.exports = {
  preset: 'ts-jest',
  testMatch: ['**/test/**/*.test.ts'],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
}
