var {Sorter} = require('ringo/utils/strings');
var response = require('ringo/jsgi/response');
var {Page, Revision} = require('./model');
var {Application} = require("stick");

var app = exports.app = Application();
app.configure("params", "render", "route");
app.render.base = module.resolve("templates");
app.render.master = "base.html";
app.render.helpers = require("./helpers");

app.get("/list", function(req) {
    return app.render('list.html', {
        pages: Page.allOrdered()
    });
});

app.get("/recent", function(req) {
    return app.render("recent.html", {days: Revision.getRecent(req.params.limit || 50), title: "Recent Changes", headline: "Recent Changes"});
});

app.get("/recent/rss", function(req) {
    var absoluteUrl = (req.scheme + "://" + req.host + (req.port != 80 ? ":" + req.port : ""));
    return app.render(
        "recent.rss",
        {
            days: Revision.getRecent(req.params.limit || 50),
            title: "Recent Changes",
            headline: "Recent Changes",
            absoluteUrl: absoluteUrl,
            items: app.renderPart("items.rss", {days: Revision.getRecent(req.params.limit || 50), absoluteUrl: absoluteUrl})
        },
        {master: "base.rss", contentType: "application/xml"}
    );
});

app.get("/:name?", function(req, name) {
    name = name || 'home';
    var page = Page.byName(name);
    if (page) {
        var skin, title, headline;
        if (name.toLowerCase() == 'home') {
            skin = 'index.html';
            title = "Wiki";
        } else {
            skin = 'page.html';
            title = page.name + " - Wiki";
            headline = page.name;
        }
        var version = req.params.version;
        return app.render(skin, {
            page: page,
            title: title,
            headline: headline,
            version: version,
            basePath: req.scriptName
        });
    } else {
        return app.render('new.html', {
            name: name.replace(/_/g, ' ')
        });
    }
});

app.get("/:name/edit", function(req, name) {
    var page = Page.byName(name, req.params.version);
    var idx = 0;
    return app.render('edit.html', {
        title: "Edit " + page.name,
        page: page,
        changes: page.revisions.all,
        // thank mustache for hiding the loop index
        version: function() {
            return idx++;
        },
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



