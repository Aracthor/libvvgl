/**
 * @class
 * @classdesc Light from a specific spot.
 * @extends VVGL.Light
 * @param {string} name Uniform name in shader.
 */
VVGL.SpotLight = function (name) {
	VVGL.Light.call(this, name);
	this.position = new VVGL.Vec3();
};

VVGL.SpotLight.prototype = Object.create(VVGL.Light.prototype);

/**
 * @type {VVGL.Vec3}
 */
VVGL.SpotLight.prototype.position = null;

/**
 * @type {VVGL.Vec4}
 * @default
 */
VVGL.SpotLight.prototype.power = 1.0;

/**
 * Send data to shader.
 * 
 * @override
 * @param {VVGL.ShaderProgram} shader
 */
VVGL.SpotLight.prototype.sendToShader = function (shader) {
	shader.setFloatUniform(this.name + ".power", this.power);
	shader.setColorUniform(this.name + ".color", this.color);
	shader.setVector3Uniform(this.name + ".position", this.position);
};

/**
 * Update light position from model matrix.
 * 
 * @todo update position
 * @param {number} elapsedTime Elapsed miliseconds from last frame.
 */
VVGL.SpotLight.prototype.update = function (elapsedTime) {
};
