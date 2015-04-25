/**
 * Something that you can select or unselect.
 * 
 * @interface
 */
VVGL.IBindable = function () {};

VVGL.IBindable.prototype.bind = function () {
	throw new VVGL.ImplementationException(this, "bind", "IBindable");
};

VVGL.IBindable.prototype.unbind = function () {
	throw new VVGL.ImplementationException(this, "unbind", "IBindable");
};
