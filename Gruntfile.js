/*jshint node:true */
/*global module: true, require: true, __dirname: true */
'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Grunt configuration
    grunt.initConfig(
        require('load-grunt-configs')(
            grunt,
            {
                'targetFolderPath': './build',
                'srcFolderPath': './src',
                'nodeModulesFolderPath': './node_modules',
                'dirname': __dirname
            }
            )
        );

    // A very basic defaukt task.
//    grunt.registerTask('default', 'Log some stuff.', function () {
//        grunt.log.write('Options are [lint, build, test, run]').ok();
//    });

    // Task for the reports
    grunt.registerTask('lint-src', [
        'eslint:src'
        ]);
    grunt.registerTask('lint-test', [
        'eslint:test'
        ]);
    grunt.registerTask('lint-file', [
        'clean:reports',
        'eslint:file'
        ]);

    grunt.registerTask('lint', ['lint-src', 'lint-test']);
    // Task for the tests
    grunt.registerTask('tests', [
        'clean:compile',
        'clean:compile-test',
        'babel:compile',
        'babel:compile-test',
        'mochacli'
        ]);

    grunt.registerTask('test', ['tests']);

    // Task for the development "light"
    grunt.registerTask('build', [
        'clean:compile',
        'clean:compile-test',
        'babel:compile',
        'babel:compile-test'
        ]);


    // Task for the distribution
    grunt.registerTask('run-client', ['run:client']);
    grunt.registerTask('run-client-debug', ['run:client-debug']);
    grunt.registerTask('run-server', ['run:server']);
};