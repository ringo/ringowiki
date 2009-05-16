include('helma/webapp/response');
include('model');
include('helpers');

exports.index = function(req, name, action) {
    name = name || 'home';
    var page = Page.byName(name);
    if (page) {
        if (action == 'edit') {
            return updatePage(page, req);
        } else {
            var skin = req.path == '/' ?
                       'skins/index.html' : 'skins/page.html';
            return new SkinnedResponse(skin, { page: page });
        }
    } else {
        return createPage(name, req);
    }
}

exports.list = function(req) {
    return SkinnedResponse('skins/list.html', {pages: Page.all()});
}

function updatePage(page, req) {
    if (req.isPost && req.params.save) {
        page.updateFrom(req.params);
        page.save();
        return new RedirectResponse(toUrl(page.name));
    }
    return new SkinnedResponse('skins/edit.html', {page: page });
}

function createPage(name, req) {
    if (req.isPost && req.params.save) {
        page = new Page(req.params);
        page.save();
        return new RedirectResponse(toUrl(page.name));
    }
    return new SkinnedResponse('skins/new.html', { name: name });
}