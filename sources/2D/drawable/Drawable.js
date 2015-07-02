/**
 * Represent a drawable object.
 * 
 * @interface
 */
VVGL.Drawable = function () {};

/**
 * Render object to context.
 * 
 * @abstract
 * @param {HTMLContext} context
 */
VVGL.Drawable.prototype.render = function (context) {
	throw new Error("Missing draw implementation of Drawable object.");
};
