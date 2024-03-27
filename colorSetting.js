function getRandomColorSet() {
    let settingDatas = [];

    settingDatas.push({
        'bgColor': new BlendColor('#f9dcbc', BLEND),
        'specialColor': new BlendColor('#000000AA', BLEND),
        'specialColorChance': 0.2,
        'shapeColors': [
            new BlendColor('#e02d26', MULTIPLY),
            new BlendColor('#ffb700', MULTIPLY),
            new BlendColor('#0166be', MULTIPLY),
            new BlendColor('#0166be', MULTIPLY),
        ]
    });

    let pickedSet = settingDatas[0];

    return new PaletteSet(pickedSet);
}