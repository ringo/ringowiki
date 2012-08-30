#!/usr/bin/env ringo

var app = exports.app = require("./actions").app;
app.configure("error", "notfound", "static");
app.static(module.resolve("public"));

// main script to start application
if (require.main == module) {
    require('ringo/httpserver').main(module.id);
}
