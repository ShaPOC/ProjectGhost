'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
//    nodeunit: {
//        files: [
//            'tests/www/ghost/*_test.js',
//            'tests/www/ghost/**/*_test.js',
//            'tests/www/ghost/**/**/*_test.js'
//        ]
//    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['src/www/ghost/application/public','src/www/ghost/application/public/**']
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['src/www/ghost/**/*.js']
      },
      test: {
        src: ['tests/www/ghost/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      }
    }
  });

  // These plugins provide necessary tasks.
//  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint'/*, 'nodeunit'*/]);

};
