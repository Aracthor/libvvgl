/**
 * @class
 * @classdesc Transformable element (base for {@link VVGL.SceneNode})
 */
VVGL.Transformable = function () {
	this.position = VVGL.Transformable.prototype.position.clone();
	this.rotation = VVGL.Transformable.prototype.rotation.clone();
	this.scaleVector = VVGL.Transformable.prototype.scaleVector.clone();
	this.matrix = new VVGL.Mat4();
	this.upToDate = true;
};

/**
 * Element position
 * 
 * @type {VVGL.Vec3}
 * @default
 */
VVGL.Transformable.prototype.position = new VVGL.Vec3(0, 0, 0);

/**
 * Element rotation angles in radians.
 * 
 * @type {VVGL.Vec3}
 * @default
 */
VVGL.Transformable.prototype.rotation = new VVGL.Vec3(0, 0, 0);

/**
 * Element scale ratios.
 * 
 * @type {VVGL.Vec3}
 * @default
 */
VVGL.Transformable.prototype.scaleVector = new VVGL.Vec3(1, 1, 1);

/**
 * Translate element.
 * 
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
VVGL.Transformable.prototype.translate = function (x, y, z) {
	this.upToDate = false;
	this.position.x += x;
	this.position.y += y;
	this.position.z += z;
};

/**
 * Translate element by vector.
 * 
 * @param {VVGL.Vec3} vector
 */
VVGL.Transformable.prototype.translateByVector = function (vector) {
	this.upToDate = false;
	this.position.add(vector);
};

/**
 * Rotate element on X axis.
 * 
 * @param {number} angle Angle in radians.
 */
VVGL.Transformable.prototype.rotateX = function (angle) {
	this.upToDate = false;
	this.rotation.x += angle;
};

/**
 * Rotate element on Y axis.
 * 
 * @param {number} angle Angle in radians.
 */
VVGL.Transformable.prototype.rotateY = function (angle) {
	this.upToDate = false;
	this.rotation.y += angle;
};

/**
 * Rotate element on Z axis.
 * 
 * @param {number} angle Angle in radians.
 */
VVGL.Transformable.prototype.rotateZ = function (angle) {
	this.upToDate = false;
	this.rotation.z += angle;
};

/**
 * Scale element size by number.
 * 
 * @param {number} n
 */
VVGL.Transformable.prototype.scaleByNumber = function (n) {
	this.upToDate = false;
	this.scaleVector.scale(n);
};

/**
 * Scale element size by vector.
 * 
 * @param {VVGL.Vec3} vector
 */
VVGL.Transformable.prototype.scaleByVector = function (vector) {
	this.upToDate = false;
	this.scaleVector.x *= vector.x;
	this.scaleVector.y *= vector.y;
	this.scaleVector.z *= vector.z;
};

/**
 * Calc model matrix from vectors.
 * 
 * @private
 */
VVGL.Transformable.prototype.calcMatrix = function () {
	this.matrix.identity();
	
	this.matrix.translate(this.position);
	this.matrix.scale(this.scaleVector);
	this.matrix.rotateX(this.rotation.x);
	this.matrix.rotateY(this.rotation.y);
	this.matrix.rotateZ(this.rotation.z);
};

/**
 * Calc if updated and return model matrix from vectors values.
 * 
 * @return {VVGL.Mat4} Model matrix.
 */
VVGL.Transformable.prototype.getMatrix = function () {
	if (!this.upToDate) {
		this.calcMatrix();
		this.upToDate = true;
	}
	
	return (this.matrix);
};
