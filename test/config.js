// Test configuration for Karma 
// Generated on Thu Feb 20 2014 23:18:38 GMT+0800 (CST)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../',


    // frameworks to use
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      'src/css/*.less',
      'src/css/*.styl',
      'src/css/*.css',
      {pattern: 'src/**.js', included: false},
      {pattern: 'test/*/*Spec.js', included: false},
      'test/main.js'
    ],


    // list of files to exclude
    exclude: [
      
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'src/*/*.js': ['coverage'],
      'src/css/*.less': ['less'],
      'src/css/*.styl': ['stylus']
    },

    // optionally, configure the reporter
    coverageReporter: {
      // text-summary | text | html | json | teamcity | cobertura | lcov
      // lcovonly | none | teamcity
      type : 'text',
      dir : 'coverage/'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome'/*, 'Firefox', 'Safari', "PhantomJS"*/],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    plugins: [
        'karma-jasmine', 'karma-chrome-launcher', "karma-less-preprocessor", "karma-stylus-preprocessor", 'karma-requirejs', 'karma-coverage'
    ]
  });
};
