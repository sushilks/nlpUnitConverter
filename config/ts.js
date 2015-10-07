/*global module: true */
'use strict';

// Server configuration
module.exports = function (grunt, options) {
    var fn = {};
    var targetFolder = options.targetFolderPath + '/';
    fn.tasks = {};
    fn.tasks.ts = {};
    fn.tasks.ts.compile = {
        'options': {
            target: 'es6',
            declaration: true,
            sourceMap: true,
            compiler: '/users/sushil/.nvm/versions/node/v0.12.7/bin/tsc',
            additionalFlags: '--experimentalAsyncFunctions'
        },
        src: [options.srcFolderPath + '/**/*.ts'],
        dest: targetFolder + 'ts/src',
        ext: '.es6'
    };
    return fn;
};
