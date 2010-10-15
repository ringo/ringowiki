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

exports.store = require('ringo/storage/hibernate');

exports.jars = ['jars/mysql-connector-java-5.1.12-bin.jar'];

exports.macros = [
    './helpers',
    'ringo/skin/macros',
    'ringo/skin/filters'
];

exports.charset = 'UTF-8';
exports.contentType = 'text/html';
