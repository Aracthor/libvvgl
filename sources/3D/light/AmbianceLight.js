/**
 * @class
 * @classdesc Minimum light level for all vertices.
 * @extends VVGL.Light
 * @param {string} name Uniform name in shader.
 */
VVGL.AmbianceLight = function (name) {
	VVGL.Light.call(this, name);
};

VVGL.AmbianceLight.prototype = Object.create(VVGL.Light.prototype);

/**
 * Send data to shader.
 * 
 * @override
 * @param {VVGL.ShaderProgram} shader
 */
VVGL.AmbianceLight.prototype.sendToShader = function (shader) {
	shader.setColorUniform(this.name + ".color", this.color);
};

/**
 * Do nothing for ambiance light.
 * 
 * @param {number} elapsedTime Elapsed miliseconds from last frame.
 */
VVGL.AmbianceLight.prototype.update = function (elapsedTime) {};
