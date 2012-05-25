var {Sorter} = require('ringo/utils/strings');
var response = require('ringo/jsgi/response');
var {Page} = require('./model');
var {Application} = require("stick");
var dates = require("ringo/utils/dates");

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

var getRecentChanges = function(limit) {
    var changes = [];

    // Retrieve all changes.
    for each (var page in Page.all()) {
        for (var version in page.revisions) {
            changes.push({
                    name: page.name,
                    version: version,
                    created: new Date(page.revisions[version].created)});
        }
    }

    // Sort them reverse chronologically.
    changes.sort(function (a, b) a.created > b.created ? -1 : 1);

    // Group changes by day.
    // @@ We probably should not manually do the grouping here, but rather use
    // a nice grouping function in some library somewhere.
    var days = [];
    var oldDay;
    for each (var change in changes.slice(0, limit)) {
        var curDay = dates.format(change.created, 'yyyy-MM-dd');
        if (curDay != oldDay) {
            days.push({title: curDay, changes: []});
            oldDay = curDay;
        }
        days[days.length - 1].changes.push(change);
    }
    return days;
}

app.get("/recent", function(req) {
    return app.render("recent.html", {days: getRecentChanges(req.params.limit || 50), title: "Recent Changes", headline: "Recent Changes"});
});

app.get("/recent/rss", function(req) {
    var absoluteUrl = (req.scheme + "://" + req.host + (req.port != 80 ? ":" + req.port : ""));
    return app.render(
        "recent.rss",
        {
            days: getRecentChanges(req.params.limit || 50),
            title: "Recent Changes",
            headline: "Recent Changes",
            absoluteUrl: absoluteUrl,
            items: app.renderPart("items.rss", {days: getRecentChanges(req.params.limit || 50), absoluteUrl: absoluteUrl})
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
        page.body = page.getRevision(req.params.version).body;
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

    var changes = [];
    for (var version in page.revisions) {
        changes.push({
            name: page.name,
            version: version,
            created: new Date(page.revisions[version].created)
        });
    }

    return app.render('edit.html', {
        title: "Edit " + page.name,
        page: page,
        changes: changes,
        currentVersion: changes.length
    });
});

app.post("/:name/edit", function(req, name) {
    if (req.params.hm != "yes") {
        return response.html("Sorry, this wiki is humans only.");
    }
    var page = Page.byName(name);
    page.updateFrom(req.params);
    page.save();
    return response.redirect(req.scriptName + "/" + encodeURIComponent(page.name));
});



