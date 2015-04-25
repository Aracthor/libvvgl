/**
 * Perspective matrix supervisor.
 * 
 * @class
 * @extends VVGL.MatrixSupervisor
 */
VVGL.PerspectiveMatrix = function () {
	VVGL.MatrixSupervisor.call(this);
};

VVGL.PerspectiveMatrix.prototype = Object.create(VVGL.MatrixSupervisor.prototype);

/**
 * Vertical field of view in radians.
 * 
 * @type {number}
 * @default
 */
VVGL.PerspectiveMatrix.prototype.angle = VVGL.Maths.PI * 5 / 3;

/**
 * Aspect ratio. typically viewport width/height.
 * 
 * @type {number}
 * @default
 */
VVGL.PerspectiveMatrix.prototype.aspectRatio = 1.0;

/**
 * Minimum view range.
 * 
 * @type {number}
 * @default
 */
VVGL.PerspectiveMatrix.prototype.min = 0.1;

/**
 * Maximum view range.
 * 
 * @type {number}
 * @default
 */
VVGL.PerspectiveMatrix.prototype.max = 100.0;

/**
 * Calc perspective matrix from parameters.
 * 
 * @override
 */
VVGL.PerspectiveMatrix.prototype.calcMatrix = function () {
	this.matrix.perspective(this.angle, this.aspectRatio, this.min, this.max);
};
