/**
 * Create new bindable texture from image file.
 * 
 * @class
 * @classdesc Bindable texture.
 * @extends {VVGL.Texture}
 * @implements {VVGL.IBindable}
 * @param {string} source Image file path.
 */
VVGL.GLTexture = function (source) {
    VVGL.Texture.call(this, source);

	this.texture = gl.createTexture();
};

VVGL.GLTexture.prototype = Object.create(VVGL.Texture.prototype);

/**
 * Define this texture as used.
 */
VVGL.GLTexture.prototype.bind = function () {
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
};

/**
 * Define no texture as used.
 */
VVGL.GLTexture.prototype.unbind = function () {
	gl.bindTexture(gl.TEXTURE_2D, null);
};

/**
 * Use this texture in shader.
 * 
 * @todo Use multiple textures.
 */
VVGL.GLTexture.prototype.activate = function () {
	var shader = VVGL.ShaderProgram.currentProgram;
	
    gl.activeTexture(gl.TEXTURE0);
    this.bind();
    shader.setIntUniform("uTexture", 0);
};

/**
 * Called once image finished to load.
 * 
 * @private
 * @override
 */
VVGL.GLTexture.prototype.onLoad = function () {
    VVGL.Texture.prototype.onLoad.call(this);

	this.bind();
	{
	    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	}
	this.unbind();
};
