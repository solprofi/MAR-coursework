// RETURN AN ARRAY WITH CONVEX HULL POINTS

"use strict";

const ON_THE_LINE = 0;
const LEFT_OF_THE_LINE = 1;
const RIGHT_OF_THE_LINE = 2;
const EPSILON = 0.00001;

// Returns on what side of the line the point is on
const getSideOfLine = (lineStart, lineEnd, point) => {
  const d = (lineEnd.x - lineStart.x) * (point.y - lineStart.y) - (lineEnd.y - lineStart.y) * (point.x - lineStart.x);
  return (d > EPSILON ? LEFT_OF_THE_LINE : (d < -EPSILON ? RIGHT_OF_THE_LINE : ON_THE_LINE));
}

// Returns convex hull in CW order
const CalcConvexHull = points => {
  // Check for bad input
  if (points.length < 3)
    return points;

  // Find first hull point
  let hullPt = points[0];
  let convexHull = [];

  for (let i = 1; i < points.length; i++) {
    // Make a lexicographical comparison
    if (points[i].x < hullPt.x) {
      hullPt = points[i];
    } else if (Math.abs(points[i].x - hullPt.x) < EPSILON) {
      if (points[i].y < hullPt.y) {
        hullPt = points[i];
      }
    }
  }

  let endPt = points[0];
  // Find all other hull points
  do {
    convexHull.unshift(hullPt.clone());
    endPt = points[0];

    for (let j = 1; j < points.length; j++) {
      let side = getSideOfLine(hullPt, endPt, points[j]);

      // When the point is on the line choose a point that's further away (for collinear fix)
      if (endPt.equals(hullPt) || (side == LEFT_OF_THE_LINE || (side == ON_THE_LINE && hullPt.distance(points[j]) > hullPt.distance(endPt))))
        endPt = points[j];
    }

    hullPt = endPt;
  }
  while (!endPt.equals(convexHull[convexHull.length - 1]));

  return convexHull;
}
