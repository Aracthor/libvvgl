/**
 * Compiled vertex or fragment shader.
 * Do not try to create instances yourself.
 * Just do not.
 * 
 * @class Compiled vertex or fragment shader.
 * @constructor
 * @private
 * @param {string} code GLSL code to compile.
 * @param {number} type GL maccro corresponding to shader type (vertex or fragment).
 * @param {string} elementId Optional element id to indicate which is this shader in case of compilation failure.
 */
VVGL.Shader = function (code, type, elementId) {
	this.type = VVGL.Shader.getStringType(type);
	this.shader = gl.createShader(type);
	gl.shaderSource(this.shader, code);
	gl.compileShader(this.shader);
	
    if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
    	var message;
    	
    	if (elementId === undefined) {
    		message = "Couldn't compile " + this.type + " shader: ";
    	} else {
    		message = "Couldn't compile " + elementId + ": ";
    	}
    	throw new VVGL.GLRessourceException(this, message + gl.getShaderInfoLog(this.shader));
    }
};

/**
 * Return a shader type in a string from gl shader type enum.
 * 
 * @param {number} type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 * @return {string} Shader type name.
 */
VVGL.Shader.getStringType = function (type) {
	var name = "undefined";
	
	if (type == gl.VERTEX_SHADER) {
		name = "vertex";
	} else if (type == gl.FRAGMENT_SHADER) {
		name = "fragment";
	}
	
	return (name);
};

/**
 * Send an HTTP request for a shader file.
 * 
 * @private
 * @param {string} elementId Element id linked to file.
 * @return {Promise} Future HTTP request result.
 */
VVGL.Shader.getShaderFromHTTP = function (elementId) {
   return new Promise(function(resolve, reject){ // return a future

   });
};

/**
 * Create a shader from an element id linked to shader file.
 * 
 * @param {string} elementId Element id linked to file.
 * @param {number} type GL maccro corresponding to shader type (vertex or fragment).
 * @return {VVGL.Shader} Created shader.
 */
VVGL.Shader.createFromFile = function(elementId, type) {
	var shader;
	var code;
    var file = document.getElementById(elementId).src;
    var xhr = new XMLHttpRequest;
    xhr.open("GET", file, false);
    xhr.send(null); 

	if (xhr.status == 200) {
		shader = new VVGL.Shader(xhr.responseText, type, elementId);
	} else {
    	throw new Exception("Http request fail with error code " + xhr.status);
	}
	
	return (shader);
};

VVGL.Shader.createFronString = function (code, type) {
	return (new VVGL.Shader(code, type));
};
