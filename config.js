exports.httpConfig = {
  staticDir: 'static'
};

exports.urls = [
    [ '/([^/]*)/([^/]*)', 'actions' ],
    [ '/', 'actions' ]
];

exports.middleware = [
    'helma/middleware/responselog',
    'helma/middleware/etag'
];

exports.macros = [
    'helpers',
    'helma/skin/macros',
    'helma/skin/filters'
];

exports.charset = 'UTF-8';
exports.contentType = 'text/html';
