/**
 * @class
 * @classdesc Renderable text.
 * @implements VVGL.Drawable
 * @param {string} string
 */
VVGL.Text = function (string) {
	this.string = string;
	this.position = new VVGL.Vec2();
	this.color = VVGL.Color.black.clone();
};

VVGL.Text.prototype = Object.create(VVGL.Drawable.prototype);

/**
 * @type {VVGL.Vec2}
 */
VVGL.Text.prototype.position = null;

/**
 * @type {boolean}
 * @default
 */
VVGL.Text.prototype.lined = false;

/**
 * @type {boolean}
 * @default
 */
VVGL.Text.prototype.horizontalAligned = false;

/**
 * @type {boolean}
 * @default
 */
VVGL.Text.prototype.verticalAligned = false;


/**
 * @type {number}
 * @default
 */
VVGL.Text.prototype.lineWidth = 2;

/**
 * @type {number}
 * @default
 */
VVGL.Text.prototype.size = 10;

/**
 * @type {VVGL.Color}
 * @default
 */
VVGL.Text.prototype.color = VVGL.Color.black;

/**
 * @type {string}
 * @default
 */
VVGL.Text.prototype.font = "Arial";

/**
 * Render text to 2D context.
 * 
 * @param {HTMLContext} context
 */
VVGL.Text.prototype.render = function (context) {
	context.font = this.size + "pt " + this.font;
	context.textAlign = this.horizontalAligned ? "center" : "";
	context.textBaseline = this.verticalAligned ? "middle" : "";
	
	if (this.lined) {
		context.lineWidth = this.lineWidth;
		context.strokeStyle = this.color.toString();
		context.strokeText(this.string, this.position.x, this.position.y);
	} else {
		context.fillStyle = this.color.toString();
		context.fillText(this.string, this.position.x, this.position.y);
	}
};
