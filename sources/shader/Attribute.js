/**
 * @class
 * @classdesc Represent a shader attribute.
 * @param {VVGL.ShaderProgram} shader
 * @param {string} name
 */
VVGL.Attribute = function (shader, name) {
	this.shader = shader;
	this.name = name;
	this.location = gl.getAttribLocation(shader.program, name);
	if (this.location === -1) {
		throw new VVGL.GLRessourceException(this.shader, "Cannot reach location of attribute " + name);
	}
};

/**
 * Enable attribute.
 */
VVGL.Attribute.prototype.enable = function () {
	gl.enableVertexAttribArray(this.location);
};

/**
 * Disable attribute.
 */
VVGL.Attribute.prototype.disable = function () {
	gl.disableVertexAttribArray(this.location);
};
