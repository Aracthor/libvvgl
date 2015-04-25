/**
 * View matrix supervisor.
 * 
 * @class
 * @extends VVGL.MatrixSupervisor
 */
VVGL.ViewMatrix = function () {
	VVGL.MatrixSupervisor.call(this);
};

VVGL.ViewMatrix.prototype = Object.create(VVGL.MatrixSupervisor.prototype);

/**
 * Camera's position.
 * 
 * @type {VVGL.Vec3}
 * @default
 */
VVGL.ViewMatrix.prototype.position = new VVGL.Vec3(-10.0, 0.0, 0.0);

/**
 * Camera's target.
 * 
 * @type {VVGL.Vec3}
 * @default
 */
VVGL.ViewMatrix.prototype.target = new VVGL.Vec3(0.0, 0.0, 0.0);

/**
 * Camera's up vector.
 * Define scene vertical axis.
 * 
 * @type {VVGL.Vec3}
 * @default
 */
VVGL.ViewMatrix.prototype.up = new VVGL.Vec3(0.0, 0.0, 1.0);

/**
 * Calc view matrix from vectors.
 * 
 * @override
 */
VVGL.ViewMatrix.prototype.calcMatrix = function () {
	this.matrix.identity();
	this.matrix.lookAt(this.position, this.target, this.up);
};
