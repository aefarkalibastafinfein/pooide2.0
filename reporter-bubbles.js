(function () {
    function escapeHtml(text) {
        return String(text)
            // Ahhahhahaha regex
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getSelectedBlock() {
        if (typeof Blockly.getSelected === 'function') {
            return Blockly.getSelected();
        }
        return Blockly.selected || null;
    }

    function isReporterBlock(block) {
        return !!(block && block.outputConnection && !block.isInFlyout);
    }

    function getBlockCode(block) {
        var generated = Blockly.JavaScript.blockToCode(block);
        if (Array.isArray(generated)) {
            return generated[0] || '';
        }
        return generated || '';
    }

    function stringifyValue(value) {
        if (typeof value === 'string') return value;
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value, null, 2);
            } catch (_) {
                return String(value);
            }
        }
        return String(value);
    }

    function evaluateJsExpression(code) {
        return Function('"use strict"; return (' + code + ');')();
    }

    function copyTextToClipboard(text) {
        var value = String(text == null ? '' : text);

        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && window.isSecureContext) {
            return navigator.clipboard.writeText(value);
        }

        return new Promise(function (resolve, reject) {
            var textarea = document.createElement('textarea');
            textarea.value = value;
            textarea.setAttribute('readonly', 'readonly');
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            textarea.style.top = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            try {
                if (document.execCommand('copy')) {
                    resolve();
                } else {
                    reject(new Error('Copy failed'));
                }
            } catch (error) {
                reject(error);
            } finally {
                document.body.removeChild(textarea);
            }
        });
    }

    function getReporterResult(block) {
        var code = getBlockCode(block);
        var result;

        if (block.type === 'css_rule') {
            result = {
                kind: 'css',
                value: code,
                valueText: code.trim() || '(empty CSS rule)',
                code: code
            };
        } else {
            try {
                var value = evaluateJsExpression(code);
                result = {
                    kind: typeof value,
                    value: value,
                    valueText: stringifyValue(value),
                    code: code
                };
            } catch (error) {
                result = {
                    kind: 'error',
                    value: code,
                    valueText: stringifyValue(code || '(could not evaluate)'),
                    code: code,
                    error: error && error.message ? error.message : 'Could not evaluate'
                };
            }
        }

        if (block.type === 'colour_hsv_sliders') {
            result.kind = 'colour';
        } else if (block.type === 'string_value' || block.type === 'to_string') {
            result.kind = 'string';
        } else if (block.type === 'number_value') {
            result.kind = 'number';
        } else if (block.type === 'boolean_value') {
            result.kind = 'boolean';
        } else if (block.type === 'raw_expression' && result.kind !== 'error') {
            result.kind = 'expression';
        }

        return result;
    }

    function getDefaultBubbleHtml(context) {
        var valueClass = 'reporter-bubble-value reporter-bubble-' + context.kind;

        if (context.kind === 'css') {
            return '<pre class="' + valueClass + '">' + escapeHtml(context.valueText) + '</pre>';
        }

        return '<div class="' + valueClass + '">' + escapeHtml(context.valueText) + '</div>';
    }

    window.reporterBubbleTemplates = window.reporterBubbleTemplates || {};
    if (typeof window.reporterBubbleTemplates.default !== 'function') {
        window.reporterBubbleTemplates.default = function (context) {
            return getDefaultBubbleHtml(context);
        };
    }

    window.reporterBubbleTemplates.css_rule = window.reporterBubbleTemplates.css_rule || function (context) {
        return getDefaultBubbleHtml(context);
    };

    function renderBubbleHtml(context) {
        var renderer =
            window.reporterBubbleTemplates[context.block.type] ||
            window.reporterBubbleTemplates[context.kind] ||
            window.reporterBubbleTemplates.default;

        if (typeof renderer !== 'function') {
            return getDefaultBubbleHtml(context);
        }

        var rendered = renderer({
            block: context.block,
            value: context.value,
            valueText: context.valueText,
            code: context.code,
            kind: context.kind,
            error: context.error || '',
            escapeHtml: escapeHtml
        });

        if (!rendered) {
            return getDefaultBubbleHtml(context);
        }

        return typeof rendered === 'string'
            ? rendered
            : getDefaultBubbleHtml(context);
    }

    function createBubbleLayer(container) {
        var existing = container.querySelector('.reporter-bubble-layer');
        if (existing) return existing;

        var layer = document.createElement('div');
        layer.className = 'reporter-bubble-layer';
        container.appendChild(layer);
        return layer;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function isMoveEvent(event) {
        if (!event) return false;
        if (event.type === 'move') return true;
        if (typeof Blockly === 'undefined' || !Blockly.Events) return false;
        return event.type === Blockly.Events.BLOCK_MOVE || event.type === Blockly.Events.MOVE;
    }

    function isDragEvent(event) {
        if (!event) return false;
        if (event.type === 'drag') return true;
        if (typeof Blockly === 'undefined' || !Blockly.Events) return false;
        return event.type === Blockly.Events.BLOCK_DRAG || event.type === Blockly.Events.DRAG;
    }

    function setupReporterBubbles(workspace) {
        if (!workspace) return null;

        if (window.__reporterBubbleManager && typeof window.__reporterBubbleManager.destroy === 'function') {
            window.__reporterBubbleManager.destroy();
        }

        var container = document.getElementById('blocklyDiv');
        var layer = createBubbleLayer(container);
        var activeBlock = null;
        var activeBubble = null;

        function getBubbleContentElement() {
            if (!activeBubble) return null;
            return activeBubble.querySelector('.reporter-bubble-content');
        }

        function removeBubble() {
            if (activeBubble && activeBubble.parentNode) {
                activeBubble.parentNode.removeChild(activeBubble);
            }
            activeBubble = null;
            activeBlock = null;
        }

        function updateBubblePosition() {
            if (!activeBlock || !activeBubble) return;

            var svgRoot = activeBlock.getSvgRoot && activeBlock.getSvgRoot();
            if (!svgRoot || !svgRoot.getBoundingClientRect) {
                removeBubble();
                return;
            }

            var blockRect = svgRoot.getBoundingClientRect();
            var containerRect = container.getBoundingClientRect();
            var bubbleRect = activeBubble.getBoundingClientRect();
            var left = blockRect.left - containerRect.left + (blockRect.width / 2) - (bubbleRect.width / 2);
            // i dunno if ill have to change this later but i should propably let myself know:
            // this changes the vertical pos of the bubble
            // pretty ovbious Haha
            // sksfffapfahaffwfawiafwiofawbioabousioeb
            var top = blockRect.bottom - containerRect.top + 50;

            left = clamp(left, 8, Math.max(8, containerRect.width - bubbleRect.width - 8));

            activeBubble.style.left = left + 'px';
            activeBubble.style.top = top + 'px';
        }

        function refreshBubbleContent() {
            if (!activeBlock || !activeBubble) return;

            var result = getReporterResult(activeBlock);
            var bubbleContent = getBubbleContentElement();
            if (!bubbleContent) return;

            activeBubble.dataset.value = stringifyValue(result.valueText);
            activeBubble.title = result.valueText;
            bubbleContent.innerHTML = renderBubbleHtml({
                block: activeBlock,
                value: result.value,
                valueText: result.valueText,
                code: result.code,
                kind: result.kind,
                error: result.error || ''
            });
            requestAnimationFrame(updateBubblePosition);
        }

        function showBubbleForBlock(block) {
            if (!isReporterBlock(block)) return;

            if (activeBlock && activeBlock.id === block.id) {
                removeBubble();
                return;
            }

            removeBubble();

            activeBlock = block;
            activeBubble = document.createElement('div');
            activeBubble.className = 'reporter-bubble';
            activeBubble.innerHTML =
                '<div class="reporter-bubble-box">' +
                '<div class="reporter-bubble-content"></div>' +
                '<div class="reporter-bubble-controls">' +
                '<button type="button" class="reporter-bubble-copy" title="Copy value">Copy</button>' +
                '</div>' +
                '</div>';
            layer.appendChild(activeBubble);
            refreshBubbleContent();
            requestAnimationFrame(function () {
                if (!activeBubble) return;
                activeBubble.classList.add('reporter-bubble-visible');
            });
        }

        function handleDoubleClick() {
            requestAnimationFrame(function () {
                var block = getSelectedBlock();
                if (!isReporterBlock(block)) return;
                showBubbleForBlock(block);
            });
        }

        function handleWorkspaceChange(event) {
            if (!activeBlock || !activeBubble) return;

            if (activeBlock.isDisposed && activeBlock.isDisposed()) {
                removeBubble();
                return;
            }

            if (isDragEvent(event)) {
                removeBubble();
                return;
            }

            if (isMoveEvent(event)) {
                removeBubble();
                return;
            }

            if (event && event.isUiEvent) {
                return;
            }

            refreshBubbleContent();
        }

        function handleResize() {
            requestAnimationFrame(updateBubblePosition);
        }

        function handleGlobalPointerDown(event) {
            if (!activeBubble) return;
            var target = event && event.target;
            var copyButton = target && target.closest ? target.closest('.reporter-bubble-copy') : null;

            if (copyButton && activeBubble.contains(copyButton)) {
                event.preventDefault();
                copyTextToClipboard(activeBubble.dataset.value || '').catch(function () { });
                removeBubble();
                return;
            }

            removeBubble();
        }

        container.addEventListener('dblclick', handleDoubleClick);
        document.addEventListener('pointerdown', handleGlobalPointerDown, true);
        workspace.addChangeListener(handleWorkspaceChange);
        window.addEventListener('resize', handleResize);

        window.__reporterBubbleManager = {
            destroy: function () {
                container.removeEventListener('dblclick', handleDoubleClick);
                document.removeEventListener('pointerdown', handleGlobalPointerDown, true);
                workspace.removeChangeListener(handleWorkspaceChange);
                window.removeEventListener('resize', handleResize);
                removeBubble();
            },
            refresh: refreshBubbleContent
        };

        return window.__reporterBubbleManager;
    }

    window.setupReporterBubbles = setupReporterBubbles;
})();
