define(function () {

	var Floor = function (id, controller) {
		this.id = id;
		this.controller = controller;

		this.passengers = [];
	};

	// The id of the floor (0 = ground level)
	Floor.prototype.id = null;

	// Has this floor requested an elevator?
	// 0: not requested
	// 1: up
	// -1: down
	Floor.prototype.elevatorRequest = 0;

	// Request a pickup to the controller
	Floor.prototype.requestPickup = function (direction) {
		if (direction === 1) {
			this.elevatorRequest = 1;
			this.controller.pickups.up.push(this);
		} else if (direction === -1) {
			this.elevatorRequest = -1;
			this.controller.pickups.down.push(this);
		}
	};

	// The passengers waiting for an eleator on this floor
	Floor.prototype.passengers = null;

	return Floor;

});