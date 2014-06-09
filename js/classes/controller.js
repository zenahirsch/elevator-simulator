define(['./elevator', './floor', './passenger', './entity'], function (Elevator, Floor, Passenger, Entity) {
	var Controller = function () {
		this.elevators = [];
		this.floors = [];
		this.passengers = [];
		this.maxPassengers = 100;

		this.pickups = {};
		this.pickups.up = [];
		this.pickups.down = [];
	};

	Controller.prototype = new Entity();

	// The elevators controlled by this controller
	Controller.prototype.elevators = null;

	// The floors in the building
	Controller.prototype.floors = null;

	// The passengers in the building
	Controller.prototype.passengers = null;

	// The maximum number of passengers in the building
	Controller.prototype.maxPassengers = null;

	// Floors that have requested up or down elevators
	Controller.prototype.pickups = null;

	// Registers elevators to this controller
	Controller.prototype.registerElevators = function (num_elevators, controller) {
		for (var i = 0; i < num_elevators; i++) {
			this.elevators.push(new Elevator({
				id: i,
				capacity: 1000,
				speed: 1000
			}, this));

			this.elevators[i].setFloor(0);
			this.elevators[i].open();
			this.elevators[i].setDirectionUp();
		}
	};

	// Registers floors to this controller
	Controller.prototype.registerFloors = function (num_floors, controller) {
		for (var i = 0; i < num_floors; i++) {
			this.floors.push(new Floor({
				id: i
			}, this));
		}
	};

	// Register passenger to this controlller
	Controller.prototype.registerPassengers = function (num_passengers, controller) {
		for (var i = 0; i < num_passengers; i++) {
			this.passengers.push(new Passenger({
				id: i,
				name: 'Unnamed',
				weight: 100,
			}, this));

			this.passengers[i].doNotWait();
			this.passengers[i].setFloor(0);
		}
	};

	// Does updating all entities using a loop throw things out of sync?
	// Some entities will get updated before others, etc.
	Controller.prototype.updateAll = function () {
		var entities = [];

		var elevators = this.elevators;
		var floors = this.floors;
		var passengers = this.passengers;
		var controllers = this;

		entities = passengers.concat(floors, controllers, elevators);

		for (var i = 0; i < entities.length; i++) {
			entities[i].update();
		}

		console.log('Updated all entities.');
		console.log(entities);
	};

	// Get all pickups from the floors
	Controller.prototype.gatherPickups = function () {
		for (var i = 0; i < this.floors.length; i++) {
			if (this.floors[i].isRequestingUp()) {
				this.pickups.up.push(this.floors[i]);
			}

			if (this.floors[i].isRequestingDown()) {
				this.pickups.down.push(this.floors[i]);
			}

			if (this.floors[i].isRequestingBoth()) {
				this.pickups.up.push(this.floors[i]);
				this.pickups.down.push(this.floors[i]);
			}
		}
	};	

	// Sort the pickups by ascending floor order
	Controller.prototype.sortPickups = function () {
		this.pickups.up.sort(function (a, b) {
			return a.id > b.id ? 1 : -1;
		});

		this.pickups.down.sort(function (a, b) {
			return a.id > b.id ? 1 : -1;
		});
	};

	return Controller;
});