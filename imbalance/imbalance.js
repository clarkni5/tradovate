const predef = require("./tools/predef");
const {ParamType} = require("./tools/meta");
const {du, op} = require('./tools/graphics')

class imbalance {
    map(d, i, history) {
        const graphics = [];
        
        if (i >= 2) {
            const left = history.back(2);  // left candlestick
            const middle = history.back(1);  // middle candlestick
            const right = d;  // right candlestick (current candlestick)

            if (left.high() < right.low() && 
                    right.low() - left.high() >= this.props.minGap) {
                // Gap up
                graphics.push(this.createRectangle(
                    middle.index(), right.low(), left.high(),
                    this.props.gapUpColor, this.props.gapUpOpacity));
                
            } else if (left.low() > right.high() && 
                    left.low() - right.high() >= this.props.minGap) {
                // Gap down
                graphics.push(this.createRectangle(
                    middle.index(), left.low(), right.high(), 
                    this.props.gapDownColor, this.props.gapDownOpacity));
            }
        }

        return {
            value: undefined,
            graphics: this.props.showGraphics && graphics.length && {
                items: [
                    {
                        tag: "Container",
                        key: "container",
                        children: graphics,
                        transformOps: [
                            {
                                tag: 'ZIndex',
                                zIndex: this.props.zIndex,
                            }
                        ]
                    }
                ] 
                
            },
        };
    }

    // Create a rectangle that spans the left and right candlestick
    createRectangle(index, high, low, color, opacity) {
        return {
            tag: "Shapes",
            key: 'rectangle',
            primitives: [
                {
                    tag: 'Rectangle',
                    position: {  // bottom left
                        x: op(du(index), '-', du(1.5)),
                        y: du(low),
                    },
                    size: {
                        height: du(high - low),
                        width: du(3),
                    },
                },
            ],
            fillStyle: {
                color: color,
                opacity: opacity,
            }
        };
    }
}

module.exports = {
    name: "imbalance",
    description: "Imbalance / Fair value gap",
    calculator: imbalance,
    params: {
        // Ignore gaps smaller than the min gap
        minGap: predef.paramSpecs.number(2.25, 0.25, 0),
        
        // Gap up style
        gapUpColor: predef.paramSpecs.color('#B8E986'),
        gapUpOpacity: predef.paramSpecs.percent(40, 5, 0, 100),
        
        // Gap down style
        gapDownColor: predef.paramSpecs.color('#D0021B'),
        gapDownOpacity: predef.paramSpecs.percent(40, 5, 0, 100),
        
        // Graphics controls
        showGraphics: predef.paramSpecs.bool(true),
        zIndex: {
            type: ParamType.NUMBER,
            def: -30,  // candlesticks have a z-index of -20
            restrictions: {
                step: 1,
                max: 19  // graphics disappear when the z-index is >= 20
            }
        }
    },
    tags: [predef.tags.Channels],
};
