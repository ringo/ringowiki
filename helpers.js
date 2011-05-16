var {Markdown} = require('ringo/markdown');
var {Page} = require('./model');
var {app} = require('./actions');
var strings = require('ringo/utils/strings');
var mustache = require("ringo/mustache");

export(
    'baseUrl',
    'editUrl',
    'listUrl',
    'markdown',
    'navigation'
);

function baseUrl(name) {
    var url = app.base || "/";
    return name ? url + encodeURI(name) : url;
}

function editUrl(name) {
    name = name.replace(/\s/g, '_');
    return baseUrl() + encodeURI(name) + "/edit";
}

function listUrl() {
    return baseUrl() + "list";
}

function markdown(content) {
    var markdown = new Markdown({
        lookupLink: function(id) {
            if (!strings.startsWith(id, "/") && !strings.isUrl(id.isUrl)) {
                return [baseUrl(id),
                        "link to wiki page"];
            }
            return null;
        },
        openTag: function(tag, buffer) {
            buffer.append('<').append(tag);
            if (tag == "pre") {
                buffer.append(' class="sh_javascript"');
            }
            buffer.append('>');
        }
    });
    return markdown.process(content);
}

function navigation(tag) {
    var page = Page.byName("navigation");
    if (page) {
        return mustache.to_html(
            getResource('./skins/navigation.txt').getContent(), {
                content: page.getRevision().body
            }
        );
    }
    return '';
}
