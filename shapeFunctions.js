let SHAPE_POINT_COUNT = 36;

function getLinePoints (_fromX, _fromY, _toX, _toY, _pointCount) {
  let points = [];
  for (let i = 0; i < _pointCount; i++) {
    let t = i / (_pointCount - 1);
    let x = lerp(_fromX, _toX, t);
    let y = lerp(_fromY, _toY, t);
    points.push(new NYPoint(x, y));
  }

  return points;
}

function getArcPoints (_centerX, _centerY, _radius, _startAngle, _endAngle, _pointCount) {
  let points = [];
  for (let i = 0; i < _pointCount; i++) {
    let t = i / (_pointCount - 1);
    let nowAngle = lerp(_startAngle, _endAngle, t);
    let x = _centerX + sin(radians(nowAngle)) * _radius;
    let y = _centerY - cos(radians(nowAngle)) * _radius;
    points.push(new NYPoint(x, y));
  }

  return points;
}

function rectPoints(_fillRatio = 1.0) {
  let spaceRatio = (1.0 - _fillRatio) / 2;
  let pointsPerSide = SHAPE_POINT_COUNT / 4;

  let points = [];
  points.push(...getLinePoints(spaceRatio, spaceRatio, 1 - spaceRatio, spaceRatio, pointsPerSide));
  points.push(...getLinePoints(1 - spaceRatio, spaceRatio, 1 - spaceRatio, 1 - spaceRatio, pointsPerSide));
  points.push(...getLinePoints(1 - spaceRatio, 1 - spaceRatio, spaceRatio, 1 - spaceRatio, pointsPerSide));
  points.push(...getLinePoints(spaceRatio, 1 - spaceRatio, spaceRatio, spaceRatio, pointsPerSide));

  return points;
}

function trianglePoints(_direction, _fillRatio = 1.0) {
  let spaceRatio = (1.0 - _fillRatio) / 2;

  let fullSizePos = 1.0 - spaceRatio;
  let minSizePos = spaceRatio;

  let shapeDirection = _direction;

  let _x1 = 0;
  let _y1 = 0;

  let _x2 = 0;
  let _y2 = 0;

  let _x3 = 0;
  let _y3 = 0;

  if (shapeDirection == 0) {
    _x1 = fullSizePos;
    _y1 = minSizePos;

    _x2 = fullSizePos;
    _y2 = fullSizePos;

    _x3 = minSizePos;
    _y3 = fullSizePos;
  }
  else if (shapeDirection == 1) {
    _x1 = minSizePos;
    _y1 = minSizePos;

    _x2 = fullSizePos;
    _y2 = minSizePos;

    _x3 = fullSizePos;
    _y3 = fullSizePos;
  }
  else if (shapeDirection == 2) {
    _x1 = minSizePos;
    _y1 = fullSizePos;

    _x2 = minSizePos;
    _y2 = minSizePos;

    _x3 = fullSizePos;
    _y3 = minSizePos;
  }
  else {
    _x1 = fullSizePos;
    _y1 = fullSizePos;

    _x2 = minSizePos;
    _y2 = fullSizePos;

    _x3 = minSizePos;
    _y3 = minSizePos;
  }

  let pointsPerSide = int(SHAPE_POINT_COUNT / 3);

  let points = [];
  points.push(...getLinePoints(_x1, _y1, _x2, _y2, pointsPerSide));
  points.push(...getLinePoints(_x2, _y2, _x3, _y3, pointsPerSide));
  points.push(...getLinePoints(_x3, _y3, _x1, _y1, pointsPerSide));
  
  return points;
}

function ellipsePoints(_fillRatio = 1.0) {

  let points = [];
  for (let i = 0; i < SHAPE_POINT_COUNT; i++) {
    let t = i / (SHAPE_POINT_COUNT - 1);

    let x = sin(TWO_PI * t) * _fillRatio / 2;
    let y = -cos(TWO_PI * t) * _fillRatio / 2;

    points.push(new NYPoint(0.5 + x, 0.5 + y, t));
  }
  return points;
}

function halfCirclePoints(_direction, _fillRatio = 1.0, _pointCount = 30) {
  let spaceRatio = (1.0 - _fillRatio) / 2;

  let x1 = 0;
  let y1 = 0;

  let x2 = 0;
  let y2 = 0;

  let centerX = 0.5;
  let centerY = 0.5;
  let startAngle = 0;
  let endAngle = 180;

  if (_direction == 0) {
    x1 = 1.0 - spaceRatio;
    y1 = spaceRatio;

    x2 = 1.0 - spaceRatio;
    y2 = 1.0 - spaceRatio;

    centerX = 1.0 - spaceRatio;
    centerY = 0.5;
    startAngle = 180;
    endAngle = 360;
  }
  else if (_direction == 1) {
    x1 = spaceRatio;
    y1 = spaceRatio;

    x2 = 1.0 - spaceRatio;
    y2 = spaceRatio;

    centerX = 0.5;
    centerY = spaceRatio;
    startAngle = 90;
    endAngle = 270;
  }
  else if (_direction == 2) {
    x1 = spaceRatio;
    y1 = 1.0 - spaceRatio;

    x2 = spaceRatio;
    y2 = spaceRatio;

    centerX = spaceRatio;
    centerY = 0.5;
    startAngle = 0;
    endAngle = 180;
  }
  else {
    x1 = 1.0 - spaceRatio;
    y1 = 1.0 - spaceRatio;

    x2 = spaceRatio;
    y2 = 1.0 - spaceRatio;

    centerX = 0.5;
    centerY = 1.0 - spaceRatio;
    startAngle = 270;
    endAngle = 450;
  }

  let lineSidePointCount = 5;
  let arcPoints = SHAPE_POINT_COUNT - lineSidePointCount;

  let points = [];
  points.push(...getLinePoints(x1, y1, x2, y2, lineSidePointCount));
  points.push(...getArcPoints(centerX, centerY, _fillRatio / 2, startAngle, endAngle, arcPoints));

  return points;
}

function quadCirclePoints(_direction, _fillRatio = 1.0, _pointCount = 20) {
  let spaceRatio = (1.0 - _fillRatio) / 2;

  let straitSidePoints = 3;
  let arcSidePoints = SHAPE_POINT_COUNT - straitSidePoints * 2;

  let x1 = 0;
  let y1 = 0;

  let x2 = 0;
  let y2 = 0;

  let centerX = 0.5;
  let centerY = 0.5;
  let startAngle = 0;
  let endAngle = 90;

  if (_direction == 0) {
    x1 = 1.0 - spaceRatio;
    y1 = spaceRatio;

    centerX = 1.0 - spaceRatio;
    centerY = 1.0 - spaceRatio;

    x2 = spaceRatio;
    y2 = 1.0 - spaceRatio;

    startAngle = 270;
    endAngle = 360;
  }
  else if (_direction == 1) {
    x1 = spaceRatio;
    y1 = spaceRatio;

    centerX = 1.0 - spaceRatio;
    centerY = spaceRatio;

    x2 = 1.0 - spaceRatio;
    y2 = 1.0 - spaceRatio;

    startAngle = 180;
    endAngle = 270;
  }
  else if (_direction == 2) {
    x1 = spaceRatio;
    y1 = 1.0 - spaceRatio;

    centerX = spaceRatio;
    centerY = spaceRatio;

    x2 = 1.0 - spaceRatio;
    y2 = spaceRatio;

    startAngle = 90;
    endAngle = 180;
  }
  else {
    x1 = 1.0 - spaceRatio;
    y1 = 1.0 - spaceRatio;

    centerX = spaceRatio;
    centerY = 1.0 - spaceRatio;

    x2 = spaceRatio;
    y2 = spaceRatio;

    startAngle = 0;
    endAngle = 90;
  }

  let points = [];
  
  points.push(...getLinePoints(x1, y1, centerX, centerY, straitSidePoints));
  points.push(...getLinePoints(centerX, centerY, x2, y2, straitSidePoints));
  points.push(...getArcPoints(centerX, centerY, _fillRatio, startAngle, endAngle, arcSidePoints));
  return points;
}

function LShapePoints(_direction, _emptySpaceRatio = 0.5, _fillRatio = 1.0) {
  let spaceRatio = (1.0 - _fillRatio) / 2;

  let sidePoints = int(SHAPE_POINT_COUNT / 6);

  let fullPos = 1.0 - spaceRatio;
  let midPosA = 0.5 - _emptySpaceRatio / 2 - spaceRatio;
  let midPosB = 0.5 + _emptySpaceRatio / 2 + spaceRatio;
  let minPos = spaceRatio;

  let points = [];

  if (_direction == 0) {
    points.push(...getLinePoints(fullPos, minPos, fullPos, fullPos, sidePoints));
    points.push(...getLinePoints(fullPos, fullPos, minPos, fullPos, sidePoints));
    points.push(...getLinePoints(minPos, fullPos, minPos, midPosB, sidePoints));
    points.push(...getLinePoints(minPos, midPosB, midPosB, midPosB, sidePoints));
    points.push(...getLinePoints(midPosB, midPosB, midPosB, minPos, sidePoints));
    points.push(...getLinePoints(midPosB, minPos, fullPos, minPos, sidePoints));
  }
  else if (_direction == 1) {
    points.push(...getLinePoints(minPos, minPos, fullPos, minPos, sidePoints));
    points.push(...getLinePoints(fullPos, minPos, fullPos, fullPos, sidePoints));
    points.push(...getLinePoints(fullPos, fullPos, midPosB, fullPos, sidePoints));
    points.push(...getLinePoints(midPosB, fullPos, midPosB, midPosA, sidePoints));
    points.push(...getLinePoints(midPosB, midPosA, minPos, midPosA, sidePoints));
    points.push(...getLinePoints(minPos, midPosA, minPos, minPos, sidePoints));
  }
  else if (_direction == 2) {
    points.push(...getLinePoints(minPos, fullPos, minPos, minPos, sidePoints));
    points.push(...getLinePoints(minPos, minPos, fullPos, minPos, sidePoints));
    points.push(...getLinePoints(fullPos, minPos, fullPos, midPosA, sidePoints));
    points.push(...getLinePoints(fullPos, midPosA, midPosA, midPosA, sidePoints));
    points.push(...getLinePoints(midPosA, midPosA, midPosA, fullPos, sidePoints));
    points.push(...getLinePoints(midPosA, fullPos, minPos, fullPos, sidePoints));
  }
  else {
    points.push(...getLinePoints(fullPos, fullPos, minPos, fullPos, sidePoints));
    points.push(...getLinePoints(minPos, fullPos, minPos, minPos, sidePoints));
    points.push(...getLinePoints(minPos, minPos, midPosA, minPos, sidePoints));
    points.push(...getLinePoints(midPosA, minPos, midPosA, midPosB, sidePoints));
    points.push(...getLinePoints(midPosA, midPosB, fullPos, midPosB, sidePoints));
    points.push(...getLinePoints(fullPos, midPosB, fullPos, fullPos, sidePoints));
  }

  return points;
}

function crystalPoints(_direction, _thickness = 0.2, _fillRatio = 1.0) {
  let points = [];
  
  let sidePointCount = int(SHAPE_POINT_COUNT / 6);
  let spaceRatio = (1.0 - _fillRatio) / 2;

  let minPos = spaceRatio;
  let midAPos = spaceRatio + _thickness;
  let midBPos = 1.0 - spaceRatio - _thickness;
  let fullPos = 1.0 - spaceRatio;

  if(_direction)
  {
    points.push(...getLinePoints(fullPos, minPos,fullPos, midAPos, sidePointCount));
    points.push(...getLinePoints(fullPos, midAPos, midAPos, fullPos, sidePointCount));
    points.push(...getLinePoints(midAPos, fullPos, minPos, fullPos, sidePointCount));
    points.push(...getLinePoints(minPos, fullPos, minPos, midBPos, sidePointCount));
    points.push(...getLinePoints(minPos, midBPos, midBPos, minPos, sidePointCount));
    points.push(...getLinePoints(midBPos, minPos, fullPos, minPos, sidePointCount));
  }
  else
  {
    points.push(...getLinePoints(minPos, minPos, midAPos, minPos, sidePointCount));
    points.push(...getLinePoints(midAPos, minPos, fullPos, midBPos, sidePointCount));
    points.push(...getLinePoints(fullPos, midBPos, fullPos, fullPos, sidePointCount));
    points.push(...getLinePoints(fullPos, fullPos, midBPos, fullPos, sidePointCount));
    points.push(...getLinePoints(midBPos, fullPos, minPos, midAPos, sidePointCount));
    points.push(...getLinePoints(minPos, midAPos, minPos, minPos, sidePointCount));
  }

  return points;
}

function nullShapePoints () {
  let points = [];
  points.push[
    new NYPoint(0.5, 0.5, 0),
    new NYPoint(0.5, 0.5, 0.25),
    new NYPoint(0.5, 0.5, 0.5),
    new NYPoint(0.5, 0.5, 0.75),
    new NYPoint(0.5, 0.5, 1)
  ];

  return points;
}