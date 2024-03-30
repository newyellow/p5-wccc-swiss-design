// let nowColorIndex = 7;
// let nowLayoutIndex = 3;

function getRandomColorSet() {
    let settingDatas = [];

    settingDatas.push({
        'name': 'Standard Swiss',
        'bgColor': new BlendColor('#f9dcbc', BLEND),
        'specialColor': new BlendColor('#000000AA', MULTIPLY),
        'specialColorChance': 0.06,
        'shapeColors': [
            new BlendColor('#e02d26', MULTIPLY),
            new BlendColor('#ffb700', MULTIPLY),
            new BlendColor('#0166be', MULTIPLY),
            new BlendColor('#0166be', MULTIPLY),
        ]
    });

    settingDatas.push({
        'name': 'Dark Blue BG',
        'bgColor': new BlendColor('#1e3769', BLEND),
        'specialColor': new BlendColor('#000000AA', MULTIPLY),
        'specialColorChance': 0.06,
        'shapeColors': [
            new BlendColor('#061c49', ADD),
            new BlendColor('#df8e00', ADD),
            new BlendColor('#6a0707', ADD),
        ]
    })

    settingDatas.push({
        'name': 'BLACK BG',
        'bgColor': new BlendColor('#111111', BLEND),
        'specialColor': new BlendColor('#b3ba00', ADD),
        'specialColorChance': 0.06,
        'shapeColors': [
            new BlendColor('#9e0d33', ADD),
            new BlendColor('#216510', ADD),
            new BlendColor('#2b6f4b', ADD),
        ]
    })

    settingDatas.push({
        'name': 'Swiss Alps',
        'bgColor': new BlendColor('#ebebeb', BLEND),
        'specialColor': new BlendColor('#dad8dc', MULTIPLY),
        'specialColorChance': 0.00,
        'shapeColors': [
            new BlendColor('#cfdad4', MULTIPLY),
            new BlendColor('#193242', MULTIPLY),
            new BlendColor('#29465d', MULTIPLY),
            new BlendColor('#dad8dc', MULTIPLY),
        ]
    });

    settingDatas.push({
        'name': 'Swiss Almond',
        'bgColor': new BlendColor('#fff9ef', BLEND),
        'specialColor': new BlendColor('#000000', MULTIPLY),
        'specialColorChance': 0.12,
        'shapeColors': [
            new BlendColor('#faf1e5', MULTIPLY),
            new BlendColor('#f3eade', MULTIPLY),
            new BlendColor('#ebe2d6', MULTIPLY),
            new BlendColor('#e4d9cb', MULTIPLY),
        ]
    });

    settingDatas.push({
        'name': 'Red BG',
        'bgColor': new BlendColor('#f43530', BLEND),
        'specialColor': new BlendColor('#000000', MULTIPLY),
        'specialColorChance': 0.00,
        'shapeColors': [
            new BlendColor('#00aabb', MULTIPLY),
            new BlendColor('#e0e5da', MULTIPLY),
            new BlendColor('#46454b', ADD)
        ]
    });

    settingDatas.push({
        'name': 'Yellow Blue Purple',
        'bgColor': new BlendColor('#e0e5db', BLEND),
        'specialColor': new BlendColor('#000000', MULTIPLY),
        'specialColorChance': 0.00,
        'shapeColors': [
            new BlendColor('#00b8b8', MULTIPLY),
            new BlendColor('#de3d83', MULTIPLY),
            new BlendColor('#e4bd0b', MULTIPLY)
        ]
    });

    settingDatas.push({
        'name': 'Dark Blue White Frame',
        'bgColor': new BlendColor('#223647', BLEND),
        'specialColor': new BlendColor('#000000', MULTIPLY),
        'specialColorChance': 0.12,
        'shapeColors': [
            new BlendColor('#ffffffAA', BLEND),
            new BlendColor('#ffffffAA', BLEND),
            new BlendColor('#ffffffAA', BLEND)
        ]
    });


    // nowColorIndex = (nowColorIndex + 1) % settingDatas.length;
    // let pickedSet = settingDatas[nowColorIndex];
    // let pickedSet = settingDatas[7];
    let pickedSet = random(settingDatas);

    return new PaletteSet(pickedSet);
}

function getRandomLayoutSet() {

    // nowLayoutIndex = (nowLayoutIndex + 1) % 8;
    // let layoutType = nowLayoutIndex;

    let layoutType = int(random(0, 8));

    let bgLayer = null;
    let layers = [];
    let bgChance = 0.1;

    // all same size with different fill
    if (layoutType == 0) {
        bgLayer = null;
        layers.push(new ShapeLayer(gridFormats[2].x, gridFormats[2].y, 0.2, 6, false, false));
        layers.push(new ShapeLayer(gridFormats[2].x, gridFormats[2].y, 0.6, 6, false, false));
        layers.push(new ShapeLayer(gridFormats[2].x, gridFormats[2].y, 1.0, 6, false, false));
        bgChance = 0.0;
    }
    // medium bg with small shapes
    else if (layoutType == 1) {
        bgLayer = new ShapeLayer(gridFormats[1].x, gridFormats[1].y, 1.0, 2, false, false);
        layers.push(new ShapeLayer(gridFormats[3].x, gridFormats[3].y, 1.0, 2, false, false));
        layers.push(new ShapeLayer(gridFormats[3].x, gridFormats[3].y, 0.9, 2, false, false));
        bgChance = 0.12;
    }
    // big bg and all size shapes
    else if (layoutType == 2) {
        bgLayer = new ShapeLayer(gridFormats[0].x, gridFormats[0].y, 1.0, 2, false, false);
        layers.push(new ShapeLayer(gridFormats[1].x, gridFormats[1].y, 0.9, 2, false, false));
        layers.push(new ShapeLayer(gridFormats[2].x, gridFormats[2].y, 0.9, 2, false, false));
        layers.push(new ShapeLayer(gridFormats[3].x, gridFormats[3].y, 0.8, 2, false, false));
        
        bgChance = 0.06;
    }
    // horizontal chain
    else if (layoutType == 3) {
        bgLayer = null;
        layers.push(new ShapeLayer(gridFormats[2].x, gridFormats[2].y, 0.8, 2, false, false));
        layers.push(new ShapeLayer(gridFormats[2].x, gridFormats[2].y, 0.4, 2, false, true));
    }
    // vertical chain
    else if (layoutType == 4) {
        bgLayer = null;
        layers.push(new ShapeLayer(gridFormats[1].x, gridFormats[1].y, 0.8, 2, false, false));
        layers.push(new ShapeLayer(gridFormats[1].x, gridFormats[1].y, 0.2, 2, true, false));
    }
    // 3 + 2
    else if (layoutType == 5) {
        bgLayer = null;
        layers.push(new ShapeLayer(gridFormats[3].x, gridFormats[3].y, 0.8, 2, false, false));
        layers.push(new ShapeLayer(gridFormats[2].x, gridFormats[2].y, 0.9, 2, false, false));
    }
    // squares
    else if (layoutType == 6) {
        bgLayer = null;
        layers.push(new ShapeLayer(gridFormats[1].x, gridFormats[1].y, 0.9, 2, false, false));
        layers.push(new ShapeLayer(gridFormats[1].x, gridFormats[1].y, 0.6, 2, false, false));
    }
    // big shapes
    else if (layoutType == 7) {
        bgLayer = new ShapeLayer(gridFormats[0].x, gridFormats[0].y, 0.9, 2, false, false);
        layers.push(new ShapeLayer(gridFormats[0].x, gridFormats[0].y, 0.2, 2, true, true));
        layers.push(new ShapeLayer(gridFormats[0].x, gridFormats[0].y, 0.2, 2, true, false));
        layers.push(new ShapeLayer(gridFormats[0].x, gridFormats[0].y, 0.2, 2, false, true));
        bgChance = 0.12;
    }

    return new LayoutSet(bgLayer, layers, bgChance);
}