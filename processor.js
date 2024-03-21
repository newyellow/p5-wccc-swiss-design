function lerpPoint (p1, p2, t) {
    let insideT = inverseLerp(p1.t, p2.t, t);
    
    let x = lerp(p1.x, p2.x, insideT);
    let y = lerp(p1.y, p2.y, insideT);

    return new NYPoint(x, y, t);
}

function resamplePoints (_originPoints, _newPointsCount) {
    let lastReferenceIndex = 0;
    let lastReferencePoint = _originPoints[0];

    let nextReferenceIndex = 1;
    let nextReferencePoint = _originPoints[1];

    let newPoints = [];
    for (let i = 0; i < _newPointsCount; i++) {
        let nowT = i / (_newPointsCount - 1);

        while (nowT > nextReferencePoint.t) {
            lastReferenceIndex = nextReferenceIndex;
            lastReferencePoint = _originPoints[lastReferenceIndex];

            nextReferenceIndex = nextReferenceIndex + 1;
            nextReferencePoint = _originPoints[nextReferenceIndex];
        }

        let sampledPoint = lerpPoint(lastReferencePoint, nextReferencePoint, nowT);
        newPoints.push(sampledPoint);
    }

    return newPoints;
}