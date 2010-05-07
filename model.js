require('core/array');
export('Page');
module.shared = true;

var Page = require('./config').store.defineEntity('Page');

Page.byName = function(name) {
    name = name.toLowerCase().replace(/\s/g, '_');
    var pages = Page.all().filter(function(page) {
        return name == page.name.toLowerCase().replace(/\s/g, '_');
    });
    return pages[0];
};

Page.prototype.addRevision = function(body, created) {
    if (typeof this.revisions === 'undefined') {
        this.revisions = [];
    }
    this.revisions.push({body: body, created: created});
};

Page.prototype.getRevision = function(version) {
    var rev = version ? this.revisions[version] : this.revisions.peek();
    return rev ? rev : {body: '', created: new Date()};
};

Page.prototype.updateFrom = function(obj) {
    this.name = obj.name;
    this.addRevision(obj.body, new Date());
};
