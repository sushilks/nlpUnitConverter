/*global module: true */
'use strict';

// Server configuration
module.exports = function (grunt, options) {
    var fn = {};
    var targetFolder = options.targetFolderPath + '/';
    fn.tasks = {};
    fn.tasks.babel = {};
    fn.tasks.babel.compile = {
        'options': {
            'sourceMap': true
        },
        files: [{
            'expand': true,
            'cwd': options.srcFolderPath + '/',
            'src': ['**/*.js'],
            'dest': targetFolder + 'src',
            'flatten': false
        }]
    };
    fn.tasks.babel['compile-typescript'] = {
        'options': {
            'sourceMap': true
        },
        files: [{
            'expand': true,
            'cwd': options.targetFolderPath + '/ts/src',
            'src': ['**/*.js'],
            'dest': targetFolder + 'src',
            'flatten': false
        }]
    };

    fn.tasks.babel['compile-test'] = {
        'options': {
            'sourceMap': true
        },
        files: [{
            'expand': true,
            'cwd': options.srcFolderPath + '/../test',
            'src': ['*.js'],
            'dest': targetFolder + '/test',
            'flatten': false
        }]
    };

    fn.tasks.clean = {
        'compile': {
            'src': [targetFolder]
        },
        'compile-test': {
            'src': [targetFolder + '/test']
        }
    };
    return fn;
};