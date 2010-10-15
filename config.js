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

var Store = require('ringo/storage/sql/store').Store;
exports.store = new Store({
    url: 'jdbc:mysql://localhost/ringowiki',
    driver: 'com.mysql.jdbc.Driver',
    user: 'ringo',
    password: 'secret'
});

exports.jars = ['jars/mysql-connector-java-5.1.12-bin.jar'];

exports.macros = [
    './helpers',
    'ringo/skin/macros',
    'ringo/skin/filters'
];

exports.charset = 'UTF-8';
exports.contentType = 'text/html';
