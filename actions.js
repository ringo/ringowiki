require('core/string');
include('ringo/webapp/response');
include('./model');
include('./helpers');

exports.index = function(req, name, action) {
    name = name || 'home';
    var page = Page.byName(name);
    if (page) {
        var skin, title;
        if (name.toLowerCase() == 'home') {
            skin = './skins/index.html';
        } else {
            skin = './skins/page.html';
            title = page.name;
        }
        page.body = page.getRevision(req.params.version).body;
        return skinResponse(skin, {page: page, title: title, version: version});
    } else {
        return createPage(name, req);
    }
};

exports.edit = function(req, name) {
    var page = Page.byName(name);
    return updatePage(page, req);
};

exports.list = function(req) {
    return skinResponse('./skins/list.html', {
            pages: Page.all().sort(String.Sorter('name'))});
};

exports.recent = function(req) {
    var limit = req.params.limit || 50;
    var changes = [];

    // Retrieve all changes.
    for each (var page in Page.all()) {
        for (var version in page.revisions) {
            changes.push({
                    page: page,
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
        var curDay = change.created.format('yyyy-MM-dd');
        if (curDay != oldDay) {
            days.push({title: curDay, changes: []});
            oldDay = curDay;
        }
        days[days.length - 1].changes.push(change);
    }
    return skinResponse('./skins/recent.html', {days: days});
};

function updatePage(page, req) {
    if (req.isPost && req.params.save) {
        if (!req.session.data.honeyPotName || req.params[req.session.data.honeyPotName]) {
            throw "Bot detected. <h1>If you are not a bot complain in our mailinglist.</h1>";
        }
        
        page.updateFrom(req.params);
        page.save();
        return redirectResponse(toUrl(page.name));
    }
    page.body = page.getRevision(req.params.version).body;
    req.session.data.honeyPotName = "phonenumber_" + parseInt(Math.random() * 1000);
    return skinResponse('./skins/edit.html', {
        page: page,
        honeyPotName: req.session.data.honeyPotName,
    });
}

function createPage(name, req) {
    if (req.isPost && req.params.save) {
        var page = new Page();
        page.updateFrom(req.params);
        page.save();
        return redirectResponse(toUrl(page.name));
    }
    return skinResponse('./skins/new.html', {name: name.replace(/_/g, ' ')});
}
