/**
 * Static object regrouping mouse functions.
 * 
 * @class
 */
VVGL.Mouse = {};

VVGL.Mouse.buttonsActuallyPressed = new Array(VVGL.MouseButton.MAX);


/**
 * To know if a mouse button is actually pressed.
 * 
 * @static
 * @param {VVGL.MouseButton} button
 * @return {boolean}
 */
VVGL.Mouse.buttonIsPressed = function (button) {
	return (this.buttonsActuallyPressed.indexOf(button) !== -1);
};

/**
 * To know if the mouse cursor is locked.
 * 
 * @type {boolean}
 * @static
 * @readonly
 */
VVGL.Mouse.isLocked = false;

/**
 * Add button from pressed list.
 * 
 * @private
 * @static
 * @param {VVGL.MouseButton} button
 */
VVGL.Mouse.pressButton = function (button) {
	this.buttonsActuallyPressed.push(button);
};

/**
 * Remove button from pressed list.
 * 
 * @private
 * @static
 * @param {VVGL.MouseButton} button
 */
VVGL.Mouse.releaseButton = function (button) {
	this.buttonsActuallyPressed.splice(this.buttonsActuallyPressed.indexOf(button), 1);
};
