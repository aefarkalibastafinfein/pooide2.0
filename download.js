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

    function loadBlocksXml() {
        var ws = getWorkspace();
        if (!ws) { alert('Workspace not found'); return; }
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xml,text/xml';
        input.onchange = function (e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (ev) {
                try {
                    var xml = Blockly.utils.xml.textToDom(ev.target.result);
                    ws.clear();
                    Blockly.Xml.domToWorkspace(xml, ws);
                } catch (err) {
                    alert('Failed to load XML: ' + err.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
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
        if (!w) { alert('Popup blocked or failed to open new window'); return; }
        w.document.open();
        w.document.write(code);
        w.document.close();
        w.focus();
    }

    window.downloadBlocksXml = downloadBlocksXml;
    window.loadBlocksXml = loadBlocksXml;
    window.downloadGeneratedPage = downloadGeneratedPage;
    window.runGeneratedPage = runGeneratedPage;
})();
