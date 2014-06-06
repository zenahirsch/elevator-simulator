define(['./elevator', './floor', './entity'], function (Elevator, Floor) {
	var Controller = function () {
		this.elevators = [];
		this.floors = [];

		this.pickups = {};
		this.pickups.up = [];
		this.pickups.down = [];

		this.claimedPickups = {};
		this.claimedPickups.up = [];
		this.claimedPickups.down = [];
	};

	// The elevators controlled by this controller
	Controller.prototype.elevators = null;

	// The floors in the building
	Controller.prototype.floors = null;

	// Floors that have requested up or down elevators
	Controller.prototype.pickups = null;

	// Pickups that are currently claimed (owned as destination) by an elevator, not yet picked up
	Controller.prototype.claimedPickups = null;

	// Registers elevators to this controller
	Controller.prototype.registerElevators = function (num_elevators, controller) {
		for (var i = 0; i < num_elevators; i++) {
			this.elevators.push(new Elevator({
				id: i,
				capacity: 1000,
				speed: 1000
			}, this));
		}
	};

	// Registers floors to this controller
	Controller.prototype.registerFloors = function (num_floors, controller) {
		for (var i = 0; i < num_floors; i++) {
			this.floors.push(new Floor(i, this));
		}
	};

	return Controller;

});