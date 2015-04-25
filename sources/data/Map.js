/**
 * Associative array.
 * 
 * @class Associative array.
 * @constructor
 */
VVGL.Map = function () {};

/**
 * Key list
 * 
 * @type {Array}
 */
VVGL.Map.prototype.keys = [];

/**
 * Values list
 * 
 * @type {Array}
 */
VVGL.Map.prototype.values = [];

/**
 * Add new set of key/value.
 * 
 * @param {Object} key The element's key
 * @param {Object} value The element's value
 */
VVGL.Map.prototype.add = function (key, value) {
	this.keys.push(key);
	this.values.push(value);
};

/**
 * Return a value associated with a key.
 * 
 * @param {Object} key The key to search.
 * @return {Object} The associated value, or null if there is no associated value.
 */
VVGL.Map.prototype.getFromKey = function (key) {
	var index = 0;
	var value = null;
	
	while (index < this.keys.length && this.keys[index] != key) {
		++index;
	}
	
	if (index < this.keys.length) {
		value = this.values[index];
	}
	
	return (value);
};

/**
 * Return a key associated with a value.
 * 
 * @param {Object} value The value to search.
 * @return {Object} The associated key, or null if there is no key value.
 */
VVGL.Map.prototype.getFromValue = function (value) {
	var index = 0;
	var key = null;
	
	while (index < this.values.length && this.values[index] != value) {
		++index;
	}
	
	if (index < this.values.length) {
		key = this.keys[index];
	}
	
	return (key);
};

VVGL.Map.prototype.getLength = function () {
	return (this.keys.length);
};
