require('core/string');
include('ringo/webapp/response');
include('./model');
include('./helpers');

exports.index = function(req, name, action) {
    name = name || 'home';
    var page = Page.byName(name);
    if (page) {
        var skin = name.toLowerCase() == 'home' ?
            './skins/index.html' : './skins/page.html';
        page.body = page.revisions[0];
        return skinResponse(skin, {page: page});
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

function updatePage(page, req) {
    if (req.isPost && req.params.save) {
        page.updateFrom(req.params);
        page.save();
        return redirectResponse(toUrl(page.name));
    }
    page.body = req.params.body || page.revisions[0];
    return skinResponse('./skins/edit.html', {page: page});
}

function createPage(name, req) {
    if (req.isPost && req.params.save) {
        var page = new Page();
        page.updateFrom(req.params);
        page.save();
        return redirectResponse(toUrl(page.name));
    }
    return skinResponse('./skins/new.html', {name: name});
};
