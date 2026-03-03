/**
 * Zeus Renderer — stolen from PenguinBuilder/PenguinBuilder.github.io

 */
(function () {
    const svgPaths = Blockly.utils.svgPaths;


    class ZeusConstantProvider extends Blockly.zelos.ConstantProvider {
        constructor() {
            super();
            this.TAB = null;
            this.BTAB = null;
            this.OCTOGON = null;
            this.SQUIRCLE = null;
            this.LEAF = null;
        }

        init() {
            super.init();
            this.TAB = this.makeTAB_();
            this.BTAB = this.makeBTAB_();
            this.OCTOGON = this.makeOCTOGON_();
            this.SQUIRCLE = this.makeSQUIRCLE_();
            this.LEAF = this.makeLEAF_();


            this.SHAPES = {
                HEXAGONAL: 1,
                ROUND: 2,
                SQUARE: 3,
                PUZZLE: 4,
                NOTCH: 5,
                TAB: 6,
                BTAB: 7,
                OCTOGON: 8,
                SQUIRCLE: 9,
                LEAF: 10
            };


            var G = this.GRID_UNIT;
            this.SHAPE_IN_SHAPE_PADDING = {
                1: { 0: 5 * G, 1: 2 * G, 2: 5 * G, 3: 5 * G, 6: 2 * G, 7: 2 * G, 8: 2 * G, 9: 2 * G, 10: 2 * G },
                2: { 0: 3 * G, 1: 3 * G, 2: 1 * G, 3: 2 * G, 6: 2 * G, 7: 2 * G, 8: 2 * G, 9: 2 * G, 10: 2 * G },
                3: { 0: 2 * G, 1: 2 * G, 2: 2 * G, 3: 2 * G, 6: 2 * G, 7: 2 * G, 8: 2 * G, 9: 2 * G, 10: 2 * G },
                6: { 0: 2 * G, 1: 2 * G, 2: 2 * G, 3: 2 * G, 6: 2 * G, 7: 2 * G, 8: 2 * G, 9: 2 * G, 10: 2 * G },
                7: { 0: 2 * G, 1: 2 * G, 2: 2 * G, 3: 2 * G, 6: 2 * G, 7: 2 * G, 8: 2 * G, 9: 2 * G, 10: 2 * G },
                8: { 0: 2 * G, 1: 2 * G, 2: 2 * G, 3: 2 * G, 6: 2 * G, 7: 2 * G, 8: 2 * G, 9: 2 * G, 10: 2 * G },
                9: { 0: 2 * G, 1: 2 * G, 2: 2 * G, 3: 2 * G, 6: 2 * G, 7: 2 * G, 8: 2 * G, 9: 2 * G, 10: 2 * G },
                10: { 0: 2 * G, 1: 2 * G, 2: 2 * G, 3: 2 * G, 6: 2 * G, 7: 2 * G, 8: 2 * G, 9: 2 * G, 10: 2 * G },
            };
        }


        makeLEAF_() {
            var maxWidth = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;
            var maxHeight = maxWidth * 2;
            var cornerRadius = this.CORNER_RADIUS;

            function makeMainPath(blockHeight, up, right) {
                var remainingHeight = blockHeight > maxHeight ? blockHeight - maxHeight : 0;
                var height = blockHeight > maxHeight ? maxHeight : blockHeight;
                var radius = height / 2;
                var dy = up ? -1 : 1;
                var dx = right ? 1 : -1;
                return svgPaths.arc(
                    'a', '0 0,1', radius,
                    svgPaths.point(dy * radius, dy * radius)) +
                    svgPaths.lineOnAxis('v', dx * (remainingHeight + radius - cornerRadius)) +
                    svgPaths.arc(
                        'a', '0 0,1', cornerRadius,
                        svgPaths.point(-dy * cornerRadius, dy * cornerRadius)) +
                    svgPaths.lineOnAxis('h', -dx * (radius - cornerRadius));
            }

            return {
                type: 10,
                isDynamic: true,
                width: function (height) {
                    var halfHeight = height / 2;
                    return halfHeight > maxWidth ? maxWidth : halfHeight;
                },
                height: function (height) { return height; },
                connectionOffsetY: function (connectionHeight) { return connectionHeight / 2; },
                connectionOffsetX: function (connectionWidth) { return -connectionWidth; },
                pathDown: function (height) { return makeMainPath(height, false, false); },
                pathUp: function (height) { return makeMainPath(height, true, false); },
                pathRightDown: function (height) { return makeMainPath(height, false, true); },
                pathRightUp: function (height) { return makeMainPath(height, false, true); },
            };
        }


        makeTAB_() {
            var maxWidth = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;

            function makeMainPath(blockHeight, up, right) {
                var dx = right ? 1 : -1;
                var dy = up ? -1 : 1;
                var radius = blockHeight / 4;
                var straight = blockHeight - radius * 2;
                var padding = radius / 1.8;

                return (
                    svgPaths.lineOnAxis('h', dx * padding) +
                    svgPaths.arc('a', '0 0,' + (right ? 1 : 0), radius,
                        svgPaths.point(dx * radius, dy * radius)) +
                    svgPaths.lineOnAxis('v', dy * straight) +
                    svgPaths.arc('a', '0 0,' + (right ? 1 : 0), radius,
                        svgPaths.point(dx * -radius, dy * radius)) +
                    svgPaths.lineOnAxis('h', dx * -padding)
                );
            }

            return {
                type: 6,
                isDynamic: true,
                width: function (height) {
                    var halfHeight = height / 2;
                    return halfHeight > maxWidth ? maxWidth : halfHeight;
                },
                height: function (height) { return height; },
                connectionOffsetY: function (connectionHeight) { return connectionHeight / 2; },
                connectionOffsetX: function (connectionWidth) { return -connectionWidth; },
                pathDown: function (height) { return makeMainPath(height, false, false); },
                pathUp: function (height) { return makeMainPath(height, true, false); },
                pathRightDown: function (height) { return makeMainPath(height, false, true); },
                pathRightUp: function (height) { return makeMainPath(height, false, true); },
            };
        }


        makeBTAB_() {
            var maxWidth = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;

            function makeMainPath(blockHeight, up, right) {
                var dx = right ? 1 : -1;
                var dy = up ? -1 : 1;
                var radius = blockHeight / 5;
                var straight = blockHeight - 2 * radius;
                var lip = radius;
                var padding = radius / 2;

                return (
                    svgPaths.lineOnAxis('h', dx * padding) +
                    svgPaths.arc('a', '0 0,1', radius,
                        svgPaths.point(dx * radius, dy * radius)) +
                    svgPaths.lineOnAxis('h', dx * lip) +
                    svgPaths.lineOnAxis('v', dy * straight) +
                    svgPaths.lineOnAxis('h', dx * -lip) +
                    svgPaths.arc('a', '0 0,1', radius,
                        svgPaths.point(dx * -radius, dy * radius)) +
                    svgPaths.lineOnAxis('h', dx * -padding)
                );
            }

            return {
                type: 7,
                isDynamic: true,
                width: function (height) {
                    var halfHeight = height / 2;
                    return halfHeight > maxWidth ? maxWidth : halfHeight;
                },
                height: function (height) { return height; },
                connectionOffsetY: function (connectionHeight) { return connectionHeight / 2; },
                connectionOffsetX: function (connectionWidth) { return -connectionWidth; },
                pathDown: function (height) { return makeMainPath(height, false, false); },
                pathUp: function (height) { return makeMainPath(height, true, false); },
                pathRightDown: function (height) { return makeMainPath(height, false, true); },
                pathRightUp: function (height) { return makeMainPath(height, false, true); },
            };
        }


        makeOCTOGON_() {
            var maxWidth = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;

            function makeMainPath(blockHeight, up, right) {
                var dx = right ? 1 : -1;
                var dy = up ? -1 : 1;
                var depth = blockHeight / 3;
                var straight = blockHeight - depth * 2;
                var padding = depth / 1.8;

                return (
                    svgPaths.lineOnAxis('h', dx * padding) +
                    svgPaths.lineTo(dx * depth, dy * depth) +
                    svgPaths.lineOnAxis('v', dy * straight) +
                    svgPaths.lineTo(dx * -depth, dy * depth) +
                    svgPaths.lineOnAxis('h', dx * -padding)
                );
            }

            return {
                type: 8,
                isDynamic: true,
                width: function (height) {
                    var halfHeight = height / 2;
                    return halfHeight > maxWidth ? maxWidth : halfHeight;
                },
                height: function (height) { return height; },
                connectionOffsetY: function (connectionHeight) { return connectionHeight / 2; },
                connectionOffsetX: function (connectionWidth) { return -connectionWidth; },
                pathDown: function (height) { return makeMainPath(height, false, false); },
                pathUp: function (height) { return makeMainPath(height, true, false); },
                pathRightDown: function (height) { return makeMainPath(height, false, true); },
                pathRightUp: function (height) { return makeMainPath(height, false, true); },
            };
        }


        makeSQUIRCLE_() {
            var maxWidth = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;
            var radius = this.CORNER_RADIUS * Math.PI;

            function makeMainPath(height, up, right) {
                var innerHeight = height - radius * 2;
                var sweep = right === up ? '0' : '1';
                var padding = radius / 1.8;
                var dx = right ? 1 : -1;
                var dy = up ? -1 : 1;
                return (
                    svgPaths.lineOnAxis('h', dx * padding) +
                    svgPaths.arc('a', '0 0,' + sweep, radius,
                        svgPaths.point(dx * radius, dy * radius)) +
                    svgPaths.lineOnAxis('v', dy * innerHeight) +
                    svgPaths.arc('a', '0 0,' + sweep, radius,
                        svgPaths.point(-dx * radius, dy * radius)) +
                    svgPaths.lineOnAxis('h', dx * -padding)
                );
            }

            return {
                type: 9,
                isDynamic: true,
                width: function (height) {
                    var halfHeight = height / 2;
                    return halfHeight > maxWidth ? maxWidth : halfHeight;
                },
                height: function (height) { return height; },
                connectionOffsetY: function (connectionHeight) { return connectionHeight / 2; },
                connectionOffsetX: function (connectionWidth) { return -connectionWidth; },
                pathDown: function (height) { return makeMainPath(height, false, false); },
                pathUp: function (height) { return makeMainPath(height, true, false); },
                pathRightDown: function (height) { return makeMainPath(height, false, true); },
                pathRightUp: function (height) { return makeMainPath(height, false, true); },
            };
        }

        getShape(shape) {
            switch (shape) {
                case this.SHAPES.HEXAGONAL: return this.HEXAGONAL;
                case this.SHAPES.ROUND: return this.ROUNDED;
                case this.SHAPES.SQUARE: return this.SQUARED;
                case this.SHAPES.TAB: return this.TAB;
                case this.SHAPES.BTAB: return this.BTAB;
                case this.SHAPES.OCTOGON: return this.OCTOGON;
                case this.SHAPES.SQUIRCLE: return this.SQUIRCLE;
                case this.SHAPES.LEAF: return this.LEAF;
                default: return null;
            }
        }


        shapeFor(connection) {
            var checks = connection.getCheck();
            if (!checks && connection.targetConnection) {
                checks = connection.targetConnection.getCheck();
            }
            var outputShape;
            switch (connection.type) {
                case Blockly.ConnectionType.INPUT_VALUE:
                case Blockly.ConnectionType.OUTPUT_VALUE:
                    outputShape = connection.getSourceBlock().getOutputShape();
                    if (outputShape !== null) {
                        var shape = this.getShape(outputShape);
                        if (shape) return shape;
                    }
                    if (checks && checks.includes('Boolean')) return this.HEXAGONAL;
                    if (checks && checks.includes('Number')) return this.SQUIRCLE;
                    if (checks && checks.includes('String')) return this.SQUARED;
                    if (checks && checks.includes('Object')) return this.TAB;
                    if (checks && checks.includes('Array')) return this.BTAB;
                    if (checks && checks.includes('Colour')) return this.OCTOGON;
                    return this.ROUNDED;
                case Blockly.ConnectionType.PREVIOUS_STATEMENT:
                case Blockly.ConnectionType.NEXT_STATEMENT:
                    return this.NOTCH;
                default:
                    throw Error('Unknown connection type');
            }
        }
    }

    class ZeusRenderer extends Blockly.zelos.Renderer {
        constructor(name) {
            super(name);
        }
        makeConstants_() {
            return new ZeusConstantProvider();
        }
    }


    Blockly.blockRendering.register('zeus', ZeusRenderer);

})();
