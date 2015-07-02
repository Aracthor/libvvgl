/**
 * @class
 * @classdesc Pixel arc.
 * @implements VVGL.Drawable
 */
VVGL.Arc = function () {
	this.position = new VVGL.Vec2();
	this.color = VVGL.Color.black.clone();
};

VVGL.Arc.prototype = Object.create(VVGL.Drawable.prototype);

/**
 * @type {VVGL.Vec2}
 */
VVGL.Arc.prototype.position = null;

/**
 * @type {VVGL.Color}
 * @default
 */
VVGL.Arc.prototype.color = VVGL.Color.black;

/**
 * @type {number}
 * @default
 */
VVGL.Arc.prototype.lineWidth = 1;

/**
 * @type {number}
 * @default
 */
VVGL.Arc.prototype.radius = 0;

/**
 * @type {number}
 * @default
 */
VVGL.Arc.prototype.startAngle = 0;

/**
 * @type {number}
 * @default
 */
VVGL.Arc.prototype.endAngle = 2 * Math.PI;


/**
 * Render arc to context.
 * 
 * @override
 * @param {HTMLContext} context
 */
VVGL.Arc.prototype.render = function (context) {
	context.beginPath();
	context.arc(this.position.x, this.position.y, this.radius, this.startAngle, this.endAngle, false);
	context.lineWidth = this.lineWidth;
	
	context.strokeStyle = this.color.toString();
	context.stroke();
};
