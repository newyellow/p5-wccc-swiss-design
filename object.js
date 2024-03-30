class BlendColor {
    constructor(_colorCode, _blendMode = BLEND) {
        this.colorHex = _colorCode;
        this.color = new NYRGBColor(...colorHexToRgba(_colorCode));
        this.blendType = _blendMode;
    }

    copy() {
        return new BlendColor(this.colorHex, this.blendType);
    }
}

class NYRGBColor {
    constructor(_r, _g, _b, _a = 255) {
        this.r = _r;
        this.g = _g;
        this.b = _b;
        this.a = _a;
    }

    copy() {
        return new NYRGBColor(this.r, this.g, this.b, this.a);
    }
}

class MorphShape {
    constructor(_x, _y, _w, _h, _points, _color) {
        this.x = _x;
        this.y = _y;
        this.w = _w;
        this.h = _h;
        this.points = _points;
        this.blendColor = _color;
        this.drawColor = _color.color;

        this.offsetX = 0;
        this.offsetY = 0;
        this.offsetMoveSpeed = random(0.06, 0.2);

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
        this.fromBlendColor = this.blendColor;

        this.toX = this.x;
        this.toY = this.y;
        this.toW = this.w;
        this.toH = this.h;
        this.toPoints = [];
        this.toPointsSampled = [];
        this.toBlendColor = this.blendColor;

        this.alphaFadeBlending = false;
    }

    copy() {
        let newShape = new MorphShape(this.x, this.y, this.w, this.h, [...this.points], this.color);
        return newShape;
    }

    startMorphing() {
        this.isMorphFinish = false;
    }

    setupMorphDataByShape(_toMorphShape, _steps, _morphCurve = linear) {
        this.setupMorphData(_toMorphShape.x, _toMorphShape.y, _toMorphShape.w, _toMorphShape.h, _toMorphShape.points, _toMorphShape.blendColor, _steps, _morphCurve);
    }

    setupMorphData(_toX, _toY, _toW, _toH, _toPoints, _toColor, _steps, _morphCurve = linear) {
        this.fromX = this.x;
        this.fromY = this.y;
        this.fromW = this.w;
        this.fromH = this.h;
        this.fromPoints = [...this.points];
        this.fromBlendColor = this.blendColor.copy();

        this.toX = _toX;
        this.toY = _toY;
        this.toW = _toW;
        this.toH = _toH;
        this.toPoints = [..._toPoints];
        this.toBlendColor = _toColor.copy();

        this.morphCurve = _morphCurve;
        this.totalMorphStep = _steps;
        this.nowMorphStep = 0;
        this.nowMorphT = 0;
        this.nowAnimatedT = 0;

        // check if it needs alpha blend
        if (this.fromBlendColor.blendType != this.toBlendColor.blendType)
            this.alphaFadeBlending = true;
        else
            this.alphaFadeBlending = false;

        this.points = [];
        for (let i = 0; i < this.fromPoints.length; i++) {
            this.points.push(this.fromPoints[i].copy());
        }

        // run first frame to do the calculation
        this.morphStep();
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

            this.nowMorphT = morphT;
            this.nowAnimatedT = animatedT;
            this.drawColor = NYLerpColorRGBA(this.fromBlendColor.color, this.toBlendColor.color, animatedT);
            this.blendColor.color = this.drawColor;

            if (morphT > 0.5) {
                this.blendColor.blendType = this.toBlendColor.blendType;
            }

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
        this.blendColor = this.toBlendColor.copy();
        this.drawColor = this.toBlendColor.color.copy();
        this.points = this.toPoints;
    }

    draw(_hasStroke = false, _strokeColor = null) {
        if (_hasStroke) {
            stroke(_strokeColor);
        }
        else {
            noStroke();
        }

        if (MOUSE_INTERACTIVE) {
            let mouseDist = dist(mouseX, mouseY, this.x, this.y);
            if (mouseDist < 300 && IS_MOUSE_OVER) {
                let closeT = inverseLerp(300, 0, mouseDist);
                let direction = getAngle(this.x, this.y, mouseX, mouseY);

                this.offsetX -= lerp(this.offsetX, 200, closeT) * sin(radians(direction)) * this.offsetMoveSpeed;
                this.offsetY -= lerp(this.offsetY, 200, closeT) * -cos(radians(direction)) * this.offsetMoveSpeed;
            }


            this.offsetX = lerp(this.offsetX, 0, 0.06);
            this.offsetY = lerp(this.offsetY, 0, 0.06);
        }

        // draw twice for shape and color blending
        if (this.alphaFadeBlending) {
            let toAlphaMultiplier = this.nowAnimatedT;
            let fromAlphaMultiplier = 1 - this.nowAnimatedT;

            let fromAlpha = int(this.drawColor.a * fromAlphaMultiplier);
            let toAlpha = int(this.drawColor.a * toAlphaMultiplier);

            blendMode(this.fromBlendColor.blendType);
            fill(this.drawColor.r, this.drawColor.g, this.drawColor.b, fromAlpha);
            this.drawShape();

            blendMode(this.toBlendColor.blendType);
            fill(this.drawColor.r, this.drawColor.g, this.drawColor.b, toAlpha);
            this.drawShape();
        }
        else {
            blendMode(this.blendColor.blendType);
            fill(this.drawColor.r, this.drawColor.g, this.drawColor.b, this.drawColor.a);
            this.drawShape();
        }

    }

    drawShape() {
        push();
        translate(this.x + this.offsetX, this.y + this.offsetY);
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

        let spotX = int(random(0, this.xCount));
        let spotY = int(random(0, this.yCount));

        let nowSpot = {
            x: spotX,
            y: spotY
        };

        let shapeX = this.startX + nowSpot.x * this.layerWidth;
        let shapeY = this.startY + nowSpot.y * this.layerHeight;

        let shapeType = int(random(0, 6));
        let newShapePoints = [];

        // low chance to draw ellipse
        if (random() < 0.03) {
            newShapePoints = ellipsePoints(this.fillRatio);
        }
        else {
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
                newShapePoints = halfCirclePoints(int(random(0, 4)), this.fillRatio);
            }
            else if (shapeType == 4) {
                newShapePoints = quadCirclePoints(int(random(0, 4)), this.fillRatio);
            }
            else {
                newShapePoints = crystalPoints(int(random(0, 2)), 0.4, this.fillRatio);
            }
        }

        let newShapeColor = nowColorSet.getRandomColor();

        let newShape = new MorphShape(shapeX, shapeY, this.layerWidth, this.layerHeight, newShapePoints, newShapeColor);
        return newShape;
    }
}

class PaletteSet {
    constructor(_settingData) {

        this.shapeColors = _settingData.shapeColors;
        this.bgColor = _settingData.bgColor;
        this.specialColor = _settingData.specialColor;

        this.specialColorChance = _settingData.specialColorChance;
    }

    getRandomColor() {
        if (random() < this.specialColorChance)
            return this.specialColor;
        else
            return random(this.shapeColors);
    }
}

class LayoutSet {
    constructor(_bgLayer, _otherLayers, _bgChance)
    {
        this.bgLayer = _bgLayer;
        this.otherLayers = _otherLayers;
        this.bgChance = _bgChance;
    }
}