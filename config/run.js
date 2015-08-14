/*global module: true */
'use strict';

// Server configuration
module.exports = function (grunt, options) {
    var fn = {};
    fn.tasks = {};
    fn.tasks.run = {
        'server': {
                cmd: 'node',
                args: [
                 'src/corenlp_server.js'
                 ]
        },
        'client': {
                cmd: 'node',
                args: [
                 'build/src/eparser.js'
                 ]
        },
        'client-debug': {
                cmd: 'node-debug',
                args: [
                 'build/src/eparser.js'
                 ]
        },
        'test': {
            'options': {
                'env' : 'node,mocha',
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