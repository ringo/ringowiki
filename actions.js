var {Sorter} = require('ringo/utils/strings');
var response = require('ringo/jsgi/response');
var {Application} = require("stick");
var {renderResponse, registerLoader} = require('reinhardt');
var {config} = require('./main');

var FsLoader = require('reinhardt/loaders/filesystem').Loader;
config.templates.forEach(function(templatePath) {
    registerLoader(new FsLoader(templatePath));
});

var app = exports.app = Application();
app.configure("params", "route");

// require helpers and model *after* app is configured
var {Page, Revision} = require('./model');
var helpers = require('./helpers');

app.get("/list", function(req) {
    return renderResponse('list.html', {
        pages: Page.allOrdered(),
        baseUrl: helpers.baseUrl
    });
});

app.get("/recent", function(req) {
    return renderResponse('recent.html', {
        revisions: Revision.getRecent(req.params.limit || 50),
        baseUrl: helpers.baseUrl
    });
});

app.get("/recent/rss", function(req) {
    var absoluteUrl = (req.scheme + "://" + req.host + (req.port != 80 ? ":" + req.port : ""));
    return renderResponse("recent.rss",{
        revisions: Revision.getRecent(req.params.limit || 50),
        absoluteUrl: absoluteUrl,
        baseUrl: helpers.baseUrl
    });
});

app.get("/:name?", function(req, name) {
    name = name || 'home';
    var page = Page.byName(name);
    if (page) {
        return renderResponse('page.html', {
            page: page,
            navigationPage: Page.byName('navigation'),
            baseUrl: helpers.baseUrl
        });
    } else {
        return renderResponse('edit.html', {
            page: {
                name: name,
                slug: name.replace(/_/g, ' '),
                body: ''
            },
            baseUrl: helpers.baseUrl
        });
    }
});

app.get("/:name/edit", function(req, name) {
    var page = Page.byName(name, req.params.version);
    // FIXME why can't I access page.revisions in template??
    return renderResponse('edit.html', {
        page: page,
        baseUrl: helpers.baseUrl
    });
});

function updateOrCreate (req, name) {
    if (req.params.hm != "yes") {
        return response.html("Sorry, this wiki is humans only.");
    }
    var page = Page.byName(name) || new Page();
    page.updateFrom(req.params);
    page.save();
    return response.redirect(req.scriptName + "/" + encodeURIComponent(page.name));
}

app.post("/:name?", updateOrCreate);
app.post("/:name/edit", updateOrCreate);

