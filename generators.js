// whyd i put this RIGHT at the top
function getStringInputCode(block, inputName, fallbackText) {
    return javascript.javascriptGenerator.valueToCode(
        block,
        inputName,
        javascript.Order.NONE
    ) || JSON.stringify(fallbackText || '');
}

function getStringInputText(block, inputName, fallbackText) {
    const code = getStringInputCode(block, inputName, fallbackText);
    try {
        return JSON.parse(code);
    } catch (_) {
        return code.replace(/^['"]|['"]$/g, '');
    }
}

function escapeHtmlText(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function escapeAttributeText(text) {
    return escapeHtmlText(text).replace(/"/g, '&quot;');
}

function buildOptionalAttribute(name, value) {
    return value ? ` ${name}="${escapeAttributeText(value)}"` : '';
}

javascript.javascriptGenerator.forBlock['divvytuff'] = function (block) {
    const divName = getStringInputText(block, 'DIV_NAME', 'myDiv');
    const divClass = getStringInputText(block, 'DIV_CLASS', 'myClass');
    const statement_html = javascript.javascriptGenerator.statementToCode(block, 'HTML');
    let attrs = '';
    if (divName) attrs += ` id="${divName}"`;
    if (divClass) attrs += ` class="${divClass}"`;
    return `<div${attrs}>${statement_html}</div>\n`;
};
javascript.javascriptGenerator.forBlock['button_wrapper'] = function (block) {
    const label = getStringInputText(block, 'LABEL', 'Click me')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    const actions = javascript.javascriptGenerator.statementToCode(block, 'ACTIONS').trim();
    const onclick = actions ? ` onclick="${actions.replace(/"/g, '&quot;')}"` : '';
    return `<button${onclick}>${label}</button>\n`;
};
javascript.javascriptGenerator.forBlock['colour_hsv_sliders'] = function (block) {
    const colour = block.getFieldValue('COLOUR') || '#ff9100';
    return ["'" + colour + "'", javascript.Order.ATOMIC];
};

javascript.javascriptGenerator.forBlock['page_title'] = function (block) {
    const text = getStringInputText(block, 'TEXT', 'My Website');
    return ` <title>${text}</title>\n`;
};
javascript.javascriptGenerator.forBlock['doctype'] = function (block) {
    return ` <!DOCTYPE html>\n`;
};
javascript.javascriptGenerator.forBlock['br'] = function (block) {
    return ` <br>\n`;
};
javascript.javascriptGenerator.forBlock['hr'] = function (block) {
    return ` <hr>\n`;
};
javascript.javascriptGenerator.forBlock['p'] = function (block) {
    const content = getStringInputText(block, 'CONTENT', 'Testing testing');
    return `<p>${content}</p>\n`;
};
javascript.javascriptGenerator.forBlock['link_block'] = function (block) {
    const text = escapeHtmlText(getStringInputText(block, 'TEXT', 'Visit site'));
    const url = escapeAttributeText(getStringInputText(block, 'URL', 'https://example.com'));
    return `<a href="${url}">${text}</a>\n`;
};
javascript.javascriptGenerator.forBlock['image_block'] = function (block) {
    const src = escapeAttributeText(getStringInputText(block, 'SRC', 'https://example.com/image.png'));
    const alt = escapeAttributeText(getStringInputText(block, 'ALT', 'Example image'));
    const width = getStringInputText(block, 'WIDTH', '').trim();
    const height = getStringInputText(block, 'HEIGHT', '').trim();
    return `<img src="${src}" alt="${alt}"${buildOptionalAttribute('width', width)}${buildOptionalAttribute('height', height)}>\n`;
};

javascript.javascriptGenerator.forBlock['custom_style'] = function (block) {
    const styleText = block.getFieldValue('COLOUR') || '';
    return ` <style>${styleText}</style>\n`;
};
javascript.javascriptGenerator.forBlock['heading'] = function (block) {
    const level = block.getFieldValue('LEVEL') || 'h1';
    const text = getStringInputText(block, 'TEXT', 'Heading text');
    return `<${level}>${text}</${level}>\n`;
};

javascript.javascriptGenerator.forBlock['html_wrapper'] = function (block) {
    const statement_html = javascript.javascriptGenerator.statementToCode(block, 'HTML');
    const code = `<html>${statement_html}</html>\n`;
    return code;
};

javascript.javascriptGenerator.forBlock['body_wrapper'] = function (block) {
    const statement_html = javascript.javascriptGenerator.statementToCode(block, 'HTML');
    const code = `<body>${statement_html}</body>\n<!-- made with poo ide 2.0 (http://afkdev.me/pooide.html) -->\n`;
    return code;
};

javascript.javascriptGenerator.forBlock['head_wrapper'] = function (block) {
    const statement_html = javascript.javascriptGenerator.statementToCode(block, 'HTML');
    const code = `<head>${statement_html}</head>\n`;
    return code;
};

javascript.javascriptGenerator.forBlock['header_wrapper'] = function (block) {
    const statement_html = javascript.javascriptGenerator.statementToCode(block, 'HTML');
    const code = `<header>${statement_html}</header>\n`;
    return code;
};
javascript.javascriptGenerator.forBlock['semantic_wrapper'] = function (block) {
    const tag = block.getFieldValue('TAG') || 'section';
    const statement_html = javascript.javascriptGenerator.statementToCode(block, 'HTML');
    return `<${tag}>${statement_html}</${tag}>\n`;
};
javascript.javascriptGenerator.forBlock['element_wrapper'] = function (block) {
    const tag = block.getFieldValue('TAG') || 'div';
    const statement_html = javascript.javascriptGenerator.statementToCode(block, 'HTML');
    let attrs = '';

    if (tag === 'div') {
        const elementId = getStringInputText(block, 'ELEMENT_ID', '').trim();
        const elementClass = getStringInputText(block, 'ELEMENT_CLASS', '').trim();

        if (elementId) {
            attrs += ` id="${escapeAttributeText(elementId)}"`;
        }
        if (elementClass) {
            attrs += ` class="${escapeAttributeText(elementClass)}"`;
        }
    }

    return `<${tag}${attrs}>${statement_html}</${tag}>\n`;
};
javascript.javascriptGenerator.forBlock['meta'] = function (block) {
    return ` <meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta charset="UTF-8">\n`;
};
javascript.javascriptGenerator.forBlock['footer_wrapper'] = function (block) {
    const statement_html = javascript.javascriptGenerator.statementToCode(block, 'HTML');
    const code = `<footer>${statement_html}</footer>\n`;
    return code;
};
javascript.javascriptGenerator.forBlock['script_wrapper'] = function (block) {
    const statement_html = javascript.javascriptGenerator.statementToCode(block, 'HTML');
    const code = `<script>${statement_html}</script>\n`;
    return code;
};
javascript.javascriptGenerator.forBlock['on_page_load'] = function (block) {
    const actions = javascript.javascriptGenerator.statementToCode(block, 'ACTIONS');
    return `window.addEventListener("load", function () {\n${actions}});\n`;
};
javascript.javascriptGenerator.forBlock['alert_block'] = function (block) {
    const value = javascript.javascriptGenerator.valueToCode(block, 'VALUE', javascript.Order.NONE) || '""';
    return `alert(${value});\n`;
};
javascript.javascriptGenerator.forBlock['log_block'] = function (block) {
    const value = javascript.javascriptGenerator.valueToCode(block, 'VALUE', javascript.Order.NONE) || '""';
    return `console.log(${value});\n`;
};
javascript.javascriptGenerator.forBlock['redirect_block'] = function (block) {
    const url = getStringInputCode(block, 'URL', 'https://example.com');
    return `window.location.href = ${url};\n`;
};
javascript.javascriptGenerator.forBlock['string_value'] = function (block) {
    const text = block.getFieldValue('TEXT') || '';
    return [JSON.stringify(text), javascript.Order.ATOMIC];
};
javascript.javascriptGenerator.forBlock['to_string'] = function (block) {
    const value = javascript.javascriptGenerator.valueToCode(block, 'VALUE', javascript.Order.NONE) || '""';
    const trimmed = value.trim();
    if (/^(["']).*\1$/.test(trimmed)) {
        return [trimmed, javascript.Order.ATOMIC];
    }
    return [JSON.stringify(trimmed), javascript.Order.ATOMIC];
};
javascript.javascriptGenerator.forBlock['number_value'] = function (block) {
    const value = Number(block.getFieldValue('VALUE'));
    return [String(value), javascript.Order.ATOMIC];
};
javascript.javascriptGenerator.forBlock['boolean_value'] = function (block) {
    const value = block.getFieldValue('VALUE') === 'false' ? 'false' : 'true';
    return [value, javascript.Order.ATOMIC];
};
javascript.javascriptGenerator.forBlock['raw_expression'] = function (block) {
    const code = getStringInputText(block, 'CODE', 'document.title') || 'undefined';
    return [code, javascript.Order.NONE];
};
javascript.javascriptGenerator.forBlock['css_rule'] = function (block) {
    const selector = getStringInputText(block, 'SELECTOR', '.card');
    const declarations = javascript.javascriptGenerator.statementToCode(block, 'DECLARATIONS');
    return [`${selector} {\n${declarations}}\n`, javascript.Order.ATOMIC];
};
javascript.javascriptGenerator.forBlock['add_css_rules'] = function (block) {
    const rule = javascript.javascriptGenerator.valueToCode(block, 'RULE', javascript.Order.NONE) || '';
    return rule ? `${rule}\n` : '';
};
javascript.javascriptGenerator.forBlock['css_property'] = function (block) {
    const attribute = block.getFieldValue('ATTRIBUTE') || '';
    const value = getStringInputText(block, 'VALUE', 'black');
    return `${attribute}: ${value};\n`;
};


javascript.javascriptGenerator.forBlock['href_link'] = function (block) {
    const type = block.getFieldValue('TYPE');
    // poop 67 🤤 this is a very wierd way to do this but it works and i dont care
    const url = getStringInputText(block, 'URL', 'http://afkdev.me/index.css');
    if (type === 'stylesheet') {
        return `<link rel="stylesheet" href="${url}">\n`;
    }
    return `<script src="${url}"></script>\n`;
};

javascript.javascriptGenerator.forBlock['set_style_attribute'] = function (block) {
    const attribute = block.getFieldValue('ATTRIBUTE') || '';
    const element = getStringInputText(block, 'ELEMENT', 'html');
    const value = getStringInputText(block, 'VALUE', 'black');
    const escAttr = attribute.replace(/'/g, "\\'");
    const escValue = value.replace(/'/g, "\\'");

    return `${element} { ${escAttr}: ${escValue}; }\n`;
};

javascript.javascriptGenerator.forBlock['style_wrapper'] = function (block) {
    const statement_html = javascript.javascriptGenerator.statementToCode(block, 'HTML');
    const code = `<style>${statement_html}</style>\n`;
    return code;
};
