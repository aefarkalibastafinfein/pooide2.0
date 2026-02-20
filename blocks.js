Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "page_title",
        "message0": "Page Title: %1",
        "args0": [{
            "type": "field_input",
            "name": "TEXT",
            "text": "My Website"
        }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#474747",
        "tooltip": "Poopy poopy butt dookie"
    },
    {
        "type": "custom_style",
        "message0": "Custom Style: %1",
        "args0": [{
            "type": "field_input",
            "name": "COLOUR",
            "text": "background-color: red"
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
        "message0": "HTML %1 %2",
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
        "colour": "#474747"
    },
    {
        "type": "body_wrapper",
        "tooltip": "tuff",
        "helpUrl": "tuff.com",
        "message0": "Body %1 %2",
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
        "colour": "#5a5a5a",
    },
    {
        "type": "head_wrapper",
        "tooltip": "tuff",
        "helpUrl": "tuff.com",
        "message0": "Head %1 %2",
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
        "colour": "#5a5a5a",
        "tooltip": "AAAaaaaAAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaA"
    },
    {
        "type": "header_wrapper",
        "tooltip": "tuff",
        "helpUrl": "tuff.com",
        "message0": "Header %1 %2",
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
        "colour": "#646464",
        "tooltip": "AAAaaaaAAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaA"
    },

    {
        "type": "p",
        "message0": "Paragraph: %1",
        "args0": [{
            "type": "field_input",
            "name": "CONTENT",
            "text": "Testing testing"
        }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#00a2be",
        "tooltip": "AAAaaaaAAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaA"
    },
    {
        "type": "set_bg",
        "message0": "set bg color to %1",
        "args0": [
            {
                "type": "input_value",
                "name": "COLOR",
                "check": "Colour",
                "shadow": {
                    "type": "colour_hsv_sliders",
                    "fields": {
                        "COLOUR": "#ac5151"
                    }
                }
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#ff9898"
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
                "type": "field_input",
                "name": "TEXT",
                "text": "Heading text"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#00A2BE",
        "tooltip": "Heading with selectable level (H1–H6)",
        "helpUrl": "https://tungtungtungsahur.tuff"
    },
    {
        "type": "doctype",
        "message0": "<!DOCTYPE html>",
        "nextStatement": null,
        "colour": "#474747",
        "tooltip": "HTML doctype — cannot have blocks above it"
    },
    {
        "type": "meta",
        "message0": "meta & setup",
        "nextStatement": null,
        "previousStatement": null,
        "colour": "#6e6e6e",
        "tooltip": "HTML meta tags — viewport and charset"
    },
    {
        "type": "footer_wrapper",
        "tooltip": "tuff",
        "helpUrl": "tuff.com",
        "message0": "Footer %1 %2",
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
        "colour": "#646464",
        "tooltip": "AAAaaaaAAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaA"
    },
    {
        "type": "script_wrapper",
        "tooltip": "tuff",
        "helpUrl": "tuff.com",
        "message0": "Script %1 %2",
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
        "tooltip": "AAAaaaaAAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaAAaaAaA"
    },

    {
        "type": "set_style_attribute",
        "message0": "set style attribute %1 of %2 to %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ATTRIBUTE",
                "options": [
                    ["background-color", "background-color"],
                    ["color", "color"],
                    ["font-family", "font-family"],
                    ["font-size", "font-size"],
                    ["margin", "margin"],
                    ["padding", "padding"],
                    ["display", "display"],
                    ["width", "width"],
                    ["height", "height"],
                    ["border", "border"]
                ]
            },
            {
                "type": "field_input",
                "name": "ELEMENT",
                "text": "html"
            },
            {
                "type": "field_input",
                "name": "VALUE",
                "text": "black"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#a36cff",
        "tooltip": "You HAVE to put this in a script wrapper or it wont work 🤤"
    },

    {
        "type": "set_style_bg_black",
        "message0": "set style attribute %1 of %2 to %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ATTRIBUTE",
                "options": [["background-color", "background-color"]]
            },
            {
                "type": "field_input",
                "name": "ELEMENT",
                "text": "html"
            },
            {
                "type": "field_input",
                "name": "VALUE",
                "text": "black"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#a36cff",
        "tooltip": "Set background-color to black on the specified element"
    },

    {
        "type": "set_style_color_white",
        "message0": "set style attribute %1 of %2 to %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ATTRIBUTE",
                "options": [["color", "color"]]
            },
            {
                "type": "field_input",
                "name": "ELEMENT",
                "text": "html"
            },
            {
                "type": "field_input",
                "name": "VALUE",
                "text": "white"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#a36cff",
        "tooltip": "Set color to white on the specified element"
    },

    {
        "type": "set_style_font_comic",
        "message0": "set style attribute %1 of %2 to %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ATTRIBUTE",
                "options": [["font-family", "font-family"]]
            },
            {
                "type": "field_input",
                "name": "ELEMENT",
                "text": "html"
            },
            {
                "type": "field_input",
                "name": "VALUE",
                "text": "Comic Sans MS"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#a36cff",
        "tooltip": "Set font-family on the specified element"
    },

    {
        "type": "href_link",
        "message0": "External file %1 URL: %2",
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
                "type": "field_input",
                "name": "URL",
                "text": "http://afkdev.me/index.css"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#ffa500",
        "tooltip": "Include an external CSS or JS file via href/src"
    },

    {
        "type": "style_wrapper",
        "tooltip": "tuff",
        "helpUrl": "",
        "message0": "Style %1 %2",
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
        "tooltip": "Wrap CSS rules in a <style> block"
    },

]);