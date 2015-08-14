/*global module: true */
'use strict';

// Server configuration
module.exports = function (grunt, options) {
    var fn = {};

    fn.tasks = {};
    fn.tasks = {
        'mocha-server': {
            'base-test': {
                src: 'test/*.js',
                'options': {
                    'ui': 'bdd',
                    'reporter': 'html-cov',
                    coverage: true
                }
            }
        }
    };

    fn.tasks.mochacli = {
        'options': {
            'reporter': 'nyan',
            'ui': 'tdd'
        },
        all: ['build/test/*.js']
    };
    return fn;
};