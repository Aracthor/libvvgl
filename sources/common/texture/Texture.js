/**
 * Create texture from image file.
 *
 * @class
 * @classdesc Graphic 2D texture.
 * @todo Texture manager.
 * @param {string} source
 */
VVGL.Texture = function (source, loadCallback) {
	var me = this;

	this.ready = false;
	this.source = source;
	this.image = new Image();
    this.image.onload = function () { me.onLoad();};
    this.image.onerror = function () { me.onError();};
	this.image.src = source;
};

/**
 * Check if texture is ready to be used or not.
 *
 * @return {boolean}
 */
VVGL.Texture.prototype.isReady = function () {
	return (this.ready);
};

/**
 * Called on texture file loading end.
 *
 * @private
 */
VVGL.Texture.prototype.onLoad = function () {
    this.ready = true;
};

/**
 * Called on texture file loading error.
 *
 * @private
 */
VVGL.Texture.prototype.onError = function () {
    throw new VVGL.Exception("Could not load texture: " + this.image.src);
};
