#!/usr/bin/env ringo

var config = exports.config = module.singleton('wikiconfig', function() {
   if (system.args[1]) {
      var fs = require('fs');
      return {
         templates: [module.resolve('./templates/'), fs.resolve(system.args[1], './templates/')],
         db: fs.resolve(system.args[1], './db/'),
         publics: [module.resolve('public'), fs.resolve(system.args[1], './public/')]
      }
   }
   return {
      templates: [module.resolve('./templates/')],
      db: module.resolve('./db/'),
      publics: [module.resovle('public')]
   }
});

var app = exports.app = require("./actions").app;
app.configure("error", "notfound", "static");
config.publics.forEach(function(pub) {
   app.static(pub);
});


// main script to start application
if (require.main == module) {
    require('ringo/httpserver').main(module.id);
}
