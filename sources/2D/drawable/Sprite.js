/**
 * @class
 * @classdesc Sprite linked to texture.
 * @implements VVGL.Drawable
 * @todo add texture rect
 */
VVGL.Sprite = function () {
	this.position = new VVGL.Vec2();
};

VVGL.Sprite.prototype = Object.create(VVGL.Drawable.prototype);

/**
 * @type {VVGL.Vec2}
 */
VVGL.Sprite.prototype.position = null;

/**
 * @type {number}
 * @default
 */
VVGL.Sprite.prototype.width = 0;

/**
 * @type {number}
 * @default
 */
VVGL.Sprite.prototype.height = 0;

/**
 * @type {VVGL.Texture}
 */
VVGL.Sprite.prototype.texture = null;

/**
 * Render sprite to 2D context.
 * 
 * @param {HTMLContext} context
 */
VVGL.Sprite.prototype.render = function (context) {
	if (this.texture === null) {
		console.error("Missing texture for sprite.");
	} else if (this.texture.isReady()) {
		context.drawImage(this.texture.image, this.position.x, this.position.y, this.width, this.height);
	}
};


VVGL.Sprite.fromFile = function (file) {
	var sprite = new VVGL.Sprite();
	sprite.texture = new VVGL.Texture(file, function () {
		sprite.width = sprite.texture.image.width;
		sprite.height = sprite.texture.image.height;
	});
	
	return (sprite);
};
