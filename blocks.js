function setDefaultShadow(block, inputName, shadowXml) {
    var input = block.getInput(inputName);
    if (!input) return;
    input.setShadowDom(Blockly.utils.xml.textToDom(shadowXml));
}

function normaliseHexColour(colour) {
    if (!colour || typeof colour !== 'string') return '#f08b06';
    if (/^#[0-9a-fA-F]{6}$/.test(colour)) return colour.toLowerCase();
    if (/^#[0-9a-fA-F]{3}$/.test(colour)) {
        return '#' + colour.slice(1).split('').map(function (part) {
            return part + part;
        }).join('').toLowerCase();
    }
    return '#f08b06';
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

function getMatchedColourState(block) {
    if (!block) return null;
    if (block.__matchParentColourState) {
        return block.__matchParentColourState;
    }
    return {
        base: normaliseHexColour(block.getColour()),
        shade: 0
    };
}

function syncMatchedBlockColour(block) {
    var defaultBase = block.__defaultMatchParentColour || normaliseHexColour(block.getColour());
    var parent = block.getParent();
    var state;

    if (!parent) {
        state = { base: defaultBase, shade: 0 };
    } else {
        var parentState = getMatchedColourState(parent);
        state = {
            base: parentState.base,
            shade: parentState.shade === 0 ? 1 : 0
        };
    }

    block.__matchParentColourState = state;
    var targetColour = state.shade === 0 ? state.base : lightenHexColour(state.base, 0.18);
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

Blockly.Extensions.register('match_parent_colour', function () {
    var block = this;
    block.__defaultMatchParentColour = normaliseHexColour(block.getColour());
    syncMatchedBlockColour(block);
    block.setOnChange(function () {
        syncMatchedBlockColour(block);
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
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#474747",
        "tooltip": "Poopy poopy butt dookie",
        "extensions": ["page_title_default_string_shadow"]
    },
    {
        "type": "custom_style",
        "message0": "custom raw style: %1",
        "args0": [{
            "type": "field_multilinetext",
            "name": "COLOUR",
            "text": "body {\n  background-color: red;\n}",
            "maxLines": 6,
            "spellcheck": false
        }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#00c3ff",
        "tooltip": "Poopy poopy butt dookie"
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
                "name": "HTML"
            }
        ],
        "previousStatement": null,
        "colour": "#474747",
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
                "name": "HTML"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#474747",
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
                "name": "HTML"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#474747",
        "tooltip": "AAAaaaaAAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaA",
        "extensions": ["match_parent_colour"]
    },
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
                "name": "HTML"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#474747",
        "tooltip": "AAAaaaaAAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaA",
        "extensions": ["match_parent_colour"]
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
                "name": "HTML"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#00a2be",
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
                "name": "ACTIONS"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#F08B06",
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
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#00a2be",
        "tooltip": "AAAaaaaAAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaA",
        "extensions": ["paragraph_default_string_shadow"]
    },

    {
        type: 'colour_hsv_sliders',
        message0: 'hsv %1',
        args0: [
            {
                type: 'field_colour_hsv_sliders',
                name: 'COLOUR',
                colour: '#ff9100',
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
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#00A2BE",
        "tooltip": "Heading with selectable level (H1–H6)",
        "helpUrl": "https://tungtungtungsahur.tuff",
        "extensions": ["heading_default_string_shadow"]
    },
    {
        "type": "doctype",
        "message0": "<!DOCTYPE html>",
        "nextStatement": null,
        "colour": "#474747",
        "tooltip": "HTML doctype — cannot have blocks above it"
    },
    {
        "type": "br",
        "message0": "line break",
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#00a2be",
        "tooltip": "HTML line break"
    },
    {
        "type": "hr",
        "message0": "horizontal rule",
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#00a2be",
        "tooltip": "HTML horizontal rule"
    },
    {
        "type": "meta",
        "message0": "meta & setup",
        "nextStatement": null,
        "previousStatement": null,
        "colour": "#474747",
        "extensions": ["match_parent_colour"],
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
                "name": "HTML"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#474747",
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
                "name": "HTML"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#f08b06",
        "tooltip": "AAAaaaaAAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaA",
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
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#f08b06",
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
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#f08b06",
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
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#f08b06",
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
        "colour": "#f08b06",
        "tooltip": "A string JavaScript value",
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
        "colour": "#f08b06",
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
        "colour": "#f08b06",
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
        "colour": "#f08b06",
        "tooltip": "A boolean JavaScript value",
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
        "colour": "#f08b06",
        "tooltip": "Raw JavaScript expression",
        "extensions": ["raw_expression_default_string_shadow", "match_parent_colour"]
    },


    {
        "type": "set_style_attribute",
        "message0": "set style attribute %1 of %2 to %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ATTRIBUTE",
                "options": [
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
                ]
            },
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
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#a36cff",
        "tooltip": "You HAVE to put this in a style wrapper or it wont work 🤤"
        , "extensions": ["set_style_attribute_default_string_shadows"]
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
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#ffa500",
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
                "name": "HTML"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#00c3ff",
        "tooltip": "Wrap CSS rules in a <style> block",
        "extensions": ["match_parent_colour"]
    },

]);
