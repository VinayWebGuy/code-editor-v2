require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } });

require(['vs/editor/editor.main'], function () {
    let htmlEditor = monaco.editor.create(document.getElementById('htmlEditor'), {
        value: '',
        language: 'html',
        theme: 'vs-dark',
        autoClosingBrackets: 'always'
    });

    let cssEditor = monaco.editor.create(document.getElementById('cssEditor'), {
        value: '',
        language: 'css',
        theme: 'vs-dark',
        autoClosingBrackets: 'always'
    });

    let jsEditor = monaco.editor.create(document.getElementById('jsEditor'), {
        value: '',
        language: 'javascript',
        theme: 'vs-dark',
        autoClosingBrackets: 'always'
    });

    setupAutoCloseTags(htmlEditor);

    function updateOutput() {
        const htmlContent = htmlEditor.getValue();
        const cssContent = cssEditor.getValue();
        const jsContent = jsEditor.getValue();
        const source = '<html><head><style>' + cssContent + '</style></head><body>' + htmlContent + '<script>' + jsContent + '</script></body></html>';
        const iframe = document.getElementById('output');
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(source);
        iframe.contentWindow.document.close();
    }

    htmlEditor.onDidChangeModelContent(updateOutput);
    cssEditor.onDidChangeModelContent(updateOutput);
    jsEditor.onDidChangeModelContent(updateOutput);
});

function setupAutoCloseTags(editor) {
    editor.onDidChangeModelContent((event) => {
        if (event.changes.length && event.changes[0].text === "<") {
            const position = editor.getPosition();
            const word = editor.getModel().getWordUntilPosition(position);
            const tagMatch = word.word.match(/<(\w+)$/);
            if (tagMatch) {
                const tagName = tagMatch[1];
                editor.trigger('keyboard', 'type', { text: "></" + tagName + ">" });
                editor.setPosition({
                    lineNumber: position.lineNumber,
                    column: position.column + 1
                });
            }
        }
    });
}




