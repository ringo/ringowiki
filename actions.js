var {Sorter} = require('ringo/utils/strings');
var response = require('ringo/jsgi/response');
var {Page} = require('./model');
var {Application} = require("stick");

var app = exports.app = Application();
app.configure("params", "render", "route");
app.render.base = module.resolve("templates");
app.render.master = "base.html";
app.render.helpers = require("./helpers");

app.get("/list", function(req) {
    return app.render('list.html', {
        pages: Page.all().sort(Sorter('name'))
    });
});

app.get("/:name?", function(req, name) {
    name = name || 'home';
    var page = Page.byName(name);
    if (page) {
        var skin, title;
        if (name.toLowerCase() == 'home') {
            skin = 'index.html';
        } else {
            skin = 'page.html';
            title = page.name;
        }
        page.body = page.getRevision(req.params.version).body;
        return app.render(skin, {
            page: page,
            title: title,
            headline: title,
            version: version,
            basePath: req.scriptName
        });
    } else {
        return app.render('new.html', {
            name: name.replace(/_/g, ' ')
        });
    }
});

app.post("/:name?", function(req, name) {
    if (req.params.hm != "yes") {
        return response.html("Sorry, this wiki is humans only.");
    }
    name = name || 'home';
    var page = new Page();
    page.updateFrom(req.params);
    page.save();
    return response.redirect(req.scriptName + "/" + encodeURIComponent(name));
});

app.get("/:name/edit", function(req, name) {
    var page = Page.byName(name);
    page.body = page.getRevision(req.params.version).body;
    return app.render('edit.html', {
        page: page,
    });
});

app.post("/:name/edit", function(req, name) {
    if (req.params.hm != "yes") {
        return response.html("Sorry, this wiki is humans only.");
    }
    var page = Page.byName(name);
    page.updateFrom(req.params);
    page.save();
    return response.redirect(req.scriptName + "/" + encodeURIComponent(name));
});

