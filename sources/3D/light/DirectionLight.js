/**
 * @class
 * @classdesc Light from a specific Direction.
 * @extends VVGL.Light
 * @param {string} name Uniform name in shader.
 */
VVGL.DirectionLight = function (name) {
	VVGL.Light.call(this, name);
	this.direction = new VVGL.Vec3();
};

VVGL.DirectionLight.prototype = Object.create(VVGL.Light.prototype);

/**
 * @type {VVGL.Vec3}
 */
VVGL.DirectionLight.prototype.direction = null;

/**
 * Send data to shader.
 * 
 * @override
 * @param {VVGL.ShaderProgram} shader
 */
VVGL.DirectionLight.prototype.sendToShader = function (shader) {
	shader.setColorUniform(this.name + ".color", this.color);
	shader.setVector3Uniform(this.name + ".direction", this.direction);
};

/**
 * Do nothing for direction light.
 * 
 * @todo maybe update direction ?
 * @param {number} elapsedTime Elapsed miliseconds from last frame.
 */
VVGL.DirectionLight.prototype.update = function (elapsedTime) {};
