/**
 * Zeus Renderer — stolen from PenguinBuilder/PenguinBuilder.github.io
 * oh my is that an em dash? oh no how ai 😱
 */
(function () {
    const svgPaths = Blockly.utils.svgPaths;
    const STATEMENT_NOTCH_VARIANTS = {
        ScriptStatement: {
            shapeType: 11,
            width: 40,
            height: 10.5,
            // it must start with `l` and should end back on baseline (y=0), and total x-distance should match `width`and uhh if `pathRight` is omitted, you should like auto-mirror `pathLeft`
            // if thats confusing to you then just follow what i write below and you should be fine:

            // begin by copying the path and then going to https://yqnn.github.io/svg-path-editor/. i used this since its a goated editor. aight so paste it in where it says patha nd then add M 0 0  to the start and you'll see the shape
            // now you can jsut do what you want and then remove the M 0 0 and paste it in here
            // that's LITERALLY it :OOoo i know
            // have an em dash or two for your troubles
            // — — —

            pathLeft: 'l 5 0 l 4 10 l 2 0 l 4 -10 l 4 10 l 2 0 l 4 -10 l 4 10 l 2 0 l 4 -10 l 5 0'
        },
        CssStatement: {
            shapeType: 12,
            width: 30,
            height: 10.5,
            pathLeft: 'l 5 0 l 4 10 l 2 0 l 4 -10 l 4 10 l 2 0 l 4 -10 l 5 0'
        },
        CssDeclaration: {
            shapeType: 12,
            width: 30,
            height: 10.5,
            pathLeft: 'l 5 0 l 4 10 l 2 0 l 4 -10 l 4 10 l 2 0 l 4 -10 l 5 0'
        }
    };



    // Lowkey here how to make your own path
    //
    // these paths are RELATIVE (lowercase commands) btw
    // 1) copy the path
    // 2) paste into https://yqnn.github.io/svg-path-editor/ and add M 0 0  so you can like edit it
    // 3) edit it, then remove the leading M 0 0 and paste it back here
    //
    // some Poooooop rules:
    // pathDownRight should start at (0,0) and end at (0, baseHeight).
    // you can omit pathDownLeft, pathUpRight, pathUpLeft and they should be be auto-derived
    // only relative commands are supported, sorry: l, h, v, a
    // this is scaled at runtime based on the real block height/connection width
    // new customization:
    // - proportional: true/false (default true) locks aspect ratio so it doesn't stretch weirdly
    // - scale: number (default 1) makes it bigger/smaller
    // - maxWidthMode: 'ignore' | 'cap' (default ignore if proportional, else cap)
    // - maxWidth: number (optional) overrides MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH
    // you're sigma if you understand this
    const REPORTER_SHAPE_PATH_VARIANTS = {
        TAB: {
            shapeType: 6,
            baseWidth: 20,
            baseHeight: 40,
            pathDownRight: 'h 5.556 a 10 10 0 0 1 10 10 v 20 a 10 10 0 0 1 -10 10 h -5.556'
        },
        BTAB: {
            shapeType: 7,
            baseWidth: 20,
            baseHeight: 40,
            pathDownRight: 'h 4 a 8 8 0 0 1 8 8 h 8 v 24 h -8 a 8 8 0 0 1 -8 8 h -4'
        },
        OCTOGON: {
            shapeType: 8,
            baseWidth: 20,
            baseHeight: 40,

            pathDownRight: 'h 7.407 l 13.333 13.333 v 13.333 l -13.333 13.333 h -7.407'
        },
        SQUIRCLE: {
            shapeType: 9,
            baseWidth: 20,
            baseHeight: 40,

            pathDownRight: 'h 6.981 a 12.566 12.566 0 0 1 12.566 12.566 v 14.868 a 12.566 12.566 0 0 1 -12.566 12.566 h -6.981'
        },
        LEAF: {
            shapeType: 10,
            baseWidth: 20,
            baseHeight: 40,

            pathDownRight: 'h 2 a 18 18 0 0 1 18 18 v 12 a 10 10 0 0 1 -10 10 h -10'
        }
    };


    class ZeusConstantProvider extends Blockly.zelos.ConstantProvider {
        constructor() {
            super();
            this.STATEMENT_NOTCHES = {};
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
                LEAF: 10,
                SCRIPT_NOTCH: 11,
                CSS_NOTCH: 12,
                LIST_NOTCH: 13
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

            this.STATEMENT_NOTCHES = this.makeStatementNotches_();

            // zelos uses a negative STATEMENT_BOTTOM_SPACER to overlap the bottom
            // of a statement input with the child's next-connection notch area
            // suuuuuper interesting ik
            // if we make custom notches taller than NOTCH_HEIGHT, nested C-blocks
            // start showing a big white GAP
            // and we HATE gaps
            // so we need to make sure STATEMENT_BOTTOM_SPACER is at least as tall as the tallest notch
            // that lowkey fixes it
            var maxNotchHeight = (this.NOTCH && typeof this.NOTCH.height === 'number')
                ? this.NOTCH.height
                : this.NOTCH_HEIGHT;
            for (var key in this.STATEMENT_NOTCHES) {
                if (!Object.prototype.hasOwnProperty.call(this.STATEMENT_NOTCHES, key)) continue;
                var notch = this.STATEMENT_NOTCHES[key];
                if (notch && typeof notch.height === 'number') {
                    maxNotchHeight = Math.max(maxNotchHeight, notch.height);
                }
            }
            this.STATEMENT_BOTTOM_SPACER = Math.min(this.STATEMENT_BOTTOM_SPACER, -maxNotchHeight);
        }


        makeMatchingNotch_(config) {
            if (config && config.pathLeft) {
                return this.makeNotchFromPathSpec_(config);
            }

            var baseWidth = this.NOTCH && this.NOTCH.width ? this.NOTCH.width : 15;
            var baseHeight = this.NOTCH && this.NOTCH.height ? this.NOTCH.height : 4;
            var width = Math.max(12, Math.round(baseWidth * (config.widthScale || 1)));
            var height = Math.max(3, Math.round(baseHeight * (config.heightScale || 1)));
            var shoulder = Math.max(2, Math.round(width * (config.shoulderRatio || 0.22)));
            var spikeCount = Math.max(1, config.spikeCount || 1);

            function makeMainPath(direction) {
                var points = [svgPaths.point(direction * shoulder, 0)];
                var usableWidth = Math.max(2, width - shoulder * 2);

                if (spikeCount === 1) {
                    var slope = Math.max(2, Math.round(width * (config.slopeRatio || 0.16)));
                    var valley = Math.max(2, usableWidth - slope * 2);
                    points.push(svgPaths.point(direction * slope, height));
                    points.push(svgPaths.point(direction * valley, 0));
                    points.push(svgPaths.point(direction * slope, -height));
                    points.push(svgPaths.point(direction * shoulder, 0));
                    return svgPaths.line(points);
                }

                var step = Math.max(2, usableWidth / (spikeCount * 2));
                for (var i = 0; i < spikeCount; i++) {
                    points.push(svgPaths.point(direction * step, height));
                    points.push(svgPaths.point(direction * step, -height));
                }
                points.push(svgPaths.point(direction * shoulder, 0));
                return svgPaths.line(points);
            }

            return {
                type: config.shapeType,
                width: width,
                height: height,
                pathLeft: makeMainPath(1),
                pathRight: makeMainPath(-1)
            };
        }

        makeNotchFromPathSpec_(spec) {
            var width = Math.max(6, Number(spec.width) || 0);
            var height = Math.max(1, Number(spec.height) || 0);
            var pathLeft = String(spec.pathLeft || '').trim();
            var pathRight = spec.pathRight ? String(spec.pathRight).trim() : '';

            if (!pathLeft) {
                throw Error('Missing pathLeft for statement notch');
            }

            if (!pathRight) {
                pathRight = this.mirrorLinePath_(pathLeft);
            }

            if (!pathRight) {
                throw Error('Missing pathRight for statement notch and could not auto-mirror pathLeft');
            }

            return {
                type: spec.shapeType,
                width: width,
                height: height,
                pathLeft: pathLeft,
                pathRight: pathRight
            };
        }

        mirrorLinePath_(path) {
            var trimmed = String(path || '').trim();
            // it support relative lineto paths like:.`
            // i deliberately kept this strict (line segments only) so mirroring isnt too crazy
            if (!/^[0-9eE+\-.,\sLl]+$/.test(trimmed) || !/[lL]/.test(trimmed)) return '';

            var numberTokens = trimmed.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/ig) || [];
            if (numberTokens.length < 2 || numberTokens.length % 2 !== 0) return '';

            var numbers = numberTokens.map(function (t) { return Number(t); });
            for (var i = 0; i < numbers.length; i += 2) {
                numbers[i] = -numbers[i];
            }

            function fmt(n) {
                if (!isFinite(n)) return '0';
                if (Math.abs(n) < 0.0005) return '0';
                var rounded = Math.round(n * 1000) / 1000;
                var s = String(rounded);
                return s;
            }

            return 'l ' + numbers.map(fmt).join(' ');
        }

        // completely useless comment here

        parseRelativeSvgPath_(path) {
            var trimmed = String(path || '').trim();
            if (!trimmed) return [];
            var tokens = trimmed.match(/[a-zA-Z]|[-+]?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
            var segments = [];
            var cmd = '';
            var args = [];

            function flush() {
                if (!cmd) return;
                if (cmd !== cmd.toLowerCase()) {
                    throw Error('Reporter svg paths must use relative (lowercase) commands only');
                }
                if (cmd === 'z') {
                    segments.push({ cmd: cmd, args: [] });
                    cmd = '';
                    args = [];
                    return;
                }

                var per = { l: 2, h: 1, v: 1, a: 7 }[cmd];
                if (!per) {
                    throw Error('Unsupported reporter svg path command: ' + cmd);
                }
                if (!args.length || (args.length % per) !== 0) {
                    throw Error('Invalid reporter svg path args for ' + cmd);
                }
                for (var i = 0; i < args.length; i += per) {
                    segments.push({
                        cmd: cmd,
                        args: args.slice(i, i + per).map(function (x) { return Number(x); })
                    });
                }
                cmd = '';
                args = [];
            }

            for (var i = 0; i < tokens.length; i++) {
                var t = tokens[i];
                if (/^[a-zA-Z]$/.test(t)) {
                    flush();
                    cmd = t.toLowerCase();
                    args = [];
                } else {
                    args.push(t);
                }
            }
            flush();
            return segments;
        }

        fmtSvgNum_(n) {
            if (!isFinite(n)) return '0';
            if (Math.abs(n) < 0.0005) return '0';
            var rounded = Math.round(n * 1000) / 1000;
            return String(rounded);
        }

        serializeRelativeSvgPath_(segments) {
            return (segments || []).map(function (seg) {
                if (!seg || !seg.cmd) return '';
                if (!seg.args || !seg.args.length) return seg.cmd;
                return seg.cmd + ' ' + seg.args.map(this.fmtSvgNum_, this).join(' ');
            }, this).filter(Boolean).join(' ');
        }

        scaleRelativeSvgPath_(path, scaleX, scaleY) {
            var segs = this.parseRelativeSvgPath_(path);
            for (var i = 0; i < segs.length; i++) {
                var seg = segs[i];
                switch (seg.cmd) {
                    case 'h':
                        seg.args[0] *= scaleX;
                        break;
                    case 'v':
                        seg.args[0] *= scaleY;
                        break;
                    case 'l':
                        seg.args[0] *= scaleX;
                        seg.args[1] *= scaleY;
                        break;
                    case 'a':
                        // a rx ry xrot laf sf dx dy
                        seg.args[0] *= scaleX;
                        seg.args[1] *= scaleY;
                        // seg.args[2] xrot unchanged
                        // seg.args[3] laf unchanged
                        // seg.args[4] sf unchanged
                        seg.args[5] *= scaleX;
                        seg.args[6] *= scaleY;
                        break;
                    default:
                        throw Error('Unsupported reporter svg path command: ' + seg.cmd);
                }
            }
            return this.serializeRelativeSvgPath_(segs);
        }

        mirrorRelativeSvgPathX_(path) {

            var segs = this.parseRelativeSvgPath_(path);
            for (var i = 0; i < segs.length; i++) {
                var seg = segs[i];
                switch (seg.cmd) {
                    case 'h':
                        seg.args[0] = -seg.args[0];
                        break;
                    case 'v':
                        break;
                    case 'l':
                        seg.args[0] = -seg.args[0];
                        break;
                    case 'a':
                        // a rx ry xrot laf sf dx dy
                        seg.args[2] = -seg.args[2];
                        seg.args[4] = seg.args[4] ? 0 : 1;
                        seg.args[5] = -seg.args[5];
                        break;
                    default:
                        throw Error('Unsupported reporter svg path command: ' + seg.cmd);
                }
            }
            return this.serializeRelativeSvgPath_(segs);
        }

        reverseRelativeSvgPath_(path) {
            var segs = this.parseRelativeSvgPath_(path);
            var out = [];
            for (var i = segs.length - 1; i >= 0; i--) {
                var seg = segs[i];
                var cmd = seg.cmd;
                var args = seg.args.slice();
                switch (cmd) {
                    case 'h':
                        args[0] = -args[0];
                        break;
                    case 'v':
                        args[0] = -args[0];
                        break;
                    case 'l':
                        args[0] = -args[0];
                        args[1] = -args[1];
                        break;
                    case 'a':
                        // a rx ry xrot laf sf dx dy
                        args[4] = args[4] ? 0 : 1;
                        args[5] = -args[5];
                        args[6] = -args[6];
                        break;
                    default:
                        throw Error('Unsupported reporter svg path command: ' + cmd);
                }
                out.push({ cmd: cmd, args: args });
            }
            return this.serializeRelativeSvgPath_(out);
        }

        makeReporterShapeFromPathSpec_(spec) {
            var defaultMaxWidth = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;
            var shapeType = Number(spec.shapeType);
            var baseWidth = Math.max(1, Number(spec.baseWidth) || 0);
            var baseHeight = Math.max(1, Number(spec.baseHeight) || 0);
            var proportional = (spec.proportional !== undefined) ? !!spec.proportional : true;
            var scaleMul = (spec.scale !== undefined) ? Number(spec.scale) : 1;
            if (!isFinite(scaleMul) || scaleMul <= 0) scaleMul = 1;
            var maxWidthMode = String(spec.maxWidthMode || '').toLowerCase();
            if (maxWidthMode !== 'ignore' && maxWidthMode !== 'cap') {
                // Default: keep proportions by ignoring maxWidth when aspect-locked.
                maxWidthMode = proportional ? 'ignore' : 'cap';
            }
            var maxWidthOverride = (spec.maxWidth !== undefined) ? Number(spec.maxWidth) : NaN;
            var maxWidth = (isFinite(maxWidthOverride) && maxWidthOverride > 0) ? maxWidthOverride : defaultMaxWidth;
            var pathDownRight = String(spec.pathDownRight || '').trim();
            var pathDownLeft = spec.pathDownLeft ? String(spec.pathDownLeft).trim() : '';
            var pathUpRight = spec.pathUpRight ? String(spec.pathUpRight).trim() : '';
            var pathUpLeft = spec.pathUpLeft ? String(spec.pathUpLeft).trim() : '';

            if (!pathDownRight) {
                throw Error('Missing pathDownRight for reporter shape ' + shapeType);
            }

            if (!pathDownLeft) {
                pathDownLeft = this.mirrorRelativeSvgPathX_(pathDownRight);
            }
            if (!pathUpRight) {
                pathUpRight = this.reverseRelativeSvgPath_(pathDownRight);
            }
            if (!pathUpLeft) {
                pathUpLeft = this.mirrorRelativeSvgPathX_(pathUpRight);
            }

            if (!pathDownLeft || !pathUpRight || !pathUpLeft) {
                throw Error('Reporter path auto-derivation failed for shape ' + shapeType);
            }

            var that = this;

            function clampWidth(w) {
                return (w > maxWidth) ? maxWidth : w;
            }

            function baseWidthFromHeight(height) {

                var halfHeight = height / 2;
                return (halfHeight > maxWidth) ? maxWidth : halfHeight;
            }

            function computeWidth(height) {
                if (proportional) {

                    var s = (height / baseHeight) * scaleMul;
                    var w = baseWidth * s;
                    return (maxWidthMode === 'cap') ? clampWidth(w) : w;
                }

                var w2 = baseWidthFromHeight(height) * scaleMul;
                return (maxWidthMode === 'cap') ? clampWidth(w2) : w2;
            }

            function computeScales(height) {
                if (proportional) {
                    var s = (height / baseHeight) * scaleMul;
                    if (maxWidthMode === 'cap') {
                        var w = baseWidth * s;
                        if (w > maxWidth) {

                            s = (maxWidth / baseWidth);
                        }
                    }
                    return { sx: s, sy: s };
                }

                var w2 = computeWidth(height);
                return { sx: (w2 / baseWidth), sy: (height / baseHeight) * scaleMul };
            }

            return {
                type: shapeType,
                isDynamic: true,
                width: function (height) { return computeWidth(height); },
                height: function (height) { return height; },
                connectionOffsetY: function (connectionHeight) { return connectionHeight / 2; },
                connectionOffsetX: function (connectionWidth) { return -connectionWidth; },
                pathDown: function (height) {
                    var s = computeScales(height);
                    return that.scaleRelativeSvgPath_(pathDownLeft, s.sx, s.sy);
                },
                pathUp: function (height) {
                    var s = computeScales(height);
                    return that.scaleRelativeSvgPath_(pathUpLeft, s.sx, s.sy);
                },
                pathRightDown: function (height) {
                    var s = computeScales(height);
                    return that.scaleRelativeSvgPath_(pathDownRight, s.sx, s.sy);
                },
                pathRightUp: function (height) {
                    var s = computeScales(height);
                    return that.scaleRelativeSvgPath_(pathUpRight, s.sx, s.sy);
                },
            };
        }


        makeStatementNotches_() {
            var notches = {};
            Object.keys(STATEMENT_NOTCH_VARIANTS).forEach(function (key) {
                notches[key] = this.makeMatchingNotch_(STATEMENT_NOTCH_VARIANTS[key]);
            }, this);
            return notches;
        }


        getStatementNotch_(checks) {
            var list = Array.isArray(checks) ? checks : (checks ? [checks] : []);
            for (var i = 0; i < list.length; i++) {
                var check = list[i];
                if (this.STATEMENT_NOTCHES[check]) {
                    return this.STATEMENT_NOTCHES[check];
                }
            }
            return null;
        }


        makeLEAF_() {
            var leafSpec = REPORTER_SHAPE_PATH_VARIANTS.LEAF;
            if (leafSpec && leafSpec.pathDownRight) {
                return this.makeReporterShapeFromPathSpec_(leafSpec);
            }

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
            var tabSpec = REPORTER_SHAPE_PATH_VARIANTS.TAB;
            if (tabSpec && tabSpec.pathDownRight) {
                return this.makeReporterShapeFromPathSpec_(tabSpec);
            }

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
            var btabSpec = REPORTER_SHAPE_PATH_VARIANTS.BTAB;
            if (btabSpec && btabSpec.pathDownRight) {
                return this.makeReporterShapeFromPathSpec_(btabSpec);
            }

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
            var octoSpec = REPORTER_SHAPE_PATH_VARIANTS.OCTOGON;
            if (octoSpec && octoSpec.pathDownRight) {
                return this.makeReporterShapeFromPathSpec_(octoSpec);
            }

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
            var squircleSpec = REPORTER_SHAPE_PATH_VARIANTS.SQUIRCLE;
            if (squircleSpec && squircleSpec.pathDownRight) {
                return this.makeReporterShapeFromPathSpec_(squircleSpec);
            }

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
                    var statementNotch = this.getStatementNotch_(checks);
                    if (statementNotch) return statementNotch;
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

    // blockly uses constants.NOTCH_HEIGHT for stack overlap calculaions
    // when statement notches are taller than NOTCH_HEIGHT, stack heights drift and the
    // bottom under nested branch bloks grows with each extra block
    // this uses like the actual shape height instead
    // which fixes it
    (function () {
        if (!Blockly || !Blockly.BlockSvg || !Blockly.BlockSvg.prototype) return;
        if (Blockly.BlockSvg.prototype.__zeusHeightWidthPatched) return;
        Blockly.BlockSvg.prototype.__zeusHeightWidthPatched = true;

        var original = Blockly.BlockSvg.prototype.getHeightWidth;
        if (typeof original !== 'function') return;

        Blockly.BlockSvg.prototype.getHeightWidth = function () {
            var height = this.height;
            var width = this.width;
            var next = this.getNextBlock && this.getNextBlock();
            if (next) {
                var nextHW = next.getHeightWidth();
                var constants = this.workspace && this.workspace.getRenderer
                    ? this.workspace.getRenderer().getConstants()
                    : null;
                var overlap = constants && typeof constants.NOTCH_HEIGHT === 'number'
                    ? constants.NOTCH_HEIGHT
                    : 0;

                try {
                    if (constants && this.nextConnection && typeof constants.shapeFor === 'function') {
                        var notch = constants.shapeFor(this.nextConnection);
                        if (notch && typeof notch.height === 'number') {
                            overlap = notch.height;
                        }
                    }
                } catch (_) { }

                height += nextHW.height - overlap;
                width = Math.max(width, nextHW.width);
            }
            return { height: height, width: width };
        };
    })();

})();
