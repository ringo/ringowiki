exports.httpConfig = {
  staticDir: 'static'
};

exports.urls = [
    [ '/([^/]*)/([^/]*)', 'actions' ],
    [ '/', 'actions' ]
];

exports.app = 'helma/webapp';

exports.middleware = [
    'helma/middleware/etag',
    'helma/middleware/responselog'
];

var Store = require('helma/storage/filestore').Store;
exports.store = new Store('db');

exports.macros = [
    'helpers',
    'helma/skin/macros',
    'helma/skin/filters'
];

exports.charset = 'UTF-8';
exports.contentType = 'text/html';
