const myToolbox = {
    "kind": "categoryToolbox",
    "contents": [
        {
            "kind": "search",
            "name": "Search",
            "contents": []
        },
        {
            "kind": "category",
            "name": "Document",
            "colour": "#474747",
            "contents": [
                { "kind": "block", "type": "doctype" },
                { "kind": "block", "type": "html_wrapper" },
                { "kind": "block", "type": "head_wrapper" },
                { "kind": "block", "type": "body_wrapper" },
                { "kind": "block", "type": "meta" },
                { "kind": "block", "type": "page_title" }
            ]
        },
        {
            "kind": "category",
            "name": "Layout",
            "colour": "#646464",
            "contents": [
                { "kind": "block", "type": "header_wrapper" },
                { "kind": "block", "type": "footer_wrapper" }
            ]
        },
        {
            "kind": "category",
            "name": "Content",
            "colour": "#00A2BE",
            "contents": [
                { "kind": "block", "type": "heading" },
                { "kind": "block", "type": "p" },
                { "kind": "block", "type": "br" },
                { "kind": "block", "type": "hr" }
            ]
        },
        {
            "kind": "category",
            "name": "Style",
            "colour": "#00c3ff",
            "contents": [
                { "kind": "block", "type": "style_wrapper" },
                { "kind": "block", "type": "set_style_attribute" },
                { "kind": "block", "type": "set_style_bg_black" },
                { "kind": "block", "type": "set_style_color_white" },
                { "kind": "block", "type": "set_style_font_comic" },
                { "kind": "block", "type": "custom_style" },
                { "kind": "block", "type": "set_bg" }
            ]
        },
        {
            "kind": "category",
            "name": "Script",
            "colour": "#f08b06",
            "contents": [
                { "kind": "block", "type": "script_wrapper" }
            ]
        },
        {
            "kind": "category",
            "name": "External",
            "colour": "#ffa500",
            "contents": [
                { "kind": "block", "type": "href_link" }
            ]
        },
        {
            "kind": "sep"
        },
        {
            "kind": "category",
            "name": "Colour",
            "colour": "#ff9898",
            "contents": [
                {
                    "kind": "block",
                    "type": "colour_hsv_sliders"
                }
            ]
        }
    ]
};