// INITIALIZING CANVAS AREA AND REDRAWING IT

const WIDTH = window.innerWidth - 20;
const HEIGHT = window.innerHeight - 200;
const NUM_OF_GENERATED_POINTS = 100;

let isHullAutoDraw = false;
let isCircleFollowing = false;
let isMARAutoDraw = false;
let isFirstLoad = true;

const randomX = d3.random.normal(WIDTH / 2, 60);
const randomY = d3.random.normal(HEIGHT / 2, 60);
let vertices = d3.range(NUM_OF_GENERATED_POINTS).map(function () { return [randomX(), randomY()]; });

const svg = d3.select("body").append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)
  .style("border", "1px solid black")
  .on("mousemove", function () {
    if (isCircleFollowing) {
      vertices[0] = d3.mouse(this);
      redraw();
    }
  })
  .on("click", function () { vertices.push(d3.mouse(this)); redraw(); });

svg.append("rect")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

const hull = svg.append("path")
  .attr("class", "hull");

const mar = svg.append('path')
  .attr('class', 'mar');

let dots = svg.selectAll("circle");

const main = svg.append('g')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .attr('class', 'main')

const xAxis = d3.svg.axis()
  .orient('bottom');

main.append('g')
  .attr('transform', 'translate(0,' + HEIGHT + ')')
  .attr('class', 'main axis date')
  .call(xAxis);

// draw the y axis
const yAxis = d3.svg.axis()
  .orient('left');

main.append('g')
  .attr('transform', 'translate(0,0)')
  .attr('class', 'main axis date')
  .call(yAxis);

const redraw = () => {
  if (isHullAutoDraw) {
    hull
      .datum(d3.geom.hull(vertices))
      .attr("d", function (d) { return "M" + d.join("L") + "Z"; });
  }

  const convexHull = CalcConvexHull(vertices.map(el => new Vector(el[0], el[1])));
  const oobb = CalcOmbb(convexHull).map(el => [el.x, el.y]);

  if (isMARAutoDraw) {
    mar
      .datum(oobb)
      .attr("d", function (d) { return "M" + d.join("L") + "Z"; });
  }

  dots = dots.data(vertices);
  dots
    .enter()
    .append("circle")
    .attr("r", 4)
    .style('fill', function (d, i) {
      if (i === dots[0].length - 1 && !isFirstLoad) {
        return 'red';
      }
    });

  dots.attr("transform", function (d) { return "translate(" + d + ")"; });

  if (isFirstLoad) {
    isFirstLoad = false;
  }
}

redraw();
