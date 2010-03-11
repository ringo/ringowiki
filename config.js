exports.httpConfig = {
  staticDir: './static'
};

exports.urls = [
    [ '/([^/]*)/edit', './actions', 'edit' ],
    [ '/', './actions' ]
];

exports.app = 'ringo/webapp';

exports.middleware = [
    'ringo/middleware/etag',
    'ringo/middleware/responselog'
];

exports.store = require('ringo/storage/relationalstore/hibernate');

exports.macros = [
    './helpers',
    'ringo/skin/macros',
    'ringo/skin/filters'
];

exports.charset = 'UTF-8';
exports.contentType = 'text/html';
