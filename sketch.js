// Weekly Creative Coding Challenge Topic 'Swiss Design'
//
// Check the challenge page if you would like to join:
// https://openprocessing.org/curation/78544 
//

// For this week I simply make some pre-degined shapes, and make them morph
// But still some palettes to add, and some bug to fix (some shapes disappear)
// But just let it be for now!
//
// The references for this work:
// https://www.swissted.com/products/david-bowie-at-dunstable-civic-center-1972
//

let palettes = [];
let gridFormats = [];
let layerPossiblePoints = [];
let possibleEasings = [];

let shapes = [];

let nowColorSet = null;

let nowBGColor = null;
let nextBGColor = null;
let bgFillColor = null;

let MOUSE_INTERACTIVE = false;
let IS_MOUSE_OVER = false;

let mainCanvas = null;

async function setup() {
  let canvasWidth = 1800;
  let canvasHeight = 1200;

  gridFormats = [
    { x: 3, y: 2 },
    { x: 6, y: 4 },
    { x: 9, y: 6 },
    { x: 18, y: 12 }
  ];

  if (windowHeight > windowWidth) {
    canvasWidth = 1200;
    canvasHeight = 1800;

    gridFormats = [
      { x: 2, y: 3 },
      { x: 4, y: 6 },
      { x: 6, y: 9 },
      { x: 12, y: 18 }
    ];
  }

  mainCanvas = createCanvas(canvasWidth, canvasHeight);
  mainCanvas.mouseOver(() => {
    IS_MOUSE_OVER = true;
  });

  mainCanvas.mouseOut(() => {
    IS_MOUSE_OVER = false;
  });
  
  flex();
  colorMode(RGB);

  // if not mobile, enable mouse interactive
  MOUSE_INTERACTIVE = !checkIsMobile();

  possibleEasings = [
    easeInOutSine, easeInOutQuad, easeInOutCubic,
  ];

  frameRate(60);

  // shape method
  let bgLayer; // only one big layer
  let layers = [];
  let bgChance = 0.1;
  let newShapes = [];

  let nowFillRatio = 1.0;
  let shapeCount = 120;
  let layerCount = 4;


  while (true) {

    // pick new color set
    nowColorSet = getRandomColorSet();
    nextBGColor = nowColorSet.bgColor.color;
    
    // re-generate layers
    layers = [];
    bgLayer = null;

    // get layout setting
    let layoutSetting = getRandomLayoutSet();
    bgLayer = layoutSetting.bgLayer;
    layers = layoutSetting.otherLayers;
    bgChance = layoutSetting.bgChance;

    // generate new shapes
    let newShapes = [];
    for (let i = 0; i < shapeCount; i++) {
      let targetShapeLayer = random(layers);
      let newShape = null;

      if (bgLayer != null && random() < bgChance)
        newShape = bgLayer.getRandomShape();
      else
        newShape = targetShapeLayer.getRandomShape();
      newShapes.push(newShape);
    }

    // first time
    let isFirstTime = false;
    if (shapes.length == 0) {
      shapes = newShapes;

      isFirstTime = true;
      nowBGColor = nextBGColor;
      bgFillColor = nowBGColor;
    }
    // else {
      for (let i = 0; i < newShapes.length; i++) {
        shapes[i].setupMorphDataByShape(newShapes[i], int(random(60, 120)), random(possibleEasings));
      }
    // }

    if (isFirstTime)
    {
      await sleep(1000);
    }
    else {
      // start morphing
      let triggerMorhpingFrames = 120;
      let nowTriggeredIndex = 0;

      for (let time = 0; time < triggerMorhpingFrames; time++) {
        let t = time / (triggerMorhpingFrames - 1);
        let animatedT = easeInQuint(t);
        let toIndex = int(animatedT * newShapes.length);

        bgFillColor = NYLerpColorRGBA(nowBGColor, nextBGColor, animatedT);

        for (let i = nowTriggeredIndex; i < toIndex; i++) {
          shapes[i].startMorphing();
        }
        nowTriggeredIndex = toIndex;
        await sleep(30);
      }
      bgFillColor = nextBGColor;
      nowBGColor = nextBGColor;

      await sleep(3000);
    }

    // finish setup, start animating
    // drawLayerShapes(shapes);
  }

  console.log(shapes);

}

function draw() {
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].morphStep();
  }

  blendMode(BLEND);
  background(bgFillColor.r, bgFillColor.g, bgFillColor.b);

  drawLayerShapes(shapes);
}

function generateLayerByGridFormat(_gridFormat, _fillRatio) {
  let nowGrid = _gridFormat;
  let fillRatio = _fillRatio;
  let offsetX = false;
  let offsetY = false;

  if (random() < 0.4)
    fillRatio = 0.9;

  if (random() < 0.1)
    offsetX = true;

  if (random() < 0.1)
    offsetY = true;

  let newLayer = new ShapeLayer(nowGrid.x, nowGrid.y, fillRatio, 2, offsetX, offsetY);
  // let maxCount = newLayer.xCount * newLayer.yCount;

  // let shapeCount = int(random(0.2, 0.6) * maxCount);
  // for (let j = 0; j < shapeCount; j++) {
  //   newLayer.addRandomShape();
  // }

  return newLayer;
}

function setupMorphShapes(_fromLayer, _toLayer) {

  // make both layers have same shape count
  let shapeCountDiff = abs(_fromLayer.shapes.length - _toLayer.shapes.length);
  let addTarget = null;

  if (_fromLayer.shapes.length > _toLayer.shapes.length)
    addTarget = _toLayer;
  else
    addTarget = _fromLayer;

  for (let i = 0; i < shapeCountDiff; i++) {
    addTarget.addEmptyShape();
  }

  for (let i = 0; i < _fromLayer.shapes.length; i++) {
    _fromLayer.shapes[i].setupMorphDataByShape(_toLayer.shapes[i], int(random(100, 160)), random(possibleEasings));
  }

}

function drawLayerShapes(_shapes) {
  for (let i = 0; i < _shapes.length; i++) {
    _shapes[i].draw();
  }
}

// async sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}