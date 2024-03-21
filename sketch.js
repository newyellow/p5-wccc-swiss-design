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

let palette = ['#e02d26', '#ffb700', '#0166be', '#0166be'];
let gridFormats = [];
let layerPossiblePoints = [];
let possibleEasings = [];

let shapes = [];

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

  createCanvas(canvasWidth, canvasHeight);
  flex();
  background('#f9dcbc');
  colorMode(RGB);
  blendMode(MULTIPLY);

  possibleEasings = [
    easeInOutSine, easeInOutQuad, easeInOutCubic,
  ];


  frameRate(60);
  // layer method
  // let layerCount = 4;

  // // init layers
  // for (let i = 0; i < layerCount; i++) {
  //   layers.push(generateRandomShapeLayer());
  // }

  // while (true) {
  //   // setup morph
  //   for (let i = 0; i < layers.length; i++) {
  //     let newTargetLayer = generateRandomShapeLayer();
  //     setupMorphShapes(layers[i], newTargetLayer);

  //     // assign new layer variables for next time morph
  //     layers[i].xCount = newTargetLayer.xCount;
  //     layers[i].yCount = newTargetLayer.yCount;
  //     layers[i].layerWidth = newTargetLayer.layerWidth;
  //     layers[i].layerHeight = newTargetLayer.layerHeight;
  //     layers[i].startX = newTargetLayer.startX;
  //     layers[i].startY = newTargetLayer.startY;
  //     layers[i].possiblePoints = newTargetLayer.possiblePoints;
  //   }

  //   // start morphing
  //   for (let i = 0; i < 200; i++) {
  //     blendMode(BLEND);
  //     background('#f9dcbc');
  //     blendMode(MULTIPLY);

  //     for (let l=0; l<layers.length; l++) {
  //       for(let s=0; s< layers[l].shapes.length; s++) {
  //         layers[l].shapes[s].morphStep();
  //       }

  //       drawLayerShapes(layers[l].shapes);
  //     }

  //     await sleep(16);
  //   }
  //   await sleep(200);
  // }


  // shape method
  let bgLayer; // only one big layer
  let layers = [];
  let newShapes = [];

  let nowFillRatio = 1.0;
  let shapeCount = 120;
  let layerCount = 4;

  while (true) {

    // re-generate layers
    layers = [];
    bgLayer = null;

    bgLayer = generateLayerByGridFormat(gridFormats[0]);

    // for (let i = 0; i < layerCount; i++) {
    //   let randomFormatIndex = int(random(1, gridFormats.length));
    //   let newLayer = generateLayerByGridFormat(gridFormats[randomFormatIndex], 0.6);
    //   layers.push(newLayer);
    // }
    
    // layers.push(new ShapeLayer(gridFormats[2].x, gridFormats[2].y, 1.0, 2, false, false));
    layers.push(new ShapeLayer(gridFormats[2].x, gridFormats[2].y, 0.95, 2, false, false));
    layers.push(new ShapeLayer(gridFormats[2].x, gridFormats[2].y, 0.6, 2, false, false));

    // init first shapes
    let newShapes = [];
    for (let i = 0; i < shapeCount; i++) {
      let targetShapeLayer = random(layers);
      let newShape = null;

      if(bgLayer != null && random() < 0.048)
        newShape = bgLayer.getRandomShape();
      else
        newShape = targetShapeLayer.getRandomShape();
      newShapes.push(newShape);
    }

    // first time
    let isFirstTime = false;
    if (shapes.length == 0) {
      for (let i = 0; i < newShapes.length; i++)
        shapes[i] = newShapes[i];

      isFirstTime = true;
    }
    else {
      for (let i = 0; i < newShapes.length; i++) {
        shapes[i].setupMorphDataByShape(newShapes[i], int(random(60, 120)), random(possibleEasings));
      }
    }

    if (isFirstTime)
      await sleep(1000);
    else {
      // start morphing
      let triggerMorhpingFrames = 120;
      let nowTriggeredIndex = 0;

      for (let time = 0; time < triggerMorhpingFrames; time++) {
        let t = time / (triggerMorhpingFrames - 1);
        let animatedT = easeInQuint(t);
        let toIndex = int(animatedT * newShapes.length);

        for (let i = nowTriggeredIndex; i < toIndex; i++) {
          shapes[i].startMorphing();
        }
        nowTriggeredIndex = toIndex;
        await sleep(30);
      }
      
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
  background('#f9dcbc');

  blendMode(MULTIPLY);
  drawLayerShapes(shapes);
}

function generateLayerByGridFormat (_gridFormat, _fillRatio) {
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