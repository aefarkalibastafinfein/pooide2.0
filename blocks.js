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
        "tooltip": "Heading",
        "helpUrl": ""
    },
    {
        "type": "doctype",
        "message0": "<!DOCTYPE html>",
        "nextStatement": null,
        "colour": "#474747",
        "tooltip": "OOOooooooGagagagagagagaa"
    }

]);