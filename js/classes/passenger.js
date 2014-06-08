define(['./entity'], function (Entity) {
	var Passenger = function (params, controller) {
		this.id = params.id;
		this.name = params.name;
		this.weight = params.weight;
		this.floor = params.floor;

		this.controller = controller;
	};

	Passenger.prototype = new Entity();

	Passenger.prototype.NOT_WAITING = 0;
	Passenger.prototype.WAITING = 1;
	Passenger.prototype.RIDING = 2;

	Passenger.prototype.UP = 1;
	Passenger.prototype.DOWN = -1;

	// The passenger's desired destination
	Passenger.prototype.destination = null;

	// The passenger's weight (pounds)
	Passenger.prototype.weight = 130;

	// Passenger status
	// 0: Not waiting
	// 1: Waiting
	// 2: Entering elevator
	// 3: Riding
	// 4: Exiting
	Passenger.prototype.state = null;

	// The current floor of the passenger
	Passenger.prototype.floor = null;

	// Is this passenger going up?
	Passenger.prototype.isGoingUp = function () {
		if (this.direction === this.UP) {
			return true;
		} else {
			return false;
		}
	};

	// Is this passenger going down?
	Passenger.prototype.isGoingDown = function () {
		if (this.direction === this.DOWN) {
			return true;
		} else {
			return false;
		}
	};

	// Is this passenger waiting?
	Passenger.prototype.isWaiting = function () {
		if (this.state === this.WAITING) {
			return true;
		} else {
			return false;
		}
	};

	return Passenger;
});