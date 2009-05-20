exports.httpConfig = {
  staticDir: 'static'
};

exports.urls = [
    [ '/([^/]*)/([^/]*)', 'actions' ],
    [ '/', 'actions' ]
];

exports.middleware = [
    'helma/middleware/etag',
    'helma/middleware/responselog'
];

exports.macros = [
    'helpers',
    'helma/skin/macros',
    'helma/skin/filters'
];

exports.charset = 'UTF-8';
exports.contentType = 'text/html';
