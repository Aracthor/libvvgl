/**
 * Create black color.
 *
 * @class
 * @classdesc Functions for color-number manipulation.
 */
VVGL.Color = function () {};

/**
 * Red color data
 * 
 * @type {number}
 */
VVGL.Color.prototype.r = 0.0;

/**
 * Green color data
 * 
 * @type {number}
 */
VVGL.Color.prototype.g = 0.0;

/**
 * Blue color data
 * 
 * @type {number}
 */
VVGL.Color.prototype.b = 0.0;

/**
 * Alpha (transparency) color data
 * 
 * @type {number}
 */
VVGL.Color.prototype.a = 1.0;

/**
 * Replace color data by a new one.
 * 
 * @param {number} number New data.
 */
VVGL.Color.prototype.setFromInteger = function (number) {
	this.r = (number & 0xFF000000) >> 24;
	this.g = (number & 0x00FF0000) >> 16;
	this.b = (number & 0x0000FF00) >> 8;
	this.a = (number & 0x000000FF) >> 0;
};

/**
 * Replace color data by a new one.
 * Each param must be between 0x00 and 0xFF.
 * 
 * @param {number} r Red value.
 * @param {number} g Green value.
 * @param {number} b Blue value.
 * @param {number} a Alpha value.
 */
VVGL.Color.prototype.setFromIntNumbers = function (r, g, b, a) {
	a = VVGL.setIfUndefined(a, 0xFF);
	this.setFromInteger((r << 24) + (g << 16) + (b << 8) + a);
};

/**
 * Replace color data by a new one.
 * Each param must be between 0.0 and 1.0.
 * 
 * @param {number} r Red value.
 * @param {number} g Green value.
 * @param {number} b Blue value.
 * @param {number} a Alpha value.
 */
VVGL.Color.prototype.setFromFloatNumbers = function (r, g, b, a) {
	a = VVGL.setIfUndefined(a, 1.0);
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
};

/**
 * Return a copy of the instance.
 * 
 * @return {VVGL.Color} Copy of the instance.
 */
VVGL.Color.prototype.clone = function () {
	var copy = new VVGL.Color();
	
	copy.setFromFloatNumbers(this.r, this.g, this.b, this.a);
	
	return (copy);
};


/**
 * Initialize const color values.
 * 
 * @private
 */
VVGL.Color.initStaticValues = function () {
	VVGL.Color.black.setFromFloatNumbers(0.0, 0.0, 0.0);
	VVGL.Color.red.setFromFloatNumbers(1.0, 0.0, 0.0);
	VVGL.Color.green.setFromFloatNumbers(0.0, 1.0, 0.0);
	VVGL.Color.blue.setFromFloatNumbers(0.0, 0.0, 1.0);
	VVGL.Color.yellow.setFromFloatNumbers(1.0, 1.0, 0.0);
	VVGL.Color.magenta.setFromFloatNumbers(1.0, 0.0, 1.0);
	VVGL.Color.cyan.setFromFloatNumbers(0.0, 1.0, 1.0);
	VVGL.Color.white.setFromFloatNumbers(1.0, 1.0, 1.0);
};

/**
 * Black color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.black = new VVGL.Color();

/**
 * Red color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.red = new VVGL.Color();

/**
 * Green color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.green = new VVGL.Color();

/**
 * Blue color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.blue = new VVGL.Color();

/**
 * Yellow color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.yellow = new VVGL.Color();

/**
 * Magenta color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.magenta = new VVGL.Color();

/**
 * Cyan color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.cyan = new VVGL.Color();

/**
 * White color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.white = new VVGL.Color();
