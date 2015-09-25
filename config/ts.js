/*global module: true */
'use strict';

// Server configuration
module.exports = function (grunt, options) {
    var fn = {};
    var targetFolder = options.targetFolderPath + '/';
    fn.tasks = {};
    fn.tasks.typescript = {};
    fn.tasks.typescript.compile = {
        'options': {
            target: 'es6',
            declaration: true,
            sourceMap: true
        },
        src: [options.srcFolderPath + '/**/*.ts'],
        dest: targetFolder + 'ts/src'
    };
    return fn;
};
