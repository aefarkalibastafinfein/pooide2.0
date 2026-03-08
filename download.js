(function () {
    var PREVIEW_STORAGE_PREFIX = 'pooide2_preview_';
    var PREVIEW_MAX_AGE_MS = 10 * 60 * 1000;

    function getWorkspace() {
        if (window.workspace) return window.workspace;
        if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) return Blockly.getMainWorkspace();
        return null;
    }

    function getPreviewStorageKey(token) {
        return PREVIEW_STORAGE_PREFIX + token;
    }

    function cleanupPreviewPayloads() {
        try {
            var now = Date.now();
            for (var i = localStorage.length - 1; i >= 0; i--) {
                var key = localStorage.key(i);
                if (!key || key.indexOf(PREVIEW_STORAGE_PREFIX) !== 0) continue;
                var raw = localStorage.getItem(key);
                if (!raw) {
                    localStorage.removeItem(key);
                    continue;
                }
                try {
                    var payload = JSON.parse(raw);
                    if (!payload || typeof payload.createdAt !== 'number' || (now - payload.createdAt) > PREVIEW_MAX_AGE_MS) {
                        localStorage.removeItem(key);
                    }
                } catch (_) {
                    localStorage.removeItem(key);
                }
            }
        } catch (_) { }
    }

    function createPreviewToken() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    }

    function storePreviewCode(code) {
        cleanupPreviewPayloads();
        var token = createPreviewToken();
        localStorage.setItem(getPreviewStorageKey(token), JSON.stringify({
            code: code,
            createdAt: Date.now()
        }));
        return token;
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
        downloadBlob(xmlText, filename || 'blocks.poop', 'text/xml');
    }

    function loadBlocksXml() {
        var ws = getWorkspace();
        if (!ws) { alert('Workspace not found'); return; }
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.poop,.xml,text/xml';
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
                    alert('Failed to load project: ' + err.message);
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
        var token;
        try {
            token = storePreviewCode(code);
        } catch (err) {
            alert('Failed to prepare sandboxed preview: ' + err.message);
            return;
        }
        var previewUrl = 'preview.html#' + encodeURIComponent(token);
        var w = window.open(previewUrl, '_blank');
        if (!w) {
            localStorage.removeItem(getPreviewStorageKey(token));
            alert('Popup blocked or failed to open new window');
            return;
        }
        try {
            w.opener = null;
            w.focus();
        } catch (_) { }
    }

    window.downloadBlocksXml = downloadBlocksXml;
    window.loadBlocksXml = loadBlocksXml;
    window.downloadGeneratedPage = downloadGeneratedPage;
    window.runGeneratedPage = runGeneratedPage;
})();
