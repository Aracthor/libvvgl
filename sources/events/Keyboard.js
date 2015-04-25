/**
 * Static object regrouping keyboard functions.
 * 
 * @class
 */
VVGL.Keyboard = {};

VVGL.Keyboard.keysActuallyPressed = new Array(VVGL.KeyCode.MAX);


/**
 * To know if a key is actually pressed.
 * 
 * @static
 * @param {VVGL.KeyCode} key
 * @return {boolean}
 */
VVGL.Keyboard.keyIsPressed = function (key) {
	return (this.keysActuallyPressed.indexOf(key) !== -1);
};

/**
 * Add key from pressed list.
 * 
 * @private
 * @static
 * @param {VVGL.KeyCode} key
 */
VVGL.Keyboard.pressKey = function (key) {
	this.keysActuallyPressed.push(key);
};

/**
 * Remove key from pressed list.
 * 
 * @private
 * @static
 * @param {VVGL.KeyCode} key
 */
VVGL.Keyboard.releaseKey = function (key) {
	this.keysActuallyPressed.splice(this.keysActuallyPressed.indexOf(key), 1);
};
