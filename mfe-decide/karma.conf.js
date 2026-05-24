module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {},
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/mfe-decide'),
      reporters: [
        { type: 'html',         subdir: 'html' },
        { type: 'lcovonly',     subdir: '.', file: 'lcov.info' },
        { type: 'json-summary', subdir: '.', file: 'coverage-summary.json' },
        { type: 'text-summary' },
      ],
      check: {
        global: {
          statements : 70,
          branches   : 70,
          functions  : 70,
          lines      : 70,
        },
      },
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu'],
      },
    },
    browsers: ['Chrome'],
    restartOnFileChange: true,
  });
};
