#!/usr/bin/env ringo

exports.config = module.singleton('wikiconfig', function() {
   if (system.args[1]) {
      var fs = require('fs');
      return {
         templates: [module.resolve('./templates/'), fs.resolve(system.args[1], './templates/')],
         db: fs.resolve(system.args[1], './db/')
      }
   }
   return {
      templates: [module.resolve('./templates/')],
      db: module.resolve('./db/')
   }
});

var app = exports.app = require("./actions").app;
app.configure("error", "notfound", "static");
app.static(module.resolve("public"));

// main script to start application
if (require.main == module) {
    require('ringo/httpserver').main(module.id);
}
