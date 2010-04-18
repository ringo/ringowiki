include('ringo/markdown');
include('./model');
require('core/array');
require('core/string');
var render = require('ringo/skin').render;

export('markdown_filter', 'toUrl_filter', 'navigation_macro', 'toUrl');

function markdown_filter(content) {
    var markdown = new Markdown({
        lookupLink: function(id) {
            if (!id.startsWith("/") && !id.isUrl()) {
                return [toUrl(id),
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

function toUrl_filter(name, tag) {
    return toUrl(name, tag.parameters[0]);
}

function navigation_macro(tag) {
    var page = Page.byName("navigation");
    if (page) {
        return render('./skins/navigation.txt', {
            content: page.getRevision().body
        });
    }
    return '';
}

function toUrl(name, action) {
    if (name.toLowerCase() == "home" && !action) {
        return require("./config").rootPath;
    } else {
        action = action || "";
        name = name.replace(/\s/g, '_');
        return require("./config").rootPath + encodeURI(name) + "/"  + action;
    }
}
