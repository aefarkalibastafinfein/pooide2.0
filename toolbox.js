const myToolbox = {
    "kind": "categoryToolbox",
    "contents": [
        {
            "kind": "category",
            "name": "Document",
            "colour": THEME_COLOURS.document,
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
            "colour": THEME_COLOURS.layout,
            "contents": [
                // same thing with the header
                { "kind": "block", "type": "element_wrapper" },
                // old div was here, but keeping it in blocks and generators for compatabillity because I Said So HaHa
                // and the footer was here too

            ]
        },
        {
            "kind": "category",
            "name": "Content",
            "colour": THEME_COLOURS.content,
            "contents": [
                { "kind": "block", "type": "heading" },
                { "kind": "block", "type": "p" },
                { "kind": "block", "type": "span" },
                { "kind": "block", "type": "list_wrapper" },
                { "kind": "block", "type": "list_item" },
                { "kind": "block", "type": "link_block" },
                { "kind": "block", "type": "image_block" },
                { "kind": "block", "type": "br" },
                { "kind": "block", "type": "hr" }
            ]
        },
        {
            "kind": "category",
            "name": "Style",
            "colour": THEME_COLOURS.style,
            "contents": [
                { "kind": "block", "type": "style_wrapper" },
                { "kind": "block", "type": "add_css_rules" },
                { "kind": "block", "type": "css_rule" },
                { "kind": "block", "type": "css_property" },
                { "kind": "block", "type": "set_style_attribute" },
                // removed like 3 because they were lowkey useless
                { "kind": "block", "type": "custom_style" },
                { "kind": "block", "type": "colour_hsv_sliders" }
            ]
        },
        {
            "kind": "category",
            "name": "Script",
            "colour": THEME_COLOURS.script,
            "contents": [
                { "kind": "block", "type": "script_wrapper" },
                { "kind": "block", "type": "on_page_load" },
                { "kind": "block", "type": "button_wrapper" },
                { "kind": "block", "type": "alert_block" },
                { "kind": "block", "type": "log_block" },
                { "kind": "block", "type": "redirect_block" },
                { "kind": "block", "type": "string_value" },
                { "kind": "block", "type": "multiline_string_value" },
                { "kind": "block", "type": "to_string" },
                { "kind": "block", "type": "number_value" },
                { "kind": "block", "type": "boolean_value" },
                { "kind": "block", "type": "raw_expression" },
            ]
        },
        {
            "kind": "category",
            "name": "External",
            "colour": THEME_COLOURS.external,
            "contents": [
                { "kind": "block", "type": "href_link" }
            ]
        },
        {
            "kind": "sep"
        },

    ]
};
