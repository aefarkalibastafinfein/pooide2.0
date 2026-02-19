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
    const code = `<body>${statement_html}</body>\n`;
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