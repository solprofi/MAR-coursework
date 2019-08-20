// SETS UP EVENT LISTENERS FOR UI INTERACTIONS

const autoCheck = document.getElementById('auto-hull');
const autoMAR = document.getElementById('auto-mar');
const drawHullButton = document.getElementById('draw-hull');
const drawMARButton = document.getElementById('draw-mar');
const followMouseButton = document.getElementById('follow-mouse');
const submitButton = document.getElementById('submit-button');
const closePopUp = document.getElementById('close-pop-up');
const inputX = document.getElementById('input-x');
const inputY = document.getElementById('input-y');

autoCheck.addEventListener('click', () => {
  isHullAutoDraw = autoCheck.checked;
});

autoMAR.addEventListener('click', () => {
  isMARAutoDraw = autoMAR.checked;
});

drawHullButton.addEventListener('click', () => {
  hull
    .datum(d3.geom.hull(vertices))
    .attr("d", function (d) { return "M" + d.join("L") + "Z"; });
});

drawMARButton.addEventListener('click', () => {
  const convexHull = CalcConvexHull(vertices.map(el => new Vector(el[0], el[1])));
  const oobb = CalcOmbb(convexHull).map(el => [el.x, el.y]);

  mar
    .datum(oobb)
    .attr("d", function (d) { return "M" + d.join("L") + "Z"; });
});


followMouseButton.addEventListener('click', () => {
  isCircleFollowing = !isCircleFollowing;
});

window.addEventListener('keypress', (e) => {
  if (e.key === 'f' || e.key === 'F') {
    isCircleFollowing = !isCircleFollowing;
  }
});

submitButton.addEventListener('click', e => {
  e.preventDefault();

  if (inputX.value && inputY.value) {
    let x = parseFloat(inputX.value);
    let y = parseFloat(inputY.value);

    if (!isNaN(x) && !isNaN(y) && x < WIDTH && y < HEIGHT) {
      vertices.push([x, Math.abs(HEIGHT - y)]);
      redraw();
    }

    inputX.value = '';
    inputY.value = '';
    document.activeElement.blur();
  }
});

closePopUp.addEventListener('click', () => {
  document.querySelector('.pop-up').setAttribute('style', 'display: none');
});