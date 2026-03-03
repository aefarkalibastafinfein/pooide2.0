(function () {
    function getWorkspace() {
        if (window.workspace) return window.workspace;
        if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) return Blockly.getMainWorkspace();
        return null;
    }

    function downloadBlob(text, filename, type) {
        var blob = new Blob([text], { type: type || 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    function downloadBlocksXml(filename) {
        var ws = getWorkspace();
        if (!ws) { alert('Workspace not found'); return; }
        var xmlDom = Blockly.Xml.workspaceToDom(ws);
        var xmlText = Blockly.Xml.domToText(xmlDom);
        downloadBlob(xmlText, filename || 'blocks.xml', 'text/xml');
    }

    function downloadGeneratedPage(filename) {
        var ws = getWorkspace();
        if (!ws) { alert('Workspace not found'); return; }
        var code = Blockly.JavaScript.workspaceToCode(ws);
        downloadBlob(code, filename || 'index.html', 'text/html');
    }

    function runGeneratedPage() {
        var ws = getWorkspace();
        if (!ws) { alert('Workspace not found'); return; }
        var code = Blockly.JavaScript.workspaceToCode(ws);
        var w = window.open('', '_blank');
        if (!w) { alert('Popup blocked or failed to open new window (i think i have no fucking idea)'); return; }
        w.document.open();
        w.document.write(code);
        w.document.close();
        w.focus();
    }

    window.downloadBlocksXml = downloadBlocksXml;
    window.downloadGeneratedPage = downloadGeneratedPage;
    window.runGeneratedPage = runGeneratedPage;
})();
