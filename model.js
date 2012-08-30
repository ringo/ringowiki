var arrays = require('ringo/utils/arrays');
var dates = require("ringo/utils/dates");
var {markdown} = require('./helpers');
var {markSafe} = require('reinhardt/utils');
var {config} = require('./main');

export('Page', 'Revision');

var {Store} = require('ringo-sqlstore');

var store = exports.store = new Store({
    "url":"jdbc:h2:file:" + config.db + 'wiki',
    "driver": "org.h2.Driver"
});

var Page = store.defineEntity('Page', {properties: {
    slug: {
       type: "text"
    },
    revisions: {
        type: "collection",
        query: "from Revision where Revision.page = :id order by Revision.id desc"
    }
}});

var Revision = store.defineEntity('Revision', {properties: {
    body: {
        type: "text"
    },
    name: {
        type: "text"
    },
    created: {
        type: "timestamp"
    },
    page: {
        type: "object",
        entity: "Page"
    }
}});

Revision.getRecent = function(limit) {
    return store.query('from Revision group by Revision.created, Revision.id \
                                                order by Revision.created desc limit ' + limit);
}

Object.defineProperties(Revision.prototype, {
    version: {
        get: function() {
            return this.page.revisions.indexOf(this);
        }
    }
});

Page.byName = function(name, revision) {
    var slug = nameToSlug(name);
    var page = store.query('from Page where Page.slug = :slug limit 1', {slug: slug})[0];
    if (page) {
        page.revision = revision;
        return page;
    }
    return null;
};
Page.allOrdered = function() {
    return store.query('from Page order by Page.slug asc');
}

Object.defineProperties(Page.prototype, {
    "body": {
        get: function() {
            return this.revisions && this.revisions.length > 0 && this.revisions.get(this.revision || 0).body || '';
        }
    },
    "name": {
        get: function() {
            return this.revisions && this.revisions.length > 0 && this.revisions.get(this.revision || 0).name || '';
        }
    },
    "htmlbody": {
        get: function() {
            return markSafe(markdown(this.body))
        }
    }
});

Page.prototype.updateFrom = function(obj) {
    var slug = nameToSlug(obj.name);
    if (this.slug != slug) {
        this.slug = slug;
        this.save();
    };
    obj.created = new Date();
    obj.page = this;
    var rev = new Revision(obj);
    rev.save();
    this.revisions.invalidate();
};

function nameToSlug(name) {
    return name ? name.toLowerCase().replace(/\s/g, '_') : null;
}
