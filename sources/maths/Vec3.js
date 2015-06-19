/**
 * A 3-dimensional vector.
 * 
 * @class A 3-dimensional vector.
 * @constructor
 * @param {number} [0] x X-axis value.
 * @param {number} [0] y Y-axis value.
 * @param {number} [0] z Z-axis value.
 */
VVGL.Vec3 = function (x, y, z) {
	if (x !== undefined) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
};

/**
 * X-axis value.
 * 
 * @type {number}
 */
VVGL.Vec3.prototype.x = 0.0;

/**
 * Y-axis value.
 * 
 * @type {number}
 */
VVGL.Vec3.prototype.y = 0.0;

/**
 * Z-axis value.
 * 
 * @type {number}
 */
VVGL.Vec3.prototype.z = 0.0;


/**
 * Add another vector to this one.
 * 
 * @param {VVGL.Vec3} vector
 */
VVGL.Vec3.prototype.add = function (vector) {
	this.x += vector.x;
	this.y += vector.y;
	this.z += vector.z;
};

/**
 * subtract another vector to this one.
 * 
 * @param {VVGL.Vec3} vector
 */
VVGL.Vec3.prototype.sub = function (vector) {
	this.x -= vector.x;
	this.y -= vector.y;
	this.z -= vector.z;
};

/**
 * Scale vector by a number.
 * 
 * @param {number} n
 */
VVGL.Vec3.prototype.scale = function (n) {
	this.x *= n;
	this.y *= n;
	this.z *= n;
};

/**
 * Copy vector data to another.
 * 
 * @param {VVGL.Vec3} vector
 */
VVGL.Vec3.prototype.copyTo = function (vector) {
	vector.x = this.x;
	vector.y = this.y;
	vector.z = this.z;
};

/**
 * Calc and return vector's norm.
 * 
 * @return {number} Vector's norm.
 */
VVGL.Vec3.prototype.getNorm = function () {
	return (Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z));
};

/**
 * Normalize vector, making its norm to 1.
 */
VVGL.Vec3.prototype.normalize = function () {
	var norm = this.getNorm();
	this.scale(1 / norm);
};

/**
 * Store cross product between this and parameter.
 * 
 * @param {VVGL.Vec3} vector
 */
VVGL.Vec3.prototype.crossProduct = function (vector) {
	var x, y, z;
	
	x = this.y * vector.z - this.z * vector.y;
	y = this.z * vector.x - this.x * vector.z;
	z = this.x * vector.y - this.y * vector.x;
	
	this.x = x;
	this.y = y;
	this.z = z;
};

/**
 * Create copy of this vector.
 * 
 * @return {VVGL.Vec3} Copy.
 */
VVGL.Vec3.prototype.clone = function () {
	return (new VVGL.Vec3(this.x, this.y, this.z));
};

/**
 * Convert vector to a data array.
 * 
 * @return {Array} A float array containing the three vector's values.
 */
VVGL.Vec3.prototype.toArray = function () {
	return ([this.x, this.y, this.z]);
};

/**
 * Adds two Vectors
 *
 * @static
 * @param {VVGL.Vec3} u
 * @param {VVGL.Vec3} v
 * @return {VVGL.Vec3} addition between them
 */
VVGL.Vec3.add = function (u, v) {
    return (
        new VVGL.Vec3(
            u.x + v.x,
            u.y + v.y,
            u.z + v.z));
};

/**
 * Subtracts two Vectors
 *
 * @static
 * @param {VVGL.Vec3} u
 * @param {VVGL.Vec3} v
 * @return {VVGL.Vec3} subtraction between them
 */
VVGL.Vec3.sub = function (u, v) {
    return (
        new VVGL.Vec3(
            u.x - v.x,
            u.y - v.y,
            u.z - v.z));
};

/**
 * Get center of two vectors
 *
 * @static
 * @param {VVGL.Vec3} u
 * @param {VVGL.Vec3} v
 * @return {VVGL.Vec3} center between them
 */
VVGL.Vec3.center = function (u, v) {
    return (
        new VVGL.Vec3(
            (u.x + v.x) / 2,
            (u.y + v.y) / 2,
            (u.z + v.z) / 2));
}

/**
 * Return a new vector storing cross product between parameters.
 * 
 * @static
 * @param {VVGL.Vec3} u
 * @param {VVGL.Vec3} v
 * @return {VVGL.Vec3} Cross product.
 */
VVGL.Vec3.crossProduct = function (u, v) {
	return (new VVGL.Vec3(u.y * v.z - u.z * v.y,
						  u.z * v.x - u.x * v.z,
						  u.x * v.y - u.y * v.x));
};
