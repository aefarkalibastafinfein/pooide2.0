(function () {
    var PREVIEW_STORAGE_PREFIX = 'pooide2_preview_';
    var DEFAULT_PREVIEW_TITLE = 'Preview';

    function getPreviewStorageKey(token) {
        return PREVIEW_STORAGE_PREFIX + token;
    }

    function getPreviewToken() {
        return String(window.location.hash || '').replace(/^#/, '').trim();
    }

    function getPreviewFrame() {
        return document.getElementById('previewFrame');
    }

    function getPreviewTitle(code) {
        try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(code, 'text/html');
            return String(doc.title || '').trim();
        } catch (_) {
            return '';
        }
    }

    function loadPreviewCode() {
        var frame = getPreviewFrame();
        if (!frame) return;

        var token = getPreviewToken();
        if (!token) return;

        var raw = localStorage.getItem(getPreviewStorageKey(token));
        if (!raw) return;

        localStorage.removeItem(getPreviewStorageKey(token));

        try {
            var payload = JSON.parse(raw);
            if (!payload || typeof payload.code !== 'string') return;
            document.title = getPreviewTitle(payload.code) || DEFAULT_PREVIEW_TITLE;
            frame.srcdoc = payload.code;
        } catch (_) { }
    }

    window.addEventListener('DOMContentLoaded', function () {
        loadPreviewCode();
    });
})();
