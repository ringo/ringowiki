include('helma/markdown');
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
        }
    });
    return markdown.process(content);
};

function toUrl_filter(name) {
    return toUrl(name);
}

function toUrl(name) {
    return "/" + encodeURI(name) + "/";
}