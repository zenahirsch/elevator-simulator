define(function () {
	var Entity = function (id) {
		this.id = id;
		this.behaviors = [];
	};

	Entity.prototype.registerBehavior = function (behavior) {
		this.behaviors.push(behavior);
	};

	Entity.prototype.update = function () {
		for (var i = 0, l = this.behaviors.length; i < l; i++) {
			this.behaviors[i].action.call(this);
		}
	};

	return Entity;
});