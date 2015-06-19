/**
 * Create a vector null or from numbers.
 * 
 * @class
 * @classdesc A 4-dimensional vector.
 * @param {number} [0] x X-axis value.
 * @param {number} [0] y Y-axis value.
 * @param {number} [0] z Z-axis value.
 * @param {number} [0] w W-axis value.
 */
VVGL.Vec4 = function (x, y, z, w) {
	if (x !== undefined) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
};

/**
 * X-axis value.
 * 
 * @type {number}
 */
VVGL.Vec4.prototype.x = 0.0;

/**
 * Y-axis value.
 * 
 * @type {number}
 */
VVGL.Vec4.prototype.y = 0.0;

/**
 * Z-axis value.
 * 
 * @type {number}
 */
VVGL.Vec4.prototype.z = 0.0;

/**
 * W-axis value.
 * 
 * @type {number}
 */
VVGL.Vec4.prototype.w = 0.0;


/**
 * Add another vector to this one.
 * 
 * @param {VVGL.Vec4} vector
 */
VVGL.Vec4.prototype.add = function (vector) {
	this.x += vector.x;
	this.y += vector.y;
	this.z += vector.z;
	this.w += vector.w;
};

/**
 * Substract another vector to this one.
 * 
 * @param {VVGL.Vec4} vector
 */
VVGL.Vec4.prototype.sub = function (vector) {
	this.x -= vector.x;
	this.y -= vector.y;
	this.z -= vector.z;
	this.w -= vector.w;
};

/**
 * Scale vector by a number.
 * 
 * @param {number} n
 */
VVGL.Vec4.prototype.scale = function (n) {
	this.x *= n;
	this.y *= n;
	this.z *= n;
	this.w *= w;
};

/**
 * Copy vector data to another.
 * 
 * @param {VVGL.Vec4} vector
 */
VVGL.Vec4.prototype.copyTo = function (vector) {
	vector.x = this.x;
	vector.y = this.y;
	vector.z = this.z;
	vector.w = this.w;
};

/**
 * Calc and return vector's norm.
 * 
 * @return {number} Vector's norm.
 */
VVGL.Vec4.prototype.getNorm = function () {
	return (Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w));
};

/**
 * Normalize vector, making its norm to 1.
 */
VVGL.Vec4.prototype.normalize = function () {
	var norm = this.getNorm();
	this.scale(1 / norm);
};

/**
 * Create copy of this vector.
 * 
 * @return {VVGL.Vec4} Copy.
 */
VVGL.Vec4.prototype.clone = function () {
	return (new VVGL.Vec4(this.x, this.y, this.z, this.w));
};

/**
 * Convert vector to a data array.
 * 
 * @return {Array} A float array containing the three vector's values.
 */
VVGL.Vec4.prototype.toArray = function () {
	return ([this.x, this.y, this.z, this.w]);
};

