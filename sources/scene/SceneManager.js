/**
 * Manager of scenes selection.
 * 
 * @class Manager of scenes selection.
 * @constructor
 * @private
 */
VVGL.SceneManager = function () {
	this.scenes = new VVGL.Map();
	this.currentScene = null;
};

/**
 * Add a new scene to list.
 * 
 * @param {string} scene Scene name.
 * @param {VVGL.Scene} scene New scene to add to list.
 * @param {Boolean} select The new scene is now the current one if this param is true. Set to false if undefined.
 */
VVGL.SceneManager.prototype.addScene = function(name, scene, select) {
	select = VVGL.setIfUndefined(select, false);
	
	this.scenes.add(name, scene);
	if (select) {
		this.currentScene = scene;
	}
};

/**
 * Return last selectioned scene, or null if no scene is selectioned.
 * 
 * @return {VVGL.Scene} Last selectioned scene, or null if no scene is selectioned.
 */
VVGL.SceneManager.prototype.getCurrentScene = function () {
	return (this.currentScene);
};
