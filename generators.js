javascript.javascriptGenerator.forBlock['page_title'] = function (block) {
    const text = block.getFieldValue('TEXT');
    return ` <title>${text}</title>\n`;
};
javascript.javascriptGenerator.forBlock['doctype'] = function (block) {
    return ` <!DOCTYPE html>\n`;
};
javascript.javascriptGenerator.forBlock['p'] = function (block) {
    const content = block.getFieldValue('CONTENT');
    return `<p>${content}</p>\n`;
};
javascript.javascriptGenerator.forBlock['set_bg'] = function (block) {
    const color = block.getFieldValue('COLOR');
    return `'${color}';\n`;
};

javascript.javascriptGenerator.forBlock['custom_style'] = function (block) {
    const text = block.getFieldValue('TEXT');
    return ` <style>${text}</style>\n`;
};
javascript.javascriptGenerator.forBlock['heading'] = function (block) {
    const level = block.getFieldValue('LEVEL') || 'h1';
    const text = block.getFieldValue('TEXT') || '';
    return `<${level}>${text}</${level}>\n`;
};

javascript.javascriptGenerator.forBlock['html_wrapper'] = function (block) {
    const statement_html = generator.statementToCode(block, 'HTML');
    const code = `<html>${statement_html}</html>\n`;
    return code;
};

javascript.javascriptGenerator.forBlock['body_wrapper'] = function (block) {
    const statement_html = generator.statementToCode(block, 'HTML');
    const code = `<body>${statement_html}</body>\n<!-- made with poo ide 2.0 (http://afkdev.me/pooide.html) -->\n`;
    return code;
};

javascript.javascriptGenerator.forBlock['head_wrapper'] = function (block) {
    const statement_html = generator.statementToCode(block, 'HTML');
    const code = `<head>${statement_html}</head>\n`;
    return code;
};

javascript.javascriptGenerator.forBlock['header_wrapper'] = function (block) {
    const statement_html = generator.statementToCode(block, 'HTML');
    const code = `<header>${statement_html}</header>\n`;
    return code;
};
javascript.javascriptGenerator.forBlock['meta'] = function (block) {
    return ` <meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta charset="UTF-8">\n`;
};
javascript.javascriptGenerator.forBlock['footer_wrapper'] = function (block) {
    const statement_html = generator.statementToCode(block, 'HTML');
    const code = `<footer>${statement_html}</footer>\n`;
    return code;
};
javascript.javascriptGenerator.forBlock['script_wrapper'] = function (block) {
    const statement_html = generator.statementToCode(block, 'HTML');
    const code = `<script>${statement_html}</script>\n`;
    return code;
};

javascript.javascriptGenerator.forBlock['href_link'] = function (block) {
    const type = block.getFieldValue('TYPE');
    const url = block.getFieldValue('URL') || '';
    if (type === 'stylesheet') {
        return `<link rel="stylesheet" href="${url}">\n`;
    }
    return `<script src="${url}"></script>\n`;
};

javascript.javascriptGenerator.forBlock['set_style_attribute'] = function (block) {
    const attribute = block.getFieldValue('ATTRIBUTE') || '';
    const element = block.getFieldValue('ELEMENT') || 'html';
    const value = block.getFieldValue('VALUE') || '';
    const escAttr = attribute.replace(/'/g, "\\'");
    const escValue = value.replace(/'/g, "\\'");
    const escElement = element.replace(/'/g, "\\'");

    let selectorCode = 'document.documentElement';
    if (escElement === 'body') selectorCode = 'document.body';
    else if (escElement && escElement !== 'html') selectorCode = `document.querySelector('${escElement}')`;

    return `${selectorCode}.style.setProperty('${escAttr}', '${escValue}');\n`;
};

javascript.javascriptGenerator.forBlock['set_style_bg_black'] = function (block) {
    const attribute = block.getFieldValue('ATTRIBUTE') || 'background-color';
    const element = block.getFieldValue('ELEMENT') || 'html';
    const value = block.getFieldValue('VALUE') || 'black';
    const escAttr = attribute.replace(/'/g, "\\'");
    const escValue = value.replace(/'/g, "\\'");
    const escElement = element.replace(/'/g, "\\'");

    let selectorCode = 'document.documentElement';
    if (escElement === 'body') selectorCode = 'document.body';
    else if (escElement && escElement !== 'html') selectorCode = `document.querySelector('${escElement}')`;

    return `${selectorCode}.style.setProperty('${escAttr}', '${escValue}');\n`;
};

javascript.javascriptGenerator.forBlock['set_style_color_white'] = function (block) {
    const attribute = block.getFieldValue('ATTRIBUTE') || 'color';
    const element = block.getFieldValue('ELEMENT') || 'html';
    const value = block.getFieldValue('VALUE') || 'white';
    const escAttr = attribute.replace(/'/g, "\\'");
    const escValue = value.replace(/'/g, "\\'");
    const escElement = element.replace(/'/g, "\\'");

    let selectorCode = 'document.documentElement';
    if (escElement === 'body') selectorCode = 'document.body';
    else if (escElement && escElement !== 'html') selectorCode = `document.querySelector('${escElement}')`;

    return `${selectorCode}.style.setProperty('${escAttr}', '${escValue}');\n`;
};

javascript.javascriptGenerator.forBlock['set_style_font_comic'] = function (block) {
    const attribute = block.getFieldValue('ATTRIBUTE') || 'font-family';
    const element = block.getFieldValue('ELEMENT') || 'html';
    const value = block.getFieldValue('VALUE') || 'Comic Sans MS';
    const escAttr = attribute.replace(/'/g, "\\'");
    const escValue = value.replace(/'/g, "\\'");
    const escElement = element.replace(/'/g, "\\'");

    let selectorCode = 'document.documentElement';
    if (escElement === 'body') selectorCode = 'document.body';
    else if (escElement && escElement !== 'html') selectorCode = `document.querySelector('${escElement}')`;

    return `${selectorCode}.style.setProperty('${escAttr}', '${escValue}');\n`;
};

javascript.javascriptGenerator.forBlock['style_wrapper'] = function (block) {
    const statement_html = generator.statementToCode(block, 'HTML');
    const code = `<style>${statement_html}</style>\n`;
    return code;
};