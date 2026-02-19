const myToolbox = {
    "kind": "flyoutToolbox",
    "contents": [
        { "kind": "block", "type": "doctype" },
        { "kind": "block", "type": "page_title" },
        { "kind": "block", "type": "p" },
        {
            "kind": "block",
            "type": "set_bg",
            "inputs": {
                "COLOR": {
                    "shadow": {
                        "type": "colour_hsv_sliders",
                        "fields": {
                            "COLOUR": "#ac5151"
                        }
                    }
                }
            }
        },
        { "kind": "block", "type": "html_wrapper" },
        { "kind": "block", "type": "head_wrapper" },
        { "kind": "block", "type": "header_wrapper" },
        { "kind": "block", "type": "body_wrapper" },

        { "kind": "block", "type": "heading" },
    ]
};