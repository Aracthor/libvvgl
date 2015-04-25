/**
 * Model matrix supervisor.
 * 
 * @class
 * @extends VVGL.MatrixSupervisor
 */
VVGL.ModelMatrix = function () {
	VVGL.MatrixSupervisor.call(this);
};

VVGL.ModelMatrix.prototype = Object.create(VVGL.MatrixSupervisor.prototype);

/**
 * Model position.
 * 
 * @type {VVGL.Vec3}
 * @default
 */
VVGL.ModelMatrix.prototype.position = new VVGL.Vec3(0.0, 0.0, 0.0);

/**
 * Model rotation angles.
 * 
 * @type {VVGL.Vec3}
 * @default
 */
VVGL.ModelMatrix.prototype.rotation = new VVGL.Vec3(0.0, 0.0, 0.0);

/**
 * Model scale factors.
 * 
 * @type {VVGL.Vec3}
 * @default
 */
VVGL.ModelMatrix.prototype.scale = new VVGL.Vec3(1.0, 1.0, 1.0);

/**
 * Calc model matrix from vectors.
 * 
 * @override
 */
VVGL.ModelMatrix.prototype.calcMatrix = function () {
	this.matrix.identity();
	// TODO real calc.
};
