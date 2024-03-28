function getRandomColorSet() {
    let settingDatas = [];

    settingDatas.push({
        'bgColor': new BlendColor('#f9dcbc', BLEND),
        'specialColor': new BlendColor('#000000AA', MULTIPLY),
        'specialColorChance': 0.2,
        'shapeColors': [
            new BlendColor('#e02d26', MULTIPLY),
            new BlendColor('#ffb700', MULTIPLY),
            new BlendColor('#0166be', MULTIPLY),
            new BlendColor('#0166be', MULTIPLY),
        ]
    });

    settingDatas.push({
        'bgColor': new BlendColor('#2c3196', BLEND),
        'specialColor': new BlendColor('#ffffffaa', ADD),
        'specialColorChance': 0.2,
        'shapeColors': [
            new BlendColor('#2366db', ADD),
            new BlendColor('#11803b', ADD),
            new BlendColor('#962c47', ADD),
            new BlendColor('#6a00ff', ADD),
        ]
    })

    // let pickedSet = settingDatas[1];
    let pickedSet = random(settingDatas);

    return new PaletteSet(pickedSet);
}