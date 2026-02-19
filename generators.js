// Standard Blockly JavaScript generators for the custom blocks
Blockly.JavaScript['page_title'] = function (block) {
    var text = block.getFieldValue('TEXT') || '';
    // return as an HTML title tag (string)
    return ' <title>' + text + '</title>\n';
};

Blockly.JavaScript['doctype'] = function (block) {
    return ' <!DOCTYPE html>\n';
};

Blockly.JavaScript['p'] = function (block) {
    var content = block.getFieldValue('CONTENT') || '';
    return '<p>' + content + '</p>\n';
};

Blockly.JavaScript['set_bg'] = function (block) {
    // Prefer any provided value (e.g. colour picker shadow) otherwise a default string
    var colorCode = Blockly.JavaScript.valueToCode(block, 'COLOR', Blockly.JavaScript.ORDER_ATOMIC) || "'#ffffff'";
    return 'document.body.style.backgroundColor = ' + colorCode + ';\n';
};

Blockly.JavaScript['heading'] = function (block) {
    var level = block.getFieldValue('LEVEL') || 'h1';
    var text = block.getFieldValue('TEXT') || '';
    return '<' + level + '>' + text + '</' + level + '>\n';
};