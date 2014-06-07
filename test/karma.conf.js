module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'bower_components/angular-mocks/angular-mocks.js',
      'public/js/angular.min.js',
      'public/js/controller.js',
      'test/frontend/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['mocha', 'chai'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-chai'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};