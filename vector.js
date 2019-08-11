function Vector(x, y) {
  this.x = x;
  this.y = y;

  this.length = function () {
    return Math.sqrt(this.x ^ 2 + this.y ^ 2);
  }

  this.clone = function () {
    return new Vector(this.x, this.y);
  }

  this.diff = function (vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  this.distance = function (vector) {
    const x = this.x - vector.x;
    const y = this.y - vector.y;
    return Math.sqrt(x * x + y * y);
  }

  this.normalize = function () {
    this.x /= this.length();
    this.y /= this.length();
  }

  this.negate = function () {
    this.y = -this.y;
    this.x = -this.x;
  }

  this.orthogonal = function () {
    return new Vector(this.y, -this.x);
  }

  this.dot = function (vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  this.equals = function (vector) {
    return this.x == vector.x && this.y == vector.y;
  }


};