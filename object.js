class NYColor {
    constructor(_h, _s, _b, _a = 1.0) {
        this.h = _h;
        this.s = _s;
        this.b = _b;
        this.a = _a;
    }

    copy() {
        return new NYColor(this.h, this.s, this.b, this.a);
    }

    slightRandomize(_hDiff = 10, _sDiff = 12, _bDiff = 12, _aDiff = 0.0) {
        this.h += random(-0.5 * _hDiff, 0.5 * _hDiff);
        this.s += random(-0.5 * _sDiff, 0.5 * _sDiff);
        this.b += random(-0.5 * _bDiff, 0.5 * _bDiff);
        this.a += random(-0.5 * _aDiff, 0.5 * _aDiff);

        this.h = processHue(this.h);
    }

    color() {
        return color(this.h, this.s, this.b, this.a);
    }

    static newRandomColor(_mainHue) {
        let h = processHue(_mainHue + random(-80, 80));
        let s = random(40, 100);
        let b = random(60, 100);

        return new NYColor(h, s, b);
    }
}

class MorphShape {
    constructor(_x, _y, _w, _h, _points, _color) {
        this.x = _x;
        this.y = _y;
        this.w = _w;
        this.h = _h;
        this.points = _points;
        this.color = _color;

        this.nowMorphStep = 0;
        this.totalMorphStep = 100;
        this.morphCurve = linear;
        this.isMorphFinish = true;

        this.fromX = this.x;
        this.fromY = this.y;
        this.fromW = this.w;
        this.fromH = this.h;
        this.fromPoints = [];
        this.fromPointsSampled = [];
        this.fromColor = color(this.color);

        this.toX = this.x;
        this.toY = this.y;
        this.toW = this.w;
        this.toH = this.h;
        this.toPoints = [];
        this.toPointsSampled = [];
        this.toColor = color(this.color);
    }

    copy() {
        let newShape = new MorphShape(this.x, this.y, this.w, this.h, [...this.points], this.color);
        return newShape;
    }

    startMorphing () {
        this.isMorphFinish = false;
    }

    setupMorphDataByShape(_toMorphShape, _steps, _morphCurve = linear) {
        this.setupMorphData(_toMorphShape.x, _toMorphShape.y, _toMorphShape.w, _toMorphShape.h, _toMorphShape.points, _toMorphShape.color, _steps, _morphCurve);
    }

    setupMorphData(_toX, _toY, _toW, _toH, _toPoints, _toColor, _steps, _morphCurve = linear) {
        this.fromX = this.x;
        this.fromY = this.y;
        this.fromW = this.w;
        this.fromH = this.h;
        this.fromPoints = [...this.points];
        this.fromColor = color(this.color);

        this.toX = _toX;
        this.toY = _toY;
        this.toW = _toW;
        this.toH = _toH;
        this.toPoints = [..._toPoints];
        this.toColor = color(_toColor);

        this.morphCurve = _morphCurve;
        this.totalMorphStep = _steps;
        this.nowMorphStep = 0;

        // recalculate sampled points
        // let tempPointCount = lcm(this.fromPoints.length, this.toPoints.length);
        // this.fromPointsSampled = resamplePoints(this.fromPoints, tempPointCount);
        // this.toPointsSampled = resamplePoints(this.toPoints, tempPointCount);

        this.points = [];
        for (let i = 0; i < this.fromPoints.length; i++) {
            this.points.push(this.fromPoints[i].copy());
        }
    }

    morphStep() {
        if (this.isMorphFinish == false) {
            this.nowMorphStep++;
            let morphT = this.nowMorphStep / (this.totalMorphStep - 1);
            let animatedT = this.morphCurve(morphT);

            this.x = NYLerp(this.fromX, this.toX, animatedT);
            this.y = NYLerp(this.fromY, this.toY, animatedT);
            this.w = NYLerp(this.fromW, this.toW, animatedT);
            this.h = NYLerp(this.fromH, this.toH, animatedT);

            for (let i = 0; i < this.points.length; i++) {
                this.points[i].x = NYLerp(this.fromPoints[i].x, this.toPoints[i].x, animatedT);
                this.points[i].y = NYLerp(this.fromPoints[i].y, this.toPoints[i].y, animatedT);
            }

            this.color = lerpColor(this.fromColor, this.toColor, animatedT);

            if (morphT >= 1.0) {
                this.isMorphFinish = true;
                this.endMorph();
            }
        }
    }

    endMorph() {
        this.x = this.toX;
        this.y = this.toY;
        this.w = this.toW;
        this.h = this.toH;
        this.color = this.toColor;
        this.points = this.toPoints;
    }

    draw(_hasStroke = false, _strokeColor = null) {
        if (_hasStroke) {
            stroke(_strokeColor);
        }
        else {
            noStroke();
        }

        fill(this.color);
        push();
        translate(this.x, this.y);
        beginShape();

        for (let i = 0; i < this.points.length; i++) {
            vertex(this.points[i].x * this.w, this.points[i].y * this.h);
        }

        endShape(CLOSE);
        pop();
    }

    drawPoints() {
        push();
        translate(this.x, this.y);

        stroke('white');
        fill('red');

        for (let i = 0; i < this.points.length; i++) {
            circle(this.points[i].x * this.w, this.points[i].y * this.h, 3);
        }
        pop();
    }
}

class NYPoint {
    constructor(_x, _y, _t = 0) {
        this.x = _x;
        this.y = _y;
        this.t = _t;
    }

    copy() {
        return new NYPoint(this.x, this.y, this.t);
    }
}

class ShapeLayer {
    constructor(_xCount, _yCount, _fillRatio, _perSpotCount = 1, _offsetX = false, _offsetY = false) {
        this.xCount = _xCount;
        this.yCount = _yCount;

        this.layerWidth = width / this.xCount;
        this.layerHeight = height / this.yCount;

        this.startX = 0;
        this.startY = 0;

        if (_offsetX) {
            this.xCount++;
            this.startX = -this.layerWidth / 2;
        }

        if (_offsetY) {
            this.yCount++;
            this.startY = -this.layerHeight / 2;
        }

        this.fillRatio = _fillRatio;

        this.possiblePoints = [];
        for (let x = 0; x < this.xCount; x++) {
            for (let y = 0; y < this.yCount; y++) {

                for (let i = 0; i < _perSpotCount; i++)
                    this.possiblePoints.push({ x: x, y: y });
            }
        }

        this.possiblePoints.sort((a, b) => {
            if (random() < 0.5)
                return -1;
            else
                return 1;
        });
    }

    getRandomShape() {
        // if (this.possiblePoints.length <= 0) {
        //     console.log("No Available Spot");
        //     return;
        // }
        // let nowSpot = this.possiblePoints.pop();

        let spotX = int(random(0, this.xCount));
        let spotY = int(random(0, this.yCount));

        let nowSpot = {
            x: spotX,
            y: spotY
        };

        let shapeX = this.startX + nowSpot.x * this.layerWidth;
        let shapeY = this.startY + nowSpot.y * this.layerHeight;

        let shapeType = int(random(0, 7));
        let newShapePoints = [];

        if (shapeType == 0) {
            newShapePoints = rectPoints(this.fillRatio);
        }
        else if (shapeType == 1) {
            newShapePoints = trianglePoints(int(random(0, 4)), this.fillRatio);
        }
        else if (shapeType == 2) {
            newShapePoints = LShapePoints(int(random(0, 4)), 0.3, this.fillRatio);
        }
        else if (shapeType == 3) {
            newShapePoints = ellipsePoints(this.fillRatio);
        }
        else if (shapeType == 4) {
            newShapePoints = halfCirclePoints(int(random(0, 4)), this.fillRatio);
        }
        else if (shapeType == 5) {
            newShapePoints = quadCirclePoints(int(random(0, 4)), this.fillRatio);
        }
        else {
            newShapePoints = crystalPoints(int(random(0, 2)), 0.4, this.fillRatio);
        }

        let newShapeColor = nowColorSet.getRandomColor();

        let newShape = new MorphShape(shapeX, shapeY, this.layerWidth, this.layerHeight, newShapePoints, newShapeColor);
        return newShape;
    }

    // addEmptyShape() {
    //     let nowSpot = null;

    //     if (this.possiblePoints.length <= 0) {
    //         // console.log("No Available Spot for Empty Shape, assign random one");
    //         nowSpot = {
    //             x: int(random(0, this.xCount)),
    //             y: int(random(0, this.yCount))
    //         }
    //     }
    //     else
    //         nowSpot = this.possiblePoints.pop();

    //     let shapeX = this.startX + nowSpot.x * this.layerWidth;
    //     let shapeY = this.startY + nowSpot.y * this.layerHeight;

    //     let newShapePoints = nullShapePoints();
    //     let newShapeColor = color('white');

    //     let newShape = new MorphShape(shapeX, shapeY, this.layerWidth, this.layerHeight, newShapePoints, newShapeColor);
    //     newShape.isEmptyShape = true;
    //     this.shapes.push(newShape);
    // }

    // clearEmptyShapes () {
    //     for (let i = this.shapes.length - 1; i >= 0; i--) {
    //         if (this.shapes[i].isEmptyShape) {
    //             this.shapes.splice(i, 1);
    //         }
    //     }
    // }
}

class PaletteSet {
    constructor(_colorCodes, _bgColorCode, _specialColorCode, _normalMode, _specialMode, _specialChance = 0.03) {

        this.mainColors = [];
        for(let i=0; i< _colorCodes.length; i++) {
            this.mainColors.push(color(_colorCodes[i]));
        }
        
        this.bgColor = color(_bgColorCode);
        this.specialColor = color(_specialColorCode);
        this.specialColorMode = _specialMode;
        this.normalColorMode = _normalMode;
        this.specialColorChance = 0.03;
    }

    getRandomColor () {
        if(random() < this.specialColorChance)
            return this.specialColor;
        else
            return random(this.mainColors);
    }
}