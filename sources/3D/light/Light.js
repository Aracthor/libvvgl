/**
 * @class
 * @extends VVGL.SceneData
 * @classdesc Abstract base class for all lights.
 * @param {string} name Uniform name in shader.
 */
VVGL.Light = function (name) {
	VVGL.SceneData.call(this, "light");
	this.name = name;
	this.color = VVGL.Color.white.clone();
};

VVGL.Light.prototype = Object.create(VVGL.SceneData.prototype);

/**
 * @type {VVGL.Color}
 * @default
 */
VVGL.Light.prototype.color = VVGL.Color.white;

/**
 * Send light data to shader.
 * 
 * @abstract
 * @param {VVGL.ShaderProgram} shader
 */
VVGL.Light.prototype.sendToShader = function (shader) {
	throw VVGL.ImplementationException(this, "sendToShader", "Light");
};
