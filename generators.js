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