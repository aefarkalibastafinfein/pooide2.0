var THEME_COLOURS = {
    document: "#5c6370",
    layout: "#4f6b8a",
    content: "#4ec9b0",
    style: "#569cd6",
    styleAccent: "#c586c0",
    script: "#d19a66",
    external: "#98c379",
    picker: "#ce9178"
};

function setDefaultShadow(block, inputName, shadowXml) {
    var input = block.getInput(inputName);
    if (!input) return;
    input.setShadowDom(Blockly.utils.xml.textToDom(shadowXml));
}

function normaliseHexColour(colour) {
    if (!colour || typeof colour !== 'string') return THEME_COLOURS.script;
    if (/^#[0-9a-fA-F]{6}$/.test(colour)) return colour.toLowerCase();
    if (/^#[0-9a-fA-F]{3}$/.test(colour)) {
        return '#' + colour.slice(1).split('').map(function (part) {
            return part + part;
        }).join('').toLowerCase();
    }
    return THEME_COLOURS.script;
}

function lightenHexColour(colour, amount) {
    var hex = normaliseHexColour(colour);
    var channels = [1, 3, 5].map(function (index) {
        return parseInt(hex.slice(index, index + 2), 16);
    }).map(function (channel) {
        return Math.round(channel + (255 - channel) * amount);
    });
    return '#' + channels.map(function (channel) {
        var value = channel.toString(16);
        return value.length === 1 ? '0' + value : value;
    }).join('');
}

var CSS_ATTRIBUTE_OPTIONS = [
    ["background", "background"],
    ["background-color", "background-color"],
    ["background-image", "background-image"],
    ["background-position", "background-position"],
    ["background-repeat", "background-repeat"],
    ["background-size", "background-size"],
    ["color", "color"],
    ["opacity", "opacity"],
    ["font-family", "font-family"],
    ["font-size", "font-size"],
    ["font-weight", "font-weight"],
    ["font-style", "font-style"],
    ["line-height", "line-height"],
    ["letter-spacing", "letter-spacing"],
    ["margin", "margin"],
    ["margin-top", "margin-top"],
    ["margin-right", "margin-right"],
    ["margin-bottom", "margin-bottom"],
    ["margin-left", "margin-left"],
    ["padding", "padding"],
    ["padding-top", "padding-top"],
    ["padding-right", "padding-right"],
    ["padding-bottom", "padding-bottom"],
    ["padding-left", "padding-left"],
    ["text-align", "text-align"],
    ["text-decoration", "text-decoration"],
    ["text-transform", "text-transform"],
    ["text-shadow", "text-shadow"],
    ["white-space", "white-space"],
    ["word-break", "word-break"],
    ["display", "display"],
    ["position", "position"],
    ["top", "top"],
    ["right", "right"],
    ["bottom", "bottom"],
    ["left", "left"],
    ["z-index", "z-index"],
    ["width", "width"],
    ["min-width", "min-width"],
    ["max-width", "max-width"],
    ["height", "height"],
    ["min-height", "min-height"],
    ["max-height", "max-height"],
    ["aspect-ratio", "aspect-ratio"],
    ["border", "border"],
    ["border-width", "border-width"],
    ["border-style", "border-style"],
    ["border-color", "border-color"],
    ["border-radius", "border-radius"],
    ["outline", "outline"],
    ["box-shadow", "box-shadow"],
    ["overflow", "overflow"],
    ["overflow-x", "overflow-x"],
    ["overflow-y", "overflow-y"],
    ["cursor", "cursor"],
    ["visibility", "visibility"],
    ["box-sizing", "box-sizing"],
    ["flex-direction", "flex-direction"],
    ["flex-wrap", "flex-wrap"],
    ["justify-content", "justify-content"],
    ["align-items", "align-items"],
    ["align-content", "align-content"],
    ["gap", "gap"],
    ["row-gap", "row-gap"],
    ["column-gap", "column-gap"],
    ["grid-template-columns", "grid-template-columns"],
    ["grid-template-rows", "grid-template-rows"],
    ["grid-column", "grid-column"],
    ["grid-row", "grid-row"],
    ["object-fit", "object-fit"],
    ["object-position", "object-position"],
    ["transition", "transition"],
    ["transform", "transform"],
    ["animation", "animation"]
];

var SEMANTIC_WRAPPER_OPTIONS = [
    ["section", "section"],
    ["main", "main"],
    ["nav", "nav"],
    ["article", "article"],
    ["aside", "aside"]
];

var ELEMENT_WRAPPER_OPTIONS = [
    ["div", "div"],
    ["section", "section"],
    ["main", "main"],
    ["nav", "nav"],
    ["article", "article"],
    ["aside", "aside"],
    ["header", "header"],
    ["footer", "footer"]
];

var SEMANTIC_WRAPPER_COLOURS = {
    section: THEME_COLOURS.layout,
    main: THEME_COLOURS.content,
    nav: THEME_COLOURS.document,
    article: THEME_COLOURS.layout,
    aside: THEME_COLOURS.document
};

var ELEMENT_WRAPPER_COLOURS = {
    div: THEME_COLOURS.layout,
    section: THEME_COLOURS.layout,
    main: THEME_COLOURS.content,
    nav: THEME_COLOURS.document,
    article: THEME_COLOURS.layout,
    aside: THEME_COLOURS.document,
    header: THEME_COLOURS.document,
    footer: THEME_COLOURS.document
};

function getSemanticWrapperBaseColour(tag) {
    return SEMANTIC_WRAPPER_COLOURS[tag] || THEME_COLOURS.layout;
}

function getElementWrapperBaseColour(tag) {
    return ELEMENT_WRAPPER_COLOURS[tag] || THEME_COLOURS.layout;
}

function getContainingParent(block) {
    if (!block) return null;
    if (typeof block.getSurroundParent === 'function') {
        return block.getSurroundParent();
    }
    return null;
}

function getNearestBranchColourState(block, baseColour) {
    var parent = getContainingParent(block);
    while (parent) {
        if (
            parent.__matchParentColourState &&
            parent.__matchParentColourState.base === baseColour
        ) {
            return parent.__matchParentColourState;
        }
        parent = getContainingParent(parent);
    }
    return null;
}

function syncMatchedBlockColour(block) {
    var defaultBase = block.__defaultMatchParentColour || normaliseHexColour(block.getColour());
    var state = {
        base: defaultBase,
        shade: 0
    };

    var sameColourBranchState = getNearestBranchColourState(block, defaultBase);
    if (sameColourBranchState) {
        state.shade = sameColourBranchState.shade === 0 ? 1 : 0;
    }

    block.__matchParentColourState = state;
    var targetColour = state.shade === 0 ? defaultBase : lightenHexColour(defaultBase, 0.18);
    if (normaliseHexColour(block.getColour()) === targetColour) return;
    block.setColour(targetColour);
}

function escapeShadowText(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function registerStringShadowExtension(name, defaults) {
    Blockly.Extensions.register(name, function () {
        defaults.forEach(function (item) {
            setDefaultShadow(
                this,
                item.inputName,
                '<shadow type="string_value"><field name="TEXT">' +
                escapeShadowText(item.text) +
                '</field></shadow>'
            );
        }, this);
    });
}

registerStringShadowExtension('page_title_default_string_shadow', [
    { inputName: 'TEXT', text: 'My Website' }
]);
registerStringShadowExtension('div_default_string_shadows', [
    { inputName: 'DIV_NAME', text: 'myDiv' },
    { inputName: 'DIV_CLASS', text: 'myClass' }
]);
registerStringShadowExtension('button_default_string_shadow', [
    { inputName: 'LABEL', text: 'Click me' }
]);
registerStringShadowExtension('paragraph_default_string_shadow', [
    { inputName: 'CONTENT', text: 'Testing testing' }
]);
registerStringShadowExtension('span_default_string_shadow', [
    { inputName: 'TEXT', text: 'Inline text' }
]);
registerStringShadowExtension('heading_default_string_shadow', [
    { inputName: 'TEXT', text: 'Heading text' }
]);
registerStringShadowExtension('alert_default_string_shadow', [
    { inputName: 'VALUE', text: 'Hello world' }
]);
registerStringShadowExtension('log_default_string_shadow', [
    { inputName: 'VALUE', text: 'Hello console' }
]);
registerStringShadowExtension('redirect_default_string_shadow', [
    { inputName: 'URL', text: 'https://example.com' }
]);
registerStringShadowExtension('to_string_default_string_shadow', [
    { inputName: 'VALUE', text: 'hello' }
]);
registerStringShadowExtension('raw_expression_default_string_shadow', [
    { inputName: 'CODE', text: 'document.title' }
]);
registerStringShadowExtension('set_style_attribute_default_string_shadows', [
    { inputName: 'ELEMENT', text: 'html' },
    { inputName: 'VALUE', text: 'black' }
]);
registerStringShadowExtension('href_link_default_string_shadow', [
    { inputName: 'URL', text: 'http://afkdev.me/index.css' }
]);
registerStringShadowExtension('link_default_string_shadows', [
    { inputName: 'TEXT', text: 'Visit site' },
    { inputName: 'URL', text: 'https://example.com' }
]);
registerStringShadowExtension('image_default_string_shadows', [
    { inputName: 'SRC', text: 'https://example.com/image.png' },
    { inputName: 'ALT', text: 'Example media' },
    { inputName: 'WIDTH', text: '' },
    { inputName: 'HEIGHT', text: '' }
]);
registerStringShadowExtension('list_item_default_string_shadow', [
    { inputName: 'TEXT', text: 'List item' }
]);
registerStringShadowExtension('css_rule_default_string_shadow', [
    { inputName: 'SELECTOR', text: 'card' }
]);
registerStringShadowExtension('css_property_default_string_shadow', [
    { inputName: 'VALUE', text: 'black' }
]);

Blockly.Extensions.register('custom_style_default_multiline_shadow', function () {
    setDefaultShadow(
        this,
        'STYLE',
        '<shadow type="multiline_string_value"><field name="TEXT">' +
        escapeShadowText('body {\n  background-color: red;\n}') +
        '</field></shadow>'
    );
});

Blockly.Extensions.register('match_parent_colour', function () {
    var block = this;
    block.__defaultMatchParentColour = normaliseHexColour(block.getColour());
    syncMatchedBlockColour(block);
    block.setOnChange(function () {
        syncMatchedBlockColour(block);
    });
});

Blockly.Extensions.register('leaf_output_shape', function () {
    if (typeof this.setOutputShape !== 'function') return;
    this.setOutputShape(10);
});

function chainOnChange(block, fn) {
    if (!block || typeof block.setOnChange !== 'function') return;
    var previous = block.onchange;
    block.setOnChange(function (event) {
        if (typeof previous === 'function') {
            try {
                previous.call(block, event);
            } catch (_) { }
        }
        fn.call(block, event);
    });
}

Blockly.Extensions.register('selector_type_hides_name_input', function () {
    var block = this;
    if (block.__selectorTypeHidesNameBound) return;
    block.__selectorTypeHidesNameBound = true;

    function updateVisibility() {
        var field = block.getField && block.getField('SELECTOR_TYPE');
        if (!field) return;
        var selectorType = String(field.getValue() || 'element');
        var input = (block.getInput && (block.getInput('SELECTOR') || block.getInput('ELEMENT'))) || null;
        if (!input || typeof input.setVisible !== 'function') return;

        var shouldShow = selectorType !== 'all';
        if (typeof input.isVisible === 'function' && input.isVisible() === shouldShow) return;
        input.setVisible(shouldShow);
        if (block.rendered && typeof block.render === 'function') {
            block.render();
        }
    }

    chainOnChange(block, updateVisibility);
    updateVisibility();
});

Blockly.Extensions.register('semantic_wrapper_colour', function () {
    var block = this;
    function syncSemanticWrapperColour() {
        block.__defaultMatchParentColour = normaliseHexColour(
            getSemanticWrapperBaseColour(block.getFieldValue('TAG'))
        );
        syncMatchedBlockColour(block);
    }

    syncSemanticWrapperColour();
    block.setOnChange(function () {
        syncSemanticWrapperColour();
    });
});

Blockly.Extensions.register('element_wrapper_behaviour', function () {
    var block = this;
    function addElementWrapperInput(inputName, labelText) {
        if (block.getInput(inputName)) return;
        block.appendValueInput(inputName)
            .setCheck('String')
            .appendField(labelText);
        block.moveInputBefore(inputName, 'NAME');
        setDefaultShadow(
            block,
            inputName,
            '<shadow type="string_value"><field name="TEXT"></field></shadow>'
        );
    }

    function removeElementWrapperInput(inputName) {
        if (!block.getInput(inputName)) return;
        block.removeInput(inputName, true);
    }

    function syncElementWrapperBlock() {
        var isDiv = block.getFieldValue('TAG') === 'div';
        if (isDiv) {
            addElementWrapperInput('ELEMENT_ID', 'id:');
            addElementWrapperInput('ELEMENT_CLASS', 'class:');
        } else {
            removeElementWrapperInput('ELEMENT_ID');
            removeElementWrapperInput('ELEMENT_CLASS');
        }

        block.__defaultMatchParentColour = normaliseHexColour(
            getElementWrapperBaseColour(block.getFieldValue('TAG'))
        );
        syncMatchedBlockColour(block);
    }

    syncElementWrapperBlock();
    block.setOnChange(function () {
        syncElementWrapperBlock();
    });
});

Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "page_title",
        "message0": "page title: %1",
        "args0": [{
            "type": "input_value",
            "name": "TEXT",
            "check": "String"
        }],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.document,
        "tooltip": "Poopy poopy butt dookie",
        "extensions": ["page_title_default_string_shadow"]
    },
    {
        "type": "custom_style",
        "message0": "custom raw style: %1",
        "args0": [{
            "type": "input_value",
            "name": "STYLE",
            "check": "String"
        }],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.style,
        "tooltip": "Poopy poopy butt dookie",
        "extensions": ["custom_style_default_multiline_shadow"]
    },
    {
        "type": "html_wrapper",
        "tooltip": "tuff",
        "helpUrl": "tuff.com",
        "message0": "html %1 %2",
        "args0": [
            {
                "type": "input_dummy",
                "name": "NAME"
            },
            {
                "type": "input_statement",
                "name": "HTML",
                "check": "HtmlStatement"
            }
        ],
        "previousStatement": "HtmlStatement",
        "colour": THEME_COLOURS.document,
        "extensions": ["match_parent_colour"]
    },
    {
        "type": "body_wrapper",
        "tooltip": "tuff",
        "helpUrl": "tuff.com",
        "message0": "body %1 %2",
        "args0": [
            {
                "type": "input_dummy",
                "name": "NAME"
            },
            {
                "type": "input_statement",
                "name": "HTML",
                "check": "HtmlStatement"
            }
        ],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.document,
        "extensions": ["match_parent_colour"]
    },
    {
        "type": "head_wrapper",
        "tooltip": "tuff",
        "helpUrl": "tuff.com",
        "message0": "head %1 %2",
        "args0": [
            {
                "type": "input_dummy",
                "name": "NAME"
            },
            {
                "type": "input_statement",
                "name": "HTML",
                "check": "HtmlStatement"
            }
        ],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.document,
        "tooltip": "AAAaaaaAAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaA",
        "extensions": ["match_parent_colour"]
    },
    // header and footer blocks kept for compatibility but removed from the toolbox because i made element_wrapper
    {
        "type": "header_wrapper",
        "tooltip": "tuff",
        "helpUrl": "tuff.com",
        "message0": "header %1 %2",
        "args0": [
            {
                "type": "input_dummy",
                "name": "NAME"
            },
            {
                "type": "input_statement",
                "name": "HTML",
                "check": "HtmlStatement"
            }
        ],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.document,
        "tooltip": "AAAaaaaAAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaA",
        "extensions": ["match_parent_colour"]
    },
    {
        "type": "semantic_wrapper",
        "message0": "%1 %2 %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "TAG",
                "options": SEMANTIC_WRAPPER_OPTIONS
            },
            {
                "type": "input_dummy",
                "name": "NAME"
            },
            {
                "type": "input_statement",
                "name": "HTML",
                "check": "HtmlStatement"
            }
        ],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.layout,
        "tooltip": "Generic wrapper for semantic layout tags",
        "extensions": ["semantic_wrapper_colour"]
    },
    {
        "type": "element_wrapper",
        "message0": "%1 %2 %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "TAG",
                "options": ELEMENT_WRAPPER_OPTIONS
            },
            {
                "type": "input_dummy",
                "name": "NAME"
            },
            {
                "type": "input_statement",
                "name": "HTML",
                "check": "HtmlStatement"
            }
        ],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.layout,
        "tooltip": "Generic wrapper for common HTML elements",
        "extensions": ["element_wrapper_behaviour"]
    },

    {
        "type": "divvytuff",
        "tooltip": "fwhoiwfioniwfiafwainppfiwpififn",
        "helpUrl": "tuff.com",
        "message0": "div | name: %1 class: %2 %3 %4",
        "args0": [
            {
                "type": "input_value",
                "name": "DIV_NAME",
                "check": "String"
            },
            {
                "type": "input_value",
                "name": "DIV_CLASS",
                "check": "String"
            },
            {
                "type": "input_dummy",
                "name": "NAME"
            },
            {
                "type": "input_statement",
                "name": "HTML",
                "check": "HtmlStatement"
            }
        ],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.layout,
        "tooltip": "Lowkey just a div",
        "extensions": ["div_default_string_shadows", "match_parent_colour"]
    },
    {
        "type": "button_wrapper",
        "tooltip": "Wrap click actions in a button",
        "helpUrl": "tuff.com",
        "message0": "button | text: %1 %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "LABEL",
                "check": "String"
            },
            {
                "type": "input_dummy",
                "name": "NAME"
            },
            {
                "type": "input_statement",
                "name": "ACTIONS",
                "check": "ScriptStatement"
            }
        ],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.script,
        "tooltip": "Creates a button that runs the blocks inside when clicked",
        "extensions": ["button_default_string_shadow", "match_parent_colour"]
    },

    {
        "type": "p",
        "message0": "paragraph: %1",
        "args0": [{
            "type": "input_value",
            "name": "CONTENT",
            "check": "String"
        }],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.content,
        "tooltip": "AAAaaaaAAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaA",
        "extensions": ["paragraph_default_string_shadow"]
    },
    {
        "type": "span",
        "message0": "span text %1",
        "args0": [{
            "type": "input_value",
            "name": "TEXT",
            "check": "String"
        }],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.content,
        "tooltip": "Inline text wrapper",
        "extensions": ["span_default_string_shadow"]
    },
    {
        "type": "link_block",
        "message0": "link text %1 url %2",
        "args0": [
            {
                "type": "input_value",
                "name": "TEXT",
                "check": "String"
            },
            {
                "type": "input_value",
                "name": "URL",
                "check": "String"
            }
        ],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.content,
        "tooltip": "Create a normal page link",
        "extensions": ["link_default_string_shadows"]
    },
    {
        "type": "image_block",
        "message0": "%1 src %2 text %3 width %4 height %5",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "MEDIA_TYPE",
                "options": [
                    ["image", "image"],
                    ["sound", "sound"],
                    ["video", "video"]
                ]
            },
            {
                "type": "input_value",
                "name": "SRC",
                "check": "String"
            },
            {
                "type": "input_value",
                "name": "ALT",
                "check": "String"
            },
            {
                "type": "input_value",
                "name": "WIDTH",
                "check": "String"
            },
            {
                "type": "input_value",
                "name": "HEIGHT",
                "check": "String"
            }
        ],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.content,
        "tooltip": "Add an image, sound, or video with optional width and height",
        "extensions": ["image_default_string_shadows"]
    },
    {
        "type": "list_wrapper",
        "message0": "%1 list %2 %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "LIST_TYPE",
                "options": [
                    ["unordered", "ul"],
                    ["ordered", "ol"]
                ]
            },
            {
                "type": "input_dummy",
                "name": "NAME"
            },
            {
                "type": "input_statement",
                "name": "ITEMS",
                "check": "HtmlStatement"
            }
        ],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.content,
        "tooltip": "Create an ordered or unordered list"
    },
    {
        "type": "list_item",
        "message0": "list item %1",
        "args0": [{
            "type": "input_value",
            "name": "TEXT",
            "check": "String"
        }],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.content,
        "tooltip": "Item inside a list",
        "extensions": ["list_item_default_string_shadow"]
    },

    {
        type: 'colour_hsv_sliders',
        message0: 'hsv %1',
        args0: [
            {
                type: 'field_colour_hsv_sliders',
                name: 'COLOUR',
                colour: THEME_COLOURS.picker,
            },
        ],
        output: 'Colour',
        style: 'colour_blocks',
        tooltip: 'ABABABAbbaabababABbABabBABabABbababABabABbaBABabABbABABabAbabABaBS',
    },
    {
        "type": "heading",
        "message0": "%1 %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "LEVEL",
                "options": [
                    ["H1", "h1"],
                    ["H2", "h2"],
                    ["H3", "h3"],
                    ["H4", "h4"],
                    ["H5", "h5"],
                    ["H6", "h6"]
                ]
            },
            {
                "type": "input_value",
                "name": "TEXT",
                "check": "String"
            }
        ],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.content,
        "tooltip": "Heading with selectable level (H1–H6)",
        "helpUrl": "https://tungtungtungsahur.tuff",
        "extensions": ["heading_default_string_shadow"]
    },
    {
        "type": "doctype",
        "message0": "<!DOCTYPE html>",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.document,
        "tooltip": "HTML doctype — cannot have blocks above it"
    },
    {
        "type": "br",
        "message0": "line break",
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.content,
        "tooltip": "HTML line break"
    },
    {
        "type": "hr",
        "message0": "horizontal rule",
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.content,
        "tooltip": "HTML horizontal rule"
    },
    {
        "type": "meta",
        "message0": "meta & setup",
        "nextStatement": "HtmlStatement",
        "previousStatement": "HtmlStatement",
        "colour": THEME_COLOURS.document,
        "tooltip": "HTML meta tags — viewport and charset"
    },
    {
        "type": "footer_wrapper",
        "tooltip": "tuff",
        "helpUrl": "tuff.com",
        "message0": "footer %1 %2",
        "args0": [
            {
                "type": "input_dummy",
                "name": "NAME"
            },
            {
                "type": "input_statement",
                "name": "HTML",
                "check": "HtmlStatement"
            }
        ],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.document,
        "tooltip": "AAAaaaaAAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaA",
        "extensions": ["match_parent_colour"]
    },
    {
        "type": "script_wrapper",
        "tooltip": "tuff",
        "helpUrl": "tuff.com",
        "message0": "script %1 %2",
        "args0": [
            {
                "type": "input_dummy",
                "name": "NAME"
            },
            {
                "type": "input_statement",
                "name": "HTML",
                "check": "ScriptStatement"
            }
        ],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.script,
        "tooltip": "AAAaaaaAAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaA",
        "extensions": ["match_parent_colour"]
    },
    {
        "type": "on_page_load",
        "message0": "on page load %1 %2",
        "args0": [
            {
                "type": "input_dummy",
                "name": "NAME"
            },
            {
                "type": "input_statement",
                "name": "ACTIONS",
                "check": "ScriptStatement"
            }
        ],
        "previousStatement": "ScriptStatement",
        "nextStatement": "ScriptStatement",
        "colour": THEME_COLOURS.script,
        "tooltip": "Run the blocks inside when the page finishes loading",
        "extensions": ["match_parent_colour"]
    },
    {
        "type": "alert_block",
        "message0": "alert %1",
        "args0": [
            {
                "type": "input_value",
                "name": "VALUE"
            }
        ],
        "previousStatement": "ScriptStatement",
        "nextStatement": "ScriptStatement",
        "colour": THEME_COLOURS.script,
        "tooltip": "Show an alert popup",
        "extensions": ["alert_default_string_shadow"]
    },
    {
        "type": "log_block",
        "message0": "log %1",
        "args0": [
            {
                "type": "input_value",
                "name": "VALUE"
            }
        ],
        "previousStatement": "ScriptStatement",
        "nextStatement": "ScriptStatement",
        "colour": THEME_COLOURS.script,
        "tooltip": "Write a message to the browser console",
        "extensions": ["log_default_string_shadow"]
    },
    {
        "type": "redirect_block",
        "message0": "redirect to %1",
        "args0": [
            {
                "type": "input_value",
                "name": "URL",
                "check": "String"
            }
        ],
        "previousStatement": "ScriptStatement",
        "nextStatement": "ScriptStatement",
        "colour": THEME_COLOURS.script,
        "tooltip": "Send the page to another URL",
        "extensions": ["redirect_default_string_shadow"]
    },
    {
        "type": "string_value",
        "message0": "%1",
        "args0": [
            {
                "type": "field_input",
                "name": "TEXT",
                "text": "hello"
            }
        ],
        "output": "String",
        "colour": THEME_COLOURS.script,
        "tooltip": "A string JavaScript value",
        "extensions": ["match_parent_colour"]
    },
    {
        "type": "multiline_string_value",
        "message0": "%1",
        "args0": [
            {
                "type": "field_multilinetext",
                "name": "TEXT",
                "text": "oh my\nis this multiline?\n Ohhh it is \n suuuuper tuff hooray",
                "maxLines": 6,
                "spellcheck": false
            }
        ],
        "output": "String",
        "colour": THEME_COLOURS.script,
        "tooltip": "A multi-line string JavaScript value",
        "extensions": ["match_parent_colour"]
    },
    {
        "type": "to_string",
        "message0": "to string %1",
        "args0": [
            {
                "type": "input_value",
                "name": "VALUE"
            }
        ],
        "output": "String",
        "colour": THEME_COLOURS.script,
        "tooltip": "Convert any value to a string",
        "extensions": ["to_string_default_string_shadow", "match_parent_colour"]
    },
    {
        "type": "number_value",
        "message0": "%1",
        "args0": [
            {
                "type": "field_number",
                "name": "VALUE",
                "value": 0
            }
        ],
        "output": "Number",
        "colour": THEME_COLOURS.script,
        "tooltip": "A numeric JavaScript value",
        "extensions": ["match_parent_colour"]
    },
    {
        "type": "boolean_value",
        "message0": "%1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "VALUE",
                "options": [
                    ["true", "true"],
                    ["false", "false"]
                ]
            }
        ],
        "output": "Boolean",
        "colour": THEME_COLOURS.script,
        "tooltip": "A boolean JavaScript value",
        "extensions": ["match_parent_colour"]
    },
    {
        "type": "object_value",
        "message0": "object",
        "output": "Object",
        "colour": THEME_COLOURS.script,
        "tooltip": "A JavaScript object value",
        "extensions": ["match_parent_colour"]
    },
    {
        "type": "array_value",
        "message0": "array",
        "output": "Array",
        "colour": THEME_COLOURS.script,
        "tooltip": "A JavaScript array value",
        "extensions": ["match_parent_colour"]
    },
    {
        "type": "raw_expression",
        "message0": "expression %1",
        "args0": [
            {
                "type": "input_value",
                "name": "CODE",
                "check": "String"
            }
        ],
        "output": null,
        "colour": THEME_COLOURS.script,
        "tooltip": "Raw JavaScript expression",
        "extensions": ["raw_expression_default_string_shadow", "match_parent_colour"]
    },
    {
        "type": "css_rule",
        "message0": "CSS rule %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "SELECTOR_TYPE",
                "options": [
                    ["element", "element"],
                    ["class .", "class"],
                    ["id #", "id"],
                    ["*", "all"]
                ]
            }
        ],
        "message1": "selector %1",
        "args1": [
            {
                "type": "input_value",
                "name": "SELECTOR",
                "check": "String"
            }
        ],
        "message2": "%1",
        "args2": [
            {
                "type": "input_statement",
                "name": "DECLARATIONS",
                "check": "CssDeclaration"
            }
        ],
        "output": "CssRule",
        "colour": THEME_COLOURS.style,
        "tooltip": "Wrap CSS declarations in a selector block (element, .class, or #id)",
        "extensions": ["css_rule_default_string_shadow", "match_parent_colour", "selector_type_hides_name_input", "leaf_output_shape"]
    },
    {
        "type": "add_css_rules",
        "message0": "add CSS rules %1",
        "args0": [
            {
                "type": "input_value",
                "name": "RULE",
                "check": "CssRule"
            }
        ],
        "previousStatement": "CssStatement",
        "nextStatement": "CssStatement",
        "colour": THEME_COLOURS.style,
        "tooltip": "Add a CSS rule inside a style wrapper"
    },
    {
        "type": "css_property",
        "message0": "append css property %1 value %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ATTRIBUTE",
                "options": CSS_ATTRIBUTE_OPTIONS
            },
            {
                "type": "input_value",
                "name": "VALUE"
            }
        ],
        "previousStatement": "CssDeclaration",
        "nextStatement": "CssDeclaration",
        "colour": THEME_COLOURS.style,
        "tooltip": "A CSS declaration for use inside a CSS rule",
        "extensions": ["css_property_default_string_shadow"]
    },


    {
        "type": "set_style_attribute",
        "message0": "set style attribute %1 of %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ATTRIBUTE",
                "options": CSS_ATTRIBUTE_OPTIONS
            },
            {
                "type": "field_dropdown",
                "name": "SELECTOR_TYPE",
                "options": [
                    ["element", "element"],
                    ["class .", "class"],
                    ["id #", "id"],
                    ["*", "all"]
                ]
            }
        ],
        "message1": "%1 to %2",
        "args1": [
            {
                "type": "input_value",
                "name": "ELEMENT",
                "check": "String"
            },
            {
                "type": "input_value",
                "name": "VALUE",
                "check": "String"
            }
        ],
        "inputsInline": true,
        "previousStatement": "CssStatement",
        "nextStatement": "CssStatement",
        "colour": THEME_COLOURS.styleAccent,
        "tooltip": "You HAVE to put this in a style wrapper or it wont work 🤤"
        , "extensions": ["set_style_attribute_default_string_shadows", "selector_type_hides_name_input"]
    },

    {
        "type": "href_link",
        "message0": "external file %1 URL: %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "TYPE",
                "options": [
                    ["Stylesheet", "stylesheet"],
                    ["Script", "script"]
                ]
            },
            {
                "type": "input_value",
                "name": "URL",
                "check": "String"
            }
        ],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.external,
        "tooltip": "Include an external CSS or JS file via href/src"
        , "extensions": ["href_link_default_string_shadow"]
    },

    {
        "type": "style_wrapper",
        "tooltip": "tuff",
        "helpUrl": "",
        "message0": "style %1 %2",
        "args0": [
            {
                "type": "input_dummy",
                "name": "NAME"
            },
            {
                "type": "input_statement",
                "name": "HTML",
                "check": "CssStatement"
            }
        ],
        "previousStatement": "HtmlStatement",
        "nextStatement": "HtmlStatement",
        "colour": THEME_COLOURS.style,
        "tooltip": "Wrap CSS rules in a <style> block",
        "extensions": ["match_parent_colour"]
    },

]);
