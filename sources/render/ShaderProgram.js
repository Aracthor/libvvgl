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
	this.addAttribute("aVertexPosition");
	this.addAttribute("aVertexColor");
	this.addUniform("uModelMatrix");
	this.addUniform("uPerspectiveMatrix");
	this.addUniform("uViewMatrix");
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
	var location = gl.getAttribLocation(this.program, name);
	this.attributes[name] = location;
	gl.enableVertexAttribArray(location);
};

/**
 * Init Uniform location.
 * 
 * @param {string} name Uniform name.
 */
VVGL.ShaderProgram.prototype.addUniform = function (name) {
	this.uniforms[name] = gl.getUniformLocation(this.program, name);
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
	var location = this.attributes[name];
	
	if (location === undefined) {
		throw new VVGL.Exception("Trying to get undefined attribute: " + name);
	}
	
	gl.vertexAttribPointer(location, buffer.getItemSize(), gl.FLOAT, false, 0, 0);
};

/**
 * Return uniform location.
 * 
 * @private
 * @param {string} name Uniform name
 */
VVGL.ShaderProgram.prototype.getUniform = function (name) {
	var uniform = this.uniforms[name];
	
	if (uniform === undefined) {
		throw new VVGL.Exception("Trying to get undefined uniform: " + name);
	}
	
	return (uniform);
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
 * Create a shader program from two element ids linked to shaders scripts.
 * 
 * @static
 * @param {string} vertexId Element id of vertex shader script.
 * @param {string} fragmentId Element id of fragment shader script.
 * @return {VVGL.ShaderProgram} Program created.
 */
VVGL.ShaderProgram.createFromScripts = function (vertexId, fragmentId) {
	var vertexShader = VVGL.Shader.createFromScript(vertexId, gl.VERTEX_SHADER);
	var fragmentShader = VVGL.Shader.createFromScript(fragmentId, gl.FRAGMENT_SHADER);
	
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
