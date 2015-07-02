/**
 * Create a vector null or from numbers.
 *
 * @class
 * @classdesc A 4-dimensional vector.
 * @param {number} [x=0] X-axis value.
 * @param {number} [y=0] Y-axis value.
 */
VVGL.Vec2 = function (x, y) {
    if (x !== undefined) {
        this.x = x;
        this.y = y;
    }

};

/**
 * X-axis value.
 *
 * @type {number}
 */
VVGL.Vec2.prototype.x = 0.0;

/**
 * Y-axis value.
 *
 * @type {number}
 */
VVGL.Vec2.prototype.y = 0.0;


/**
 * Set new vector values.
 *
 * @param {number} x
 * @param {number} y
 */
VVGL.Vec2.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Add another vector to this one.
 *
 * @param {VVGL.Vec2} vector
 */
VVGL.Vec2.prototype.add = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
};

/**
 * Substract another vector to this one.
 *
 * @param {VVGL.Vec2} vector
 */
VVGL.Vec2.prototype.sub = function (vector) {
    this.x -= vector.x;
    this.y -= vector.y;
};

/**
 * Scale vector by a number.
 *
 * @param {number} n
 */
VVGL.Vec2.prototype.scale = function (n) {
    this.x *= n;
    this.y *= n;
};

/**
 * Copy vector data to another.
 *
 * @param {VVGL.Vec2} vector
 */
VVGL.Vec2.prototype.copyTo = function (vector) {
    vector.x = this.x;
    vector.y = this.y;
};

/**
 * Calc and return vector's norm.
 *
 * @return {number} Vector's norm.
 */
VVGL.Vec2.prototype.getNorm = function () {
    return (Math.sqrt(this.x * this.x + this.y * this.y));
};

/**
 * Normalize vector, making its norm to 1.
 */
VVGL.Vec2.prototype.normalize = function () {
    var norm = this.getNorm();
    this.scale(1 / norm);
};

/**
 * Create copy of this vector.
 *
 * @return {VVGL.Vec2} Copy.
 */
VVGL.Vec2.prototype.clone = function () {
    return (new VVGL.Vec2(this.x, this.y));
};

/**
 * Convert vector to a data array.
 *
 * @return {Array} A float array containing the three vector's values.
 */
VVGL.Vec2.prototype.toArray = function () {
    return ([this.x, this.y]);
};

