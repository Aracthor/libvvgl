/**
 * @class
 * @classdesc Pixel frame. Must be updated after each modification.
 * @implements VVGL.Drawable
 */
VVGL.Frame = function () {
	this.start = new VVGL.Vec2();
	this.end = new VVGL.Vec2();
	this.color = VVGL.Color.black.clone();
	
	this.borders = [new VVGL.Line(), new VVGL.Line(), new VVGL.Line(), new VVGL.Line()];

	this.angles = [new VVGL.Arc(), new VVGL.Arc(), new VVGL.Arc(), new VVGL.Arc()];
	this.angles[0].startAngle = Math.PI;
	this.angles[0].endAngle = 3 * Math.PI / 2;
	this.angles[1].startAngle = 3 * Math.PI / 2;
	this.angles[1].endAngle = Math.PI * 2;
	this.angles[2].startAngle = 0;
	this.angles[2].endAngle = Math.PI / 2;
	this.angles[3].startAngle = Math.PI / 2;
	this.angles[3].endAngle = Math.PI;
	
	this.update();
};

VVGL.Frame.prototype = Object.create(VVGL.Drawable.prototype);

/**
 * @type {VVGL.Vec2}
 */
VVGL.Frame.prototype.start = null;

/**
 * @type {VVGL.Vec2}
 */
VVGL.Frame.prototype.end = null;

/**
 * @type {VVGL.Color}
 * @default
 */
VVGL.Frame.prototype.color = VVGL.Color.black;

/**
 * @type {number}
 * @default
 */
VVGL.Frame.prototype.lineWidth = 1;

/**
 * @type {number}
 * @default
 */
VVGL.Frame.prototype.anglesRadius = 1;

/**
 * Update frame internal data from public members.
 */
VVGL.Frame.prototype.update = function () {
	for (var i in this.borders) {
		var border = this.borders[i];
		border.color = this.color;
		border.width = this.lineWidth;
	}
	
	this.borders[0].start.x = this.start.x + this.anglesRadius - 1;
	this.borders[0].start.y = this.start.y;
	this.borders[0].end.x = this.end.x - this.anglesRadius + 1;
	this.borders[0].end.y = this.start.y;
	this.borders[1].start.x = this.end.x;
	this.borders[1].start.y = this.start.y + this.anglesRadius - 1;
	this.borders[1].end.x = this.end.x;
	this.borders[1].end.y = this.end.y - this.anglesRadius + 1;
	this.borders[2].start.x = this.end.x - this.anglesRadius + 1;
	this.borders[2].start.y = this.end.y;
	this.borders[2].end.x = this.start.x + this.anglesRadius - 1;
	this.borders[2].end.y = this.end.y;
	this.borders[3].start.x = this.start.x;
	this.borders[3].start.y = this.end.y - this.anglesRadius + 1;
	this.borders[3].end.x = this.start.x;
	this.borders[3].end.y = this.start.y + this.anglesRadius - 1;

	for (var i in this.angles) {
		var angle = this.angles[i];
		angle.radius = this.anglesRadius;
		angle.color = this.color;
		angle.lineWidth = this.lineWidth;
	}
	
	this.angles[0].position.x = this.start.x + this.anglesRadius;
	this.angles[0].position.y = this.start.y + this.anglesRadius;
	this.angles[1].position.x = this.end.x - this.anglesRadius;
	this.angles[1].position.y = this.start.y + this.anglesRadius;
	this.angles[2].position.x = this.end.x - this.anglesRadius;
	this.angles[2].position.y = this.end.y - this.anglesRadius;
	this.angles[3].position.x = this.start.x + this.anglesRadius;
	this.angles[3].position.y = this.end.y - this.anglesRadius;
};

/**
 * Render intern data to 2D context.
 * 
 * @override
 * @param {HTMLContext} context
 */
VVGL.Frame.prototype.render = function (context) {
	this.borders[0].render(context);
	this.borders[1].render(context);
	this.borders[2].render(context);
	this.borders[3].render(context);
	this.angles[0].render(context);
	this.angles[1].render(context);
	this.angles[2].render(context);
	this.angles[3].render(context);
};
