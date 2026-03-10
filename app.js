registerContinuousToolbox();

var DEFAULT_SETTINGS = {
    theme: 'dark',
    renderer: 'zeus',
    gridSnap: true,
    gridSpacing: 25,
    gridColour: '',
    zoomWheel: true,
    zoomControls: true,
    zoomMin: 0.3,
    zoomMax: 3,
    trashcan: true,
    sounds: true
};
var THEME_CONFIGS = {
    dark: {
        workspaceBackground: '#000000',
        gridColour: '#333333'
    },
    light: {
        workspaceBackground: '#ffffff',
        gridColour: '#c8c8c8'
    }
};
var BASE_TOOLBOX = getBaseToolboxConfig();
var SEARCH_INDEX = buildBlockSearchIndex(BASE_TOOLBOX);
var currentSearchQuery = '';
var searchUpdateTimer = null;
var currentSettings = getSavedSettings();
var currentWorkspaceFindText = '';
var currentWorkspaceFindIndex = -1;

function getSavedSettings() {
    try {
        var saved = localStorage.getItem('pooide2_settings');
        if (!saved) return Object.assign({}, DEFAULT_SETTINGS);
        return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(saved));
    } catch (_) {
        return Object.assign({}, DEFAULT_SETTINGS);
    }
}

function cloneToolboxConfig(toolbox) {
    return JSON.parse(JSON.stringify(toolbox));
}

function resolveTheme(theme) {
    return theme === 'light' ? 'light' : 'dark';
}

function getThemeConfig(theme) {
    return THEME_CONFIGS[resolveTheme(theme)];
}

function getResolvedGridColour(settings) {
    var resolved = Object.assign({}, DEFAULT_SETTINGS, settings || {});
    return resolved.gridColour || getThemeConfig(resolved.theme).gridColour;
}

function applyTheme(theme) {
    var resolvedTheme = resolveTheme(theme);
    var themeConfig = getThemeConfig(resolvedTheme);
    document.body.setAttribute('data-theme', resolvedTheme);
    document.documentElement.style.setProperty('--workspace-bg', themeConfig.workspaceBackground);
    document.documentElement.style.setProperty('color-scheme', resolvedTheme);
}

function getBaseToolboxConfig() {
    var toolbox = cloneToolboxConfig(myToolbox);
    toolbox.contents = (toolbox.contents || []).filter(function (item) {
        return item && item.kind === 'category';
    });
    return toolbox;
}

function normaliseSearchText(text) {
    return String(text || '')
        .toLowerCase()
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function humaniseBlockType(type) {
    return String(type || '').replace(/_/g, ' ').trim();
}

function getBlockSearchLabel(type) {
    var tempWorkspace = new Blockly.Workspace();

    try {
        var block = tempWorkspace.newBlock(type);
        var label = block.toString();
        block.dispose(false);
        return label || humaniseBlockType(type);
    } catch (_) {
        return humaniseBlockType(type);
    } finally {
        tempWorkspace.dispose();
    }
}

function buildBlockSearchIndex(toolbox) {
    var index = [];

    (toolbox.contents || []).forEach(function (category) {
        if (!category || category.kind !== 'category') return;

        (category.contents || []).forEach(function (item) {
            if (!item || item.kind !== 'block' || !item.type) return;

            var label = getBlockSearchLabel(item.type);
            var searchText = normaliseSearchText([
                label,
                item.type,
                humaniseBlockType(item.type)
            ].join(' '));

            index.push({
                type: item.type,
                label: label,
                searchText: searchText
            });
        });
    });

    return index;
}

function buildFilteredToolbox(query) {
    var normalisedQuery = normaliseSearchText(query);
    if (!normalisedQuery) {
        return cloneToolboxConfig(BASE_TOOLBOX);
    }

    var terms = normalisedQuery.split(' ').filter(Boolean);
    var matches = [];

    SEARCH_INDEX.forEach(function (entry) {
        var isMatch = terms.every(function (term) {
            return entry.searchText.indexOf(term) !== -1;
        });

        if (!isMatch) return;

        matches.push({
            kind: 'block',
            type: entry.type
        });
    });

    return {
        kind: 'categoryToolbox',
        contents: [{
            kind: 'category',
            name: matches.length ? 'Results' : 'No Results',
            colour: '#999999',
            contents: matches
        }]
    };
}

function getWorkspaceFindMatches(query) {
    var queryKey = normaliseSearchText(query);
    if (!queryKey || !workspace || typeof workspace.getAllBlocks !== 'function') {
        return [];
    }

    var terms = queryKey.split(' ').filter(Boolean);
    return workspace.getAllBlocks(false).filter(function (block) {
        if (!block || block.isInFlyout) return false;
        if (typeof block.isShadow === 'function' && block.isShadow()) return false;

        var blockText = normaliseSearchText([
            block.toString(),
            block.type,
            humaniseBlockType(block.type)
        ].join(' '));

        return terms.every(function (term) {
            return blockText.indexOf(term) !== -1;
        });
    });
}

function focusWorkspaceFindMatch(block) {
    if (!block) return;
    var previouslySelected =
        typeof Blockly.getSelected === 'function'
            ? Blockly.getSelected()
            : (Blockly.selected || null);

    if (
        previouslySelected &&
        previouslySelected !== block &&
        typeof previouslySelected.unselect === 'function'
    ) {
        previouslySelected.unselect();
    }

    if (typeof block.select === 'function') {
        block.select();
    }

    if (workspace && typeof workspace.centerOnBlock === 'function') {
        workspace.centerOnBlock(block.id);
    }
}

function setWorkspaceFindStatus(text, isError) {
    var status = document.getElementById('workspaceFindStatus');
    if (!status) return;
    status.textContent = text || '';
    status.classList.toggle('error', !!isError);
}

function runWorkspaceFind() {
    var input = document.getElementById('workspaceFindInput');
    if (!input) return;

    var rawText = String(input.value || '');
    var queryKey = normaliseSearchText(rawText);
    if (!queryKey) {
        currentWorkspaceFindText = '';
        currentWorkspaceFindIndex = -1;
        setWorkspaceFindStatus('Type something to search.', false);
        return;
    }

    var previousKey = normaliseSearchText(currentWorkspaceFindText);
    var matches = getWorkspaceFindMatches(rawText);
    currentWorkspaceFindText = rawText;

    if (!matches.length) {
        currentWorkspaceFindIndex = -1;
        setWorkspaceFindStatus('No matching blocks.', true);
        return;
    }

    if (queryKey !== previousKey || currentWorkspaceFindIndex < 0) {
        currentWorkspaceFindIndex = 0;
    } else {
        currentWorkspaceFindIndex = (currentWorkspaceFindIndex + 1) % matches.length;
    }

    focusWorkspaceFindMatch(matches[currentWorkspaceFindIndex]);
    setWorkspaceFindStatus((currentWorkspaceFindIndex + 1) + ' of ' + matches.length + ' matches', false);
}

function openWorkspaceFind() {
    var findWindow = document.getElementById('workspaceFindWindow');
    var input = document.getElementById('workspaceFindInput');
    if (!findWindow || !input) return;

    findWindow.classList.add('open');
    input.value = currentWorkspaceFindText;
    if (!currentWorkspaceFindText) {
        setWorkspaceFindStatus('Type something to search.', false);
    }
    requestAnimationFrame(function () {
        input.focus();
        input.select();
    });
}

function closeWorkspaceFind() {
    var findWindow = document.getElementById('workspaceFindWindow');
    if (!findWindow) return;
    findWindow.classList.remove('open');
}

function setupWorkspaceFindWindow() {
    if (window.__workspaceFindWindowBound) return;
    window.__workspaceFindWindowBound = true;

    var findWindow = document.getElementById('workspaceFindWindow');
    var header = document.getElementById('workspaceFindHeader');
    var closeButton = document.getElementById('workspaceFindClose');
    var input = document.getElementById('workspaceFindInput');
    var nextButton = document.getElementById('workspaceFindNext');
    if (!findWindow || !header || !closeButton || !input || !nextButton) return;

    var dragState = null;

    function clampWorkspaceFindWindow() {
        var maxLeft = Math.max(8, window.innerWidth - findWindow.offsetWidth - 8);
        var maxTop = Math.max(8, window.innerHeight - findWindow.offsetHeight - 8);
        var left = parseFloat(findWindow.style.left);
        var top = parseFloat(findWindow.style.top);

        if (!isNaN(left)) {
            findWindow.style.left = Math.min(Math.max(8, left), maxLeft) + 'px';
        }

        if (!isNaN(top)) {
            findWindow.style.top = Math.min(Math.max(8, top), maxTop) + 'px';
        }
    }

    function handlePointerMove(event) {
        if (!dragState) return;
        var maxLeft = Math.max(8, window.innerWidth - findWindow.offsetWidth - 8);
        var maxTop = Math.max(8, window.innerHeight - findWindow.offsetHeight - 8);
        var nextLeft = Math.min(Math.max(8, event.clientX - dragState.offsetX), maxLeft);
        var nextTop = Math.min(Math.max(8, event.clientY - dragState.offsetY), maxTop);

        findWindow.style.right = 'auto';
        findWindow.style.left = nextLeft + 'px';
        findWindow.style.top = nextTop + 'px';
    }

    function handlePointerUp() {
        dragState = null;
    }

    header.addEventListener('pointerdown', function (event) {
        if (event.button !== 0) return;
        if (event.target && event.target.closest('button')) return;

        var rect = findWindow.getBoundingClientRect();
        findWindow.style.right = 'auto';
        findWindow.style.left = rect.left + 'px';
        findWindow.style.top = rect.top + 'px';
        dragState = {
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top
        };
        event.preventDefault();
    });

    closeButton.addEventListener('click', closeWorkspaceFind);
    nextButton.addEventListener('click', runWorkspaceFind);
    input.addEventListener('input', function () {
        currentWorkspaceFindIndex = -1;
        if (!normaliseSearchText(input.value)) {
            setWorkspaceFindStatus('Type something to search.', false);
            return;
        }
        setWorkspaceFindStatus('Press Enter or Find Next.', false);
    });
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            runWorkspaceFind();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            closeWorkspaceFind();
        }
    });

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('resize', clampWorkspaceFindWindow);
    setWorkspaceFindStatus('Type something to search.', false);
}

function buildWorkspaceOptions(settings) {
    var resolved = Object.assign({}, DEFAULT_SETTINGS, settings || {});
    return {
        renderer: resolved.renderer,
        toolbox: buildFilteredToolbox(currentSearchQuery),
        plugins: {
            toolbox: ContinuousToolbox,
            flyoutsVerticalToolbox: ContinuousFlyout,
            metricsManager: ContinuousMetrics,
        },
        zoom: {
            controls: resolved.zoomControls,
            wheel: resolved.zoomWheel,
            startScale: 1.0,
            maxScale: resolved.zoomMax,
            minScale: resolved.zoomMin,
            scaleSpeed: 1.12,
            pinch: true
        },
        trashcan: resolved.trashcan,
        move: {
            scrollbars: {
                horizontal: true,
                vertical: true
            },
            drag: true,
            wheel: false
        },
        grid: {
            spacing: resolved.gridSpacing,
            length: 3,
            colour: getResolvedGridColour(resolved),
            snap: resolved.gridSnap
        },
        sounds: resolved.sounds,
        media: 'https://unpkg.com/blockly/media/'
    };
}

function attachWorkspaceHelpers(ws) {
    forceInlineInputs(ws);
    ws.addChangeListener(function () {
        forceInlineInputs(ws);
    });
    setupReporterBubbles(ws);

    ws.addChangeListener(function (e) {
        if (e.isUiEvent) return;
        try {
            var xml = Blockly.Xml.workspaceToDom(ws);
            var text = Blockly.Xml.domToText(xml);
            localStorage.setItem('pooide2_autosave', text);
        } catch (_) { }
    });
}

function setupToolbarSearch() {
    var searchShell = document.getElementById('toolbarSearch');
    var toggle = document.getElementById('toolbarSearchToggle');
    var input = document.getElementById('toolbarSearchInput');
    if (!searchShell || !toggle || !input) return;

    input.value = currentSearchQuery;

    function syncExpandedState() {
        searchShell.classList.toggle('expanded', !!currentSearchQuery || document.activeElement === input);
    }

    toggle.addEventListener('click', function () {
        var isExpanded = searchShell.classList.contains('expanded');
        if (!isExpanded) {
            searchShell.classList.add('expanded');
            input.focus();
            return;
        }

        if (input.value) {
            input.value = '';
            updateWorkspaceToolbox('');
        }

        input.blur();
        syncExpandedState();
    });

    input.addEventListener('focus', syncExpandedState);
    input.addEventListener('blur', function () {
        requestAnimationFrame(syncExpandedState);
    });
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            input.blur();
            syncExpandedState();
        }
    });
    input.addEventListener('input', function () {
        var value = input.value;
        searchShell.classList.add('expanded');
        window.clearTimeout(searchUpdateTimer);
        searchUpdateTimer = window.setTimeout(function () {
            if (value === currentSearchQuery) return;
            updateWorkspaceToolbox(value);
            syncExpandedState();
        }, 60);
    });

    syncExpandedState();
}

function setupWorkspaceFindShortcut() {
    if (window.__workspaceFindShortcutBound) return;
    window.__workspaceFindShortcutBound = true;

    document.addEventListener('keydown', function (event) {
        if (!event) return;
        var isFindShortcut = (event.ctrlKey || event.metaKey) && !event.altKey && String(event.key).toLowerCase() === 'f';
        if (!isFindShortcut) return;

        event.preventDefault();
        openWorkspaceFind();
    });
}

function getWorkspaceXmlText() {
    if (!workspace) return '';
    try {
        var xml = Blockly.Xml.workspaceToDom(workspace);
        return Blockly.Xml.domToText(xml);
    } catch (_) {
        return '';
    }
}

function rebuildWorkspace(settings, xmlText) {
    if (workspace) {
        workspace.dispose();
    }

    var div = document.getElementById('blocklyDiv');
    div.innerHTML = '';

    window.workspace = Blockly.inject('blocklyDiv', buildWorkspaceOptions(settings));
    workspace = window.workspace;
    attachWorkspaceHelpers(workspace);

    if (xmlText) {
        try {
            var dom = Blockly.utils.xml.textToDom(xmlText);
            Blockly.Xml.domToWorkspace(dom, workspace);
        } catch (_) { }
    }

    requestAnimationFrame(function () {
        forceInlineInputs(workspace);
        if (typeof Blockly.svgResize === 'function') {
            Blockly.svgResize(workspace);
        }
    });
}

function updateWorkspaceToolbox(query) {
    currentSearchQuery = query;
    rebuildWorkspace(currentSettings, getWorkspaceXmlText());
}

applyTheme(currentSettings.theme);
var workspace = Blockly.inject('blocklyDiv', buildWorkspaceOptions(currentSettings));
attachWorkspaceHelpers(workspace);
setupToolbarSearch();
setupWorkspaceFindWindow();
setupWorkspaceFindShortcut();

(function () {
    try {
        var saved = localStorage.getItem('pooide2_autosave');
        if (saved) {
            var xml = Blockly.utils.xml.textToDom(saved);
            Blockly.Xml.domToWorkspace(xml, workspace);
        }
    } catch (_) { }
})();

window.addEventListener('resize', function () {
    Blockly.svgResize(workspace);
});

function openSettings() {
    document.getElementById('s-theme').value = resolveTheme(currentSettings.theme);
    document.getElementById('s-renderer').value = workspace.options.renderer || 'zeus';
    var g = workspace.options.gridOptions || {};
    document.getElementById('s-grid-snap').checked = !!g.snap;
    document.getElementById('s-grid-spacing').value = g.spacing || 25;
    document.getElementById('s-grid-colour').value = g.colour || getResolvedGridColour(currentSettings);
    var z = workspace.options.zoomOptions || {};
    document.getElementById('s-zoom-wheel').checked = !!z.wheel;
    document.getElementById('s-zoom-controls').checked = !!z.controls;
    document.getElementById('s-zoom-min').value = z.minScale || 0.3;
    document.getElementById('s-zoom-max').value = z.maxScale || 3;
    document.getElementById('s-trashcan').checked = !!workspace.options.hasTrashcan;
    document.getElementById('s-sounds').checked = !!workspace.options.hasSounds;
    document.getElementById('settingsOverlay').classList.add('open');
}

function closeSettings() {
    document.getElementById('settingsOverlay').classList.remove('open');
}

function applySettings() {
    var nextTheme = resolveTheme(document.getElementById('s-theme').value);
    var selectedGridColour = document.getElementById('s-grid-colour').value;
    var previousDefaultGrid = getThemeConfig(currentSettings.theme).gridColour.toLowerCase();
    if (String(selectedGridColour || '').toLowerCase() === previousDefaultGrid) {
        selectedGridColour = getThemeConfig(nextTheme).gridColour;
    }

    currentSettings = {
        theme: nextTheme,
        renderer: document.getElementById('s-renderer').value,
        gridSnap: document.getElementById('s-grid-snap').checked,
        gridSpacing: parseInt(document.getElementById('s-grid-spacing').value) || 25,
        gridColour: selectedGridColour,
        zoomWheel: document.getElementById('s-zoom-wheel').checked,
        zoomControls: document.getElementById('s-zoom-controls').checked,
        zoomMin: parseFloat(document.getElementById('s-zoom-min').value) || 0.3,
        zoomMax: parseFloat(document.getElementById('s-zoom-max').value) || 3,
        trashcan: document.getElementById('s-trashcan').checked,
        sounds: document.getElementById('s-sounds').checked
    };

    applyTheme(currentSettings.theme);
    rebuildWorkspace(currentSettings, getWorkspaceXmlText());
    localStorage.setItem('pooide2_settings', JSON.stringify(currentSettings));

    closeSettings();
}
