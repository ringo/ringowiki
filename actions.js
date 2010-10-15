var strings = require('ringo/utils/strings');
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
        // page.body = page.revisions[0];
        return Response.skin(module.resolve(skin), {page: page, title: title});
    } else {
        return createPage(name, req);
    }
};

exports.edit = function(req, name) {
    var page = Page.byName(name);
    return updatePage(page, req);
};

exports.list = function(req) {
    return Response.skin(module.resolve('./skins/list.html'), {
            pages: Page.query().orderBy('name').select()
    });
};

function updatePage(page, req) {
    if (req.isPost && req.params.save) {
        if (!req.session.data.honeyPotName || req.params[req.session.data.honeyPotName]) {
            throw "Bot detected. <h1>If you are not a bot complain in our mailinglist.</h1>";
        }
        
        page.updateFrom(req.params);
        page.save();
        return Response.redirect(toUrl(page.name));
    }
    // var version = req.params.version || 0;
    // page.body = page.revisions[version];
    req.session.data.honeyPotName = "phonenumber_" + parseInt(Math.random() * 1000);
    return Response.skin(module.resolve('./skins/edit.html'), {
        page: page,
        honeyPotName: req.session.data.honeyPotName,
    });
}

function createPage(name, req) {
    if (req.isPost && req.params.save) {
        var page = new Page();
        page.updateFrom(req.params);
        page.save();
        return Response.redirect(toUrl(page.name));
    }
    return Response.skin(module.resolve('./skins/new.html'), {name: name});
}
