const intersectLines = (start0, dir0, start1, dir1) => {
  const dd = dir0.x * dir1.y - dir0.y * dir1.x;
  const dx = start1.x - start0.x;
  const dy = start1.y - start0.y;
  const t = (dx * dir1.y - dy * dir1.x) / dd;
  return new Vector(start0.x + t * dir0.x, start0.y + t * dir0.y);
}

// Calculate the minimum area enclosing rectangle (oriented minimum bounding box)
function CalcOmbb(convexHull) {

  this.UpdateOmbb = function (leftStart, leftDir, rightStart, rightDir, topStart, topDir, bottomStart, bottomDir) {
    const boxUpperLeft = intersectLines(leftStart, leftDir, topStart, topDir);
    const boxUpperRight = intersectLines(rightStart, rightDir, topStart, topDir);
    const boxBottomLeft = intersectLines(bottomStart, bottomDir, leftStart, leftDir);
    const boxBottomRight = intersectLines(bottomStart, bottomDir, rightStart, rightDir);

    const distLeftRight = boxUpperLeft.distance(boxUpperRight);
    const distTopBottom = boxUpperLeft.distance(boxBottomLeft);
    const obbArea = distLeftRight * distTopBottom;

    if (obbArea < this.BestObbArea) {
      BestObb = [boxUpperLeft, boxBottomLeft, boxBottomRight, boxUpperRight];
      this.BestObbArea = obbArea;
    }
  }

  this.BestObbArea = Number.MAX_VALUE;
  this.BestObb = [];

  // Calculate directions of convex hull edges
  let edgeDirs = [];

  for (let i = 0; i < convexHull.length; i++) {
    edgeDirs.push(convexHull[(i + 1) % convexHull.length].diff(convexHull[i]));
    edgeDirs[i].normalize();
  }

  // Calculate extreme points
  let minPt = new Vector(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  let maxPt = new Vector(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
  let leftIndex, rightIndex, topIndex, bottomIndex;

  for (let i = 0; i < convexHull.length; i++) {
    let pt = convexHull[i];

    if (pt.x < minPt.x) {
      minPt.x = pt.x;
      leftIndex = i;
    }

    if (pt.x > maxPt.x) {
      maxPt.x = pt.x;
      rightIndex = i;
    }

    if (pt.y < minPt.y) {
      minPt.y = pt.y;
      bottomIndex = i;
    }

    if (pt.y > maxPt.y) {
      maxPt.y = pt.y;
      topIndex = i;
    }
  }

  // initial caliper lines + directions
  //
  //        top
  //      <-------
  //      |      A
  //      |      | right
  // left |      |
  //      V      |
  //      ------->
  //       bottom
  let leftDir = new Vector(0.0, -1);
  let rightDir = new Vector(0, 1);
  let topDir = new Vector(-1, 0);
  let bottomDir = new Vector(1, 0);

  // Rotating calipers algorithm
  for (let i = 0; i < convexHull.length; i++) {
    const phis = [
      Math.acos(leftDir.dot(edgeDirs[leftIndex])),
      Math.acos(rightDir.dot(edgeDirs[rightIndex])),
      Math.acos(topDir.dot(edgeDirs[topIndex])),
      Math.acos(bottomDir.dot(edgeDirs[bottomIndex])),
    ];

    let lineWithSmallestAngle = phis.indexOf(Math.min.apply(Math, phis));
    switch (lineWithSmallestAngle) {
      case 0: // left
        leftDir = edgeDirs[leftIndex].clone();
        rightDir = leftDir.clone();
        rightDir.negate();
        topDir = leftDir.orthogonal();
        bottomDir = topDir.clone();
        bottomDir.negate();
        leftIndex = (leftIndex + 1) % convexHull.length;
        break;
      case 1: // right
        rightDir = edgeDirs[rightIndex].clone();
        leftDir = rightDir.clone();
        leftDir.negate();
        topDir = leftDir.orthogonal();
        bottomDir = topDir.clone();
        bottomDir.negate();
        rightIndex = (rightIndex + 1) % convexHull.length;
        break;
      case 2: // top
        topDir = edgeDirs[topIndex].clone();
        bottomDir = topDir.clone();
        bottomDir.negate();
        leftDir = bottomDir.orthogonal();
        rightDir = leftDir.clone();
        rightDir.negate();
        topIndex = (topIndex + 1) % convexHull.length;
        break;
      case 3: // bottom
        bottomDir = edgeDirs[bottomIndex].clone();
        topDir = bottomDir.clone();
        topDir.negate();
        leftDir = bottomDir.orthogonal();
        rightDir = leftDir.clone();
        rightDir.negate();
        bottomIndex = (bottomIndex + 1) % convexHull.length;
        break;
    }

    this.UpdateOmbb(convexHull[leftIndex],
      leftDir,
      convexHull[rightIndex],
      rightDir,
      convexHull[topIndex],
      topDir,
      convexHull[bottomIndex],
      bottomDir);
  }

  return BestObb;
}
