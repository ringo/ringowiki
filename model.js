export('Page');
module.shared = true;

var Page = require('config').store.defineClass('Page');

Page.byName = function(name) {
    name = name.toLowerCase();
    var pages = Page.all()
        .filter(function(page) page.name.toLowerCase() == name);
    return pages[0];
}

Page.prototype.updateFrom = function(obj) {
    this.name = obj.name;
    this.version = (typeof this.version === 'undefined') ? 1 :
            this.version + 1;
    if (typeof this.revisions === 'undefined') {
        this.revisions = [];
    }
    this.revisions.push({version: this.version, body: obj.body});
}
