(function () {
    const md = window.markdownit({
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(str, { language: lang }).value;
                } catch (__) { }
            }

            return '';
        }
    });
    document.addEventListener('htmx:afterOnLoad', (evt) => {
        if (evt.detail.target.id == "response") {
            const markDownData = evt.detail.xhr.responseText;
            const htmlData = md.render(markDownData);
            evt.detail.target.innerHTML = htmlData;
            hljs.highlightAll();
        }
    })
})();