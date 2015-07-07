/**
 * Compiled vertex or fragment shader.
 * Do not try to create instances yourself.
 * Just do not.
 *
 * @class
 * @classdesc Compiled vertex or fragment shader.
 * @private
 * @param {string} code GLSL code to compile.
 * @param {number} type GL maccro corresponding to shader type (vertex or fragment).
 * @param {string} [elementId] Optional element id to indicate which is this shader in case of compilation failure.
 */
VVGL.Shader = function (code, type, elementId) {
	this.type = VVGL.Shader.getStringType(type);
	this.shader = gl.createShader(type);
	gl.shaderSource(this.shader, code);
	gl.compileShader(this.shader);
	
    if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
        elementId = elementId ? elementId : this.type + " shader";
		var message = "Couldn't compile " + elementId + ": ";
    	throw new VVGL.GLRessourceException(this, message + gl.getShaderInfoLog(this.shader));
    }
};

/**
 * Return a shader type in a string from gl shader type enum.
 *
 * @static
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
 * @static
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
 * @static
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
    	throw new Exception("Http request failed with error code " + xhr.status);
	}
	
	return (shader);
};

/**
 * Create a vertex or fragment shader from a code string.
 *
 * @static
 * @param {string} code GLSL code to compile.
 * @param {number} type GL maccro corresponding to shader type (vertex or fragment).
 * @return {VVGL.Shader} compiled shader.
 */
VVGL.Shader.createFromString = function (code, type) {
	return (new VVGL.Shader(code, type));
};


/**
 * vertex shader source code for simple texturing and lighting.
 *
 * @readonly
 * @type {string}
 */
VVGL.Shader.basicVertexShader = "\
attribute vec3	aPosition;\n\
attribute vec4	aColor;\n\
attribute vec2	aTextureCoord;\n\
attribute vec3	aNormal;\n\
\n\
uniform mat4	uModelMatrix;\n\
uniform mat4	uViewMatrix;\n\
uniform mat4	uPerspectiveMatrix;\n\
uniform mat3	uNormalMatrix;\n\
\n\
varying vec3	vPosition;\n\
varying vec4	vColor;\n\
varying vec2	vTextureCoord;\n\
varying vec3	vNormal;\n\
\n\
void	main(void)\n\
{\n\
    vPosition = (uModelMatrix * vec4(aPosition, 1.0)).xyz;\n\
    gl_Position = uPerspectiveMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);\n\
    vColor = aColor;\n\
    vTextureCoord = aTextureCoord;\n\
    vNormal = normalize(aNormal * uNormalMatrix);\n\
}\n\
";

/**
 * fragment shader source code for basic texturing and lighting.
 *
 * @readonly
 * @type {string}
 */
VVGL.Shader.basicFragmentShader = "\
precision mediump float;\n\
\n\
struct AmbianceLight\n\
{\n\
    vec3	color;\n\
};\n\
\n\
struct DirectionLight\n\
{\n\
    vec3	color;\n\
    vec3	direction;\n\
};\n\
\n\
struct SpotLight\n\
{\n\
    float	power;\n\
    vec3	position;\n\
    vec3	color;\n\
};\n\
\n\
varying vec3	vPosition;\n\
varying vec4	vColor;\n\
varying vec2	vTextureCoord;\n\
varying vec3	vNormal;\n\
\n\
uniform bool		uUseColor;\n\
uniform bool		uUseTexture;\n\
uniform bool		uUseNormal;\n\
uniform sampler2D	uTexture;\n\
\n\
uniform AmbianceLight	aLight;\n\
uniform DirectionLight	dLight;\n\
uniform SpotLight	sLight;\n\
\n\
vec3	calcLightValue(SpotLight light)\n\
{\n\
    vec3	direction;\n\
    vec3	lighting;\n\
    float	coef;\n\
\n\
    direction = light.position - vPosition;\n\
    coef = max(dot(vNormal, normalize(direction)), 0.0) * light.power / length(direction);\n\
    lighting = light.color * coef;\n\
\n\
    return (lighting);\n\
}\n\
\n\
void	main(void)\n\
{\n\
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\
\n\
    if (uUseColor)\n\
    {\n\
        gl_FragColor *= vColor;\n\
    }\n\
    if (uUseTexture)\n\
    {\n\
        gl_FragColor *= texture2D(uTexture, vec2(vTextureCoord.s, vTextureCoord.t));\n\
    }\n\
    if (uUseNormal)\n\
    {\n\
        vec3	lighting;\n\
        lighting = aLight.color;\n\
        lighting += calcLightValue(sLight);\n\
        gl_FragColor *= vec4(lighting, 1.0);\n\
    }\n\
}\n\
";
