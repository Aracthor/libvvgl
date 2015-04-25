/**
 * OpenGL buffer to store mesh data.
 * Can be a vertice feature (position, color, textureCoord or normal) or Element indices.
 * 
 * @class
 * @implements {VVGL.IBindable}
 * @param {number} type GL enum : gl.ARRAY_BUFFER or gl.ELEMENT_BUFFER.
 * @param {Array} data Array containing data.
 * @param {number} itemSize Number of data used by each item, for exemple 3 for a 3-dimentional position.
 */
VVGL.ArrayBuffer = function (type, data, itemSize) {
	this.type = type;
	this.buffer = gl.createBuffer();
	this.data = data;
	this.itemSize = itemSize;
	this.attribute = null;
	
	this.bind();
	{
		gl.bufferData(this.type, data, gl.STATIC_DRAW);
	}
	this.unbind();
};

VVGL.ArrayBuffer.prototype = Object.create(VVGL.IBindable.prototype);

/**
 * Link to a shader attribute from name.
 * 
 * @param {string} attribute
 */
VVGL.ArrayBuffer.prototype.linkToAttribute = function (attribute) {
	this.attribute = attribute;
};

/**
 * Return points number by element.
 * 
 * @return {number}
 */
VVGL.ArrayBuffer.prototype.getItemSize = function () {
	return (this.itemSize);
};

/**
 * Bind buffer, selecting this one for next OpenGL calls.
 */
VVGL.ArrayBuffer.prototype.bind = function () {
	gl.bindBuffer(this.type, this.buffer);
	if (this.attribute !== null) {
		var program = VVGL.ShaderProgram.currentProgram;
		program.setAttribute(this.attribute, this);
	}
};

/**
 * Unbind buffer, selecting none.
 */
VVGL.ArrayBuffer.prototype.unbind = function () {
	gl.bindBuffer(this.type, null);
};
