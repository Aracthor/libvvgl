/**
 * @class
 * @classdesc Represent a model.
 * @extends VVGL.SceneData
 * @param {VVGL.RenderMode} [renderMode=VVGL.RenderMode.TRIANGLES]
 */
VVGL.Mesh = function (renderMode) {
	VVGL.SceneData.call(this, "mesh");
	renderMode = VVGL.setIfUndefined(renderMode, VVGL.RenderMode.TRIANGLES);
	
	this.verticesBuffers = [];
	this.useColor = false;
	this.useTextureCoord = false;
	this.useNormal = false;
	this.texture = null;
	this.shader = null;
	this.indices = null;
	
	this.renderMode = renderMode;
};

VVGL.Mesh.prototype = Object.create(VVGL.SceneData.prototype);

/**
 * Create an array buffer from a data array.
 * 
 * @private
 * @param {Array} data
 * @param {number} itemSize
 * @return {VVGL.ArrayBuffer} Ready-to-use array buffer.
 */
VVGL.Mesh.prototype.createFloatData = function (array, itemSize) {
	var data = new Float32Array(array);
	var arrayBuffer = new VVGL.ArrayBuffer(gl.ARRAY_BUFFER, data, itemSize);
	
	return (arrayBuffer);
};

/**
 * Create an element buffer from a data array.
 * 
 * @private
 * @param {Array} data
 * @param {number} itemSize
 * @return {VVGL.ArrayBuffer} Ready-to-use array buffer.
 */
VVGL.Mesh.prototype.createIntData = function (array) {
	var data = new Uint16Array(array);
	var elemBuffer = new VVGL.ArrayBuffer(gl.ELEMENT_ARRAY_BUFFER, data, 1);
	
	return (elemBuffer);
};

/**
 * Bind ArrayBuffers of mesh.
 * Link to attributes of current shader program.
 */
VVGL.Mesh.prototype.bindArrays = function () {
	for (var i in this.verticesBuffers) {
		this.verticesBuffers[i].bind();
	}
	if (this.indices) {
		this.indices.bind();
	}
	
	var shader = VVGL.ShaderProgram.currentProgram;
	shader.setBoolUniform("uUseColor", this.useColor);
	shader.setBoolUniform("uUseTexture", this.useTextureCoord);
	shader.setBoolUniform("uUseNormal", this.useNormal);
	
	if (this.useTextureCoord) {
		if (this.texture === null) {
			throw new VVGL.Exception("Trying to render a textured mesh without texture.");
		}
		this.texture.activate();
	}
};

/**
 * Unbind ArrayBuffers of mesh.
 */
VVGL.Mesh.prototype.unbindArrays = function () {
	for (var i in this.verticesBuffers) {
		this.verticesBuffers[i].unbind();
	}
	if (this.indices) {
		this.indices.unbind();
	}
};

/**
 * Create positions array buffer from positions data.
 * 
 * @param {Array} positions Float array.
 */
VVGL.Mesh.prototype.addPositions = function (positions) {
	var buffer = this.createFloatData(positions, 3);
	buffer.linkToAttribute("aPosition");
	if (this.indices === null) {
		this.itemsNumber = positions.length / 3;
	}
	
	this.verticesBuffers.push(buffer);
};

/**
 * Create colors array buffer from colors data.
 * 
 * @param {Array} colors Float array.
 */
VVGL.Mesh.prototype.addColors = function (colors) {
	buffer = this.createFloatData(colors, 4);
	buffer.linkToAttribute("aColor");
	
	this.useColor = true;
	this.verticesBuffers.push(buffer);
};

/**
 * Create texture coords array buffer from texture coords data.
 * 
 * @param {Array} positions Float array.
 */
VVGL.Mesh.prototype.addTextureCoords = function (textureCoords) {
	buffer = this.createFloatData(textureCoords, 2);
	buffer.linkToAttribute("aTextureCoord");
	
	this.useTextureCoord = true;
	this.verticesBuffers.push(buffer);
};

/**
 * Create texture coords array buffer from texture coords data.
 * 
 * @param {Array} positions Float array.
 */
VVGL.Mesh.prototype.addNormals = function (normals) {
	buffer = this.createFloatData(normals, 3);
	buffer.linkToAttribute("aNormal");
	
	this.useNormal = true;
	this.verticesBuffers.push(buffer);
};

/**
 * Create indices buffer from indices data.
 * 
 * @param {Array} indices Integer array.
 */
VVGL.Mesh.prototype.addIndices = function (indices) {
	this.indices = this.createIntData(indices);
	this.itemsNumber = indices.length;
};

/**
 * Set mesh texture. Necessary if textureCoords are used.
 * 
 * @param {VVGL.Texture} texture
 */
VVGL.Mesh.prototype.setTexture = function (texture) {
	this.texture = texture;
};

/**
 * Set shader program.
 * 
 * @param {VVGL.ShaderProgram} texture
 */
VVGL.Mesh.prototype.setShader = function (shader) {
	this.shader = shader;
};

/**
 * Return mesh shader.
 * Throw an exception if no shader is linked.
 * 
 * @return {VVGL.ShaderProgram}
 */
VVGL.Mesh.prototype.getShader = function () {
	if (this.shader === null) {
		throw new VVGL.Exception("Missing shader for a mesh.");
	}
	return (this.shader);
};

/**
 * Render mesh to scene, drawing parts.
 * 
 * @override
 */
VVGL.Mesh.prototype.render = function () {
	this.bindArrays();
	{
		if (this.indices === null) {
			VVGL.GLErrorException.checkError("drawArrays before");
			gl.drawArrays(this.renderMode, 0, this.itemsNumber);
			VVGL.GLErrorException.checkError("drawArrays");
		} else {
			VVGL.GLErrorException.checkError("drawElements before");
			gl.drawElements(this.renderMode, this.itemsNumber, gl.UNSIGNED_SHORT, 0);
			VVGL.GLErrorException.checkError("drawElements");
		}
	}
	this.unbindArrays();
};

/**
 * Update mesh data.
 * In fact... Do nothing.
 * 
 * @override
 * @param {number} elapsedTime
 */
VVGL.Mesh.prototype.update = function (elapsedTime) {};
