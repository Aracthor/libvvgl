/**
 * Create new texture from image file.
 * 
 * @class
 * @classdesc Bindable texture.
 * @implements {VVGL.IBindable}
 * @param {string} source Image file path.
 * @todo Add texture manager.
 */
VVGL.Texture = function (source) {
	var me = this;
	
	this.texture = gl.createTexture();
	this.image = new Image();
	this.image.onload = function () {me.onLoad();};
	this.image.onerror = function () {me.onError();};
	this.image.src = source;
};

VVGL.Texture.prototype = Object.create(VVGL.IBindable.prototype);

/**
 * Define this texture as used.
 */
VVGL.Texture.prototype.bind = function () {
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
};

/**
 * Define no texture as used.
 */
VVGL.Texture.prototype.unbind = function () {
	gl.bindTexture(gl.TEXTURE_2D, null);
};

/**
 * Use this texture in shader.
 * 
 * @todo Use multiple textures.
 */
VVGL.Texture.prototype.activate = function () {
	var shader = VVGL.ShaderProgram.currentProgram;
	
    gl.activeTexture(gl.TEXTURE0);
    this.bind();
    shader.setIntUniform("uTexture", 0);
};


/**
 * Called if image loading failed.
 * 
 * @private
 */
VVGL.Texture.prototype.onError = function () {
	alert("Failed to load texture " + this.image.src);
};

/**
 * Called once image finished to load.
 * 
 * @private
 */
VVGL.Texture.prototype.onLoad = function () {
	this.bind();
	{
	    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	}
    this.unbind();
};
