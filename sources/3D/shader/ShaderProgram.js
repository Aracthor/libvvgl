/**
 * Shader program containing both vertex and fragment shader.
 * Do not try to create instances from the constructor. Call static functions to create it.
 *
 * @class
 * @private
 * @param {VVGL.Shader} vertexShader Compiled vertex part of shader program.
 * @param {VVGL.Shader} fragmentShader Compiled fragment part of shader program.
 */
VVGL.ShaderProgram = function (vertexShader, fragmentShader) {
	this.attributes = [];
	this.uniforms = [];
	
	this.program = gl.createProgram();
	gl.attachShader(this.program, vertexShader.shader);
	gl.attachShader(this.program, fragmentShader.shader);
	gl.linkProgram(this.program);
	
	if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
		throw new VVGL.GLRessourceException(this, "Could not initliase shader program.");
	}
	
	this.bind();
};

/**
 * Vertex part of shader program.
 * 
 * @type {VVGL.Shader}
 */
VVGL.ShaderProgram.prototype.vertexShader = null;

/**
 * Fragment part of shader program.
 * 
 * @type {VVGL.Shader}
 */
VVGL.ShaderProgram.prototype.fragmentShader = null;


/**
 * Init Attribute location.
 * 
 * @param {string} name Attribute name.
 */
VVGL.ShaderProgram.prototype.addAttribute = function (name) {
    var attribute = new VVGL.Attribute(this, name);

	this.attributes[name] = attribute;

    return attribute;
};

/**
 * Init Uniform location.
 * 
 * @param {string} name Uniform name.
 */
VVGL.ShaderProgram.prototype.addUniform = function (name) {
	var location = gl.getUniformLocation(this.program, name);
	if (location === -1) {
		throw new VVGL.GLRessourceException(this, "Cannot reach location of uniform " + name);
	}
	this.uniforms[name] = location;
};

/**
 * Set this shader to use.
 */
VVGL.ShaderProgram.prototype.bind = function () {
	gl.useProgram(this.program);
	VVGL.ShaderProgram.currentProgram = this;
};

/**
 * Set none shader to use.
 */
VVGL.ShaderProgram.prototype.unbind = function () {
	gl.useProgram(0);
	VVGL.ShaderProgram.currentProgram = null;
};

/**
 * Set attribute buffer.
 * 
 * @param {string} name
 * @param {VVGL.ArrayBuffer} buffer
 */
VVGL.ShaderProgram.prototype.setAttribute = function (name, buffer) {
	var attribute = this.attributes[name];
	
	if (!attribute) {
        attribute = this.addAttribute(name);
	}
	
	attribute.enable();
	gl.vertexAttribPointer(attribute.location, buffer.getItemSize(), gl.FLOAT, false, 0, 0);
};

/**
 * Unset attribute buffer.
 * 
 * @param {string} name
 */
VVGL.ShaderProgram.prototype.unsetAttribute = function (name) {
	var attribute = this.attributes[name];
	
	if (!attribute) {
		throw new VVGL.Exception("Trying to unset undefined attribute: " + name);
	}
	
	attribute.disable();
};

/**
 * Return uniform location.
 * 
 * @private
 * @param {string} name Uniform name
 */
VVGL.ShaderProgram.prototype.getUniform = function (name) {
	var uniform = this.uniforms[name];
	
	if (!uniform) {
		this.addUniform(name);
	}
	
	return (uniform);
};

/**
 * Set Int or Bool uniform.
 * 
 * @param {string} name Uniform variable name.
 * @param {number} value Uniform variable value.
 */
VVGL.ShaderProgram.prototype.setIntUniform = function (name, value) {
	gl.uniform1i(this.getUniform(name), value);
};

/**
 * @see {@link VVGL.ShaderProgram.prototype.setIntUniform}
 */
VVGL.ShaderProgram.prototype.setBoolUniform = VVGL.ShaderProgram.prototype.setIntUniform;

/**
 * Set Float uniform.
 * 
 * @param {string} name Uniform variable name.
 * @param {number} value Uniform variable value.
 */
VVGL.ShaderProgram.prototype.setFloatUniform = function (name, value) {
	gl.uniform1f(this.getUniform(name), value);
};

/**
 * Set Vec3 uniform.
 * 
 * @param {string} name Uniform variable name.
 * @param {VVGL.Vec3} vector Uniform variable value.
 */
VVGL.ShaderProgram.prototype.setVector3Uniform = function (name, vector) {
	gl.uniform3f(this.getUniform(name), vector.x, vector.y, vector.z);
};

/**
 * Set Vec4 uniform.
 * 
 * @param {string} name Uniform variable name.
 * @param {VVGL.Vec4} vector Uniform variable value.
 */
VVGL.ShaderProgram.prototype.setVector4Uniform = function (name, vector) {
	gl.uniform4f(this.getUniform(name), vector.x, vector.y, vector.z, vector.w);
};


/**
 * Set color uniform.
 * 
 * @param {string} name Uniform variable name.
 * @param {VVGL.Color} color Uniform variable value.
 */
VVGL.ShaderProgram.prototype.setColorUniform = function (name, color) {
	gl.uniform3f(this.getUniform(name), color.r, color.g, color.b);
};

/**
 * Set Mat3 uniform.
 * 
 * @param {string} name Uniform variable name.
 * @param {VVGL.Mat3} matrix Uniform variable value.
 */
VVGL.ShaderProgram.prototype.setMatrix3Uniform = function (name, matrix) {
	var uniform = this.getUniform(name);
	gl.uniformMatrix3fv(uniform, false, matrix.toArray());
};

/**
 * Set Mat4 uniform.
 * 
 * @param {string} name Uniform variable name.
 * @param {VVGL.Mat4} matrix Uniform variable value.
 */
VVGL.ShaderProgram.prototype.setMatrix4Uniform = function (name, matrix) {
	var uniform = this.getUniform(name);
	gl.uniformMatrix4fv(uniform, false, matrix.toArray());
};


/**
 * Initialize static shaders samples.
 *
 * @private
 * @static
 */
VVGL.ShaderProgram.initStaticShaders = function () {
    VVGL.ShaderProgram.basicShader = VVGL.ShaderProgram.createFromStrings(VVGL.Shader.basicVertexShader, VVGL.Shader.basicFragmentShader);
};


/**
 * Currently used shader program.
 * 
 * @static
 * @type {VVGL.ShaderProgram}
 */
VVGL.ShaderProgram.currentProgram = null;

/**
 * Create a shader program from two element ids linked to shaders files.
 * 
 * @static
 * @param {string} vertexId Element id of vertex shader file.
 * @param {string} fragmentId Element id of fragment shader file.
 * @return {VVGL.ShaderProgram} Created program.
 */
VVGL.ShaderProgram.createFromFiles = function (vertexId, fragmentId) {
	var vertexShader = VVGL.Shader.createFromFile(vertexId, gl.VERTEX_SHADER);
	var fragmentShader = VVGL.Shader.createFromFile(fragmentId, gl.FRAGMENT_SHADER);
	
	return (new VVGL.ShaderProgram(vertexShader, fragmentShader));
};

/**
 * Create a shader program from two strings containing shaders's codes.
 * 
 * @static
 * @param {string} vertexString Vertex shader code.
 * @param {string} fragmentString Fragment shader code.
 * @return {VVGL.ShaderProgram} Program created.
 */
VVGL.ShaderProgram.createFromStrings = function (vertexString, fragmentString) {
	var vertexShader = VVGL.Shader.createFromString(vertexString, gl.VERTEX_SHADER);
	var fragmentShader = VVGL.Shader.createFromString(fragmentString, gl.FRAGMENT_SHADER);
	
	return (new VVGL.ShaderProgram(vertexShader, fragmentShader));
};


/**
 * Ready to use shader program for simple texturing.
 *
 * @readonly
 * @type {VVGL.ShaderProgram}
 */
VVGL.ShaderProgram.basicShader = null;
