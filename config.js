var {Store} = require('ringo-filestore');
exports.store = new Store('/var/lib/ringojs/db');

var app = exports.app = require("./actions").app;
app.configure("error", "notfound", "static");
app.static(module.resolve("public"));
