define(function () {
	var Behavior = function (id, action) {
		this.id = id;
		this.action = action;
	};

	// The id of the behavior
	Behavior.prototype.id = null;

	// The function that is the action of the behavior
	Behavior.prototype.action = null;

	return Behavior;
});