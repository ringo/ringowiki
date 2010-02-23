include('ringo/markdown');
require('core/string');

export('markdown_filter', 'toUrl_filter', 'toUrl');

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
};

function toUrl_filter(name, tag) {
    return toUrl(name, tag.parameters[0]);
}

function toUrl(name, action) {
    if (name.toLowerCase() == "home" && !action) {
        return "/";
    } else {
        action = action || "";
        return "/" + encodeURI(name) + "/"  + action;
    }
}
