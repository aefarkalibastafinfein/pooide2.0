registerFieldMultilineInput();

function forceInlineInputs(ws) {
    if (!ws) return;
    ws.getAllBlocks(false).forEach(function (block) {
        block.setInputsInline(true);
    });
}
