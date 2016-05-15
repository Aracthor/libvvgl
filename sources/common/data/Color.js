/**
 * Create color from arguments, or black color if none.
 *
 * @class
 * @classdesc Functions for color-number manipulation.
 * @param {number} [r=0] Red value (between 0 and 1)
 * @param {number} [g=0] Green value (between 0 and 1)
 * @param {number} [b=0] Blue value (between 0 and 1)
 * @param {number} [a=1] Alpha value (between 0 and 1)
 */
VVGL.Color = function (r, g, b, a) {
    this.r = r ? r : 0.0;
    this.g = g ? g : 0.0;
    this.b = b ? b : 0.0;
    this.a = a !== undefined ? a : 1.0;
};

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
	a = a !== undefined ? a : 0xFF;
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
	a = a !== undefined ? a : 1.0;
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
 * Black color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.black = new VVGL.Color(0, 0, 0);

/**
 * Red color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.red = new VVGL.Color(1, 0, 0);

/**
 * Green color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.green = new VVGL.Color(0, 1, 0);

/**
 * Blue color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.blue = new VVGL.Color(0, 0, 1);

/**
 * Yellow color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.yellow = new VVGL.Color(1, 1, 0);

/**
 * Magenta color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.magenta = new VVGL.Color(1, 0, 1);

/**
 * Cyan color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.cyan = new VVGL.Color(0, 1, 1);

/**
 * White color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.white = new VVGL.Color(1, 1, 1);

/**
 * Convert color to hexa string format.
 *
 * @return {string}
 */
VVGL.Color.prototype.toString = function () {
    var colors = [this.r, this.g, this.b];
    var string = "#";

    for (var i in colors) {
        var color = Math.floor(colors[i] * 0x100);
        var elem = color.toString(16);
        if (elem.length === 1) {
            elem = "0" + elem;
        }
        string += elem;
    }

    return (string);
};
