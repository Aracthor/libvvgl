/**
 * @class
 * @classdesc Pixel line.
 * @implements VVGL.Drawable
 */
VVGL.Line = function () {
	this.start = new VVGL.Vec2();
	this.end = new VVGL.Vec2();
	this.color = VVGL.Color.black.clone();
};

VVGL.Line.prototype = Object.create(VVGL.Drawable.prototype);

/**
 * @type {VVGL.Vec2}
 */
VVGL.Line.prototype.start = null;

/**
 * @type {VVGL.Vec2}
 */
VVGL.Line.prototype.end = null;

/**
 * @type {number}
 * @default
 */
VVGL.Line.prototype.width = 1;

/**
 * @type {VVGL.Color}
 * @default
 */
VVGL.Line.prototype.color = VVGL.Color.black;

/**
 * @type {VVGL.LineCap}
 * @default
 */
VVGL.Line.prototype.lineCap = VVGL.LineCap.BUTT;

/**
 * Render line to 2D context.
 * 
 * @override
 * @param {HTMLContext} context
 */
VVGL.Line.prototype.render = function (context) {
	context.beginPath();
	context.moveTo(this.start.x, this.start.y);
	context.lineTo(this.end.x, this.end.y);
	context.lineWidth = this.width;
	context.strokeStyle = this.color.toString();
	context.lineCap = this.lineCap;
	context.stroke();
};
