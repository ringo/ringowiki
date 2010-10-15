export('Page');

addToClasspath('./config'); // To retrieve and load Hibernate config resources.
var Page = require('./config').store.defineEntity('Page', {
    properties: {
        name: {type: 'string', nullable: false},
        body: {type: 'text',   nullable: false}
    }
});

Page.byName = function(name) {
    name = name.toLowerCase();
    return Page.query().equals("name", name).select()[0];
};

Page.prototype.updateFrom = function(obj) {
    this.name = obj.name;
    this.body = obj.body;
    // if (typeof this.revisions === 'undefined') {
    //     this.revisions = [];
    // }
    // this.revisions.unshift(obj.body);
};
