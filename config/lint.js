/*global module: true */
'use strict';

// Server configuration
module.exports = function (grunt, options) {
    var fn = {};
    fn.tasks = {};
    fn.tasks.eslint = {
        'src': {
            'options': {
                'env' : 'node',
                'force': true,
                'useEslintrc': true
            },
            'src': [options.srcFolderPath + '/*.js', 'Gruntfile.js']
        },
        'test': {
            'options': {
                'env': 'node,mocha',
                'force': true,
                'useEslintrc': true
            },
            'src': [options.srcFolderPath + '/../test/*.js']
        },
        'file': {
            'options': {
                'force': true,
                'useEslintrc': true,
                'format': 'checkstyle',
                'outputFile': options.targetFolderPath + '/report-eslint.xml'
            },
            'src': [options.srcFolderPath + '/*.js', '!' + options.srcFolderPath + '/foo/*']
        }
    };
    fn.tasks.clean = {
        'reports': {
            'src': [options.targetFolderPath + '/report-eslint.xml']
        }
    };
    return fn;
};