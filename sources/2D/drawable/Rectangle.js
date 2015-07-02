/**
 * @class
 * @classdesc Colored rectangle.
 * @implements VVGL.Drawable
 */
VVGL.Rectangle = function () {
	this.position = new VVGL.Vec2();
	this.fillColor = VVGL.Color.white.clone();
	this.borderColor = VVGL.Color.black.clone();
};

VVGL.Rectangle.prototype = Object.create(VVGL.Drawable.prototype);

/**
 * @type {VVGL.Vec2}
 */
VVGL.Rectangle.prototype.position = null;

/**
 * @type {number}
 * @default
 */
VVGL.Rectangle.prototype.width = 0;

/**
 * @type {number}
 * @default
 */
VVGL.Rectangle.prototype.height = 0;

/**
 * @type {boolean}
 * @default
 */
VVGL.Rectangle.prototype.fill = true;

/**
 * @type {VVGL.Color}
 * @default
 */
VVGL.Rectangle.prototype.fillColor = VVGL.Color.white;

/**
 * @type {boolean}
 * @default
 */
VVGL.Rectangle.prototype.border = false;

/**
 * @type {number}
 * @default
 */
VVGL.Rectangle.prototype.borderWidth = 1;

/**
 * @type {VVGL.LineCap}
 * @default
 */
VVGL.Rectangle.prototype.borderCap = VVGL.LineCap.BUTT;

/**
 * @type {VVGL.Color}
 * @default
 */
VVGL.Rectangle.prototype.borderColor = VVGL.Color.black;

/**
 * Render line to 2D context.
 * 
 * @param {HTMLContext} context
 */
VVGL.Rectangle.prototype.render = function (context) {
	context.beginPath();
	context.rect(this.position.x, this.position.y, this.width, this.height);
	if (this.fill) {
		context.fillStyle = this.fillColor.toString();
		context.fill();
	}
	if (this.border) {
		context.lineWidth = this.borderWidth;
		context.lineCap = this.borderCap; // useless...
		context.strokeStyle = this.borderColor.toString();
		context.stroke();
	}
};
