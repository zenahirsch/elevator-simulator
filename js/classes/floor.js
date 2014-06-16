define(['./entity'], function (Entity) {
	var Floor = function (params, controller) {
		this.id = params.id;
		this.img_x = params.x;
		this.img_y = params.y;
		
		this.controller = controller;

		this.passengers = [];
	};

	Floor.prototype = new Entity();

	/* 
	 * The X and Y position of the floor on the canvas
	 * Each floor is 2000px wide and 800px tall
	 */
	Floor.prototype.img_x = null;
	Floor.prototype.img_y = null;

	// Floor states
	Floor.prototype.NONE_REQUEST = 0;
	Floor.prototype.UP_REQUEST = 1;
	Floor.prototype.DOWN_REQUEST = -1;
	Floor.prototype.BOTH_REQUEST = 2;

	/* Has this floor requested an elevator?
	 * 0: not requested
	 * 1: requested up
	 * -1: requested down
	 * 2: requested both
	 */
	Floor.prototype.state = null;

	// The passengers waiting for an eleator on this floor
	Floor.prototype.passengers = null;

	// Request a pickup to the controller
	Floor.prototype.requestPickup = function (direction) {
		if (direction === this.UP_REQUEST) {

			if (this.state === this.UP_REQUEST || this.state === this.DOWN_REQUEST) {
				this.state = this.BOTH_REQUEST;
			} else {
				this.state = this.UP_REQUEST;
			}

			this.controller.pickups.up.push(this);

		} else if (direction === this.DOWN_REQUEST) {

			if (this.state === this.UP_REQUEST || this.state === this.DOWN_REQUEST) {
				this.state = this.BOTH_REQUEST;
			} else {
				this.state = this.DOWN_REQUEST;
			}

			this.controller.pickups.down.push(this);

		}

		return this;
	};

	// Make an up request
	Floor.prototype.requestUp = function () {
		this.state = this.UP_REQUEST;
		return this;
	};

	// Make a down request
	Floor.prototype.requestDown = function () {
		this.state = this.DOWN_REQUEST;
		return this;
	};

	// Make a both request
	Floor.prototype.requestBoth = function () {
		this.state = this.BOTH_REQUEST;
		return this;
	};

	// Get the state of the floor
	Floor.prototype.getState = function () {
		return this.state;
	};

	// Is this floor requesting up?
	Floor.prototype.isRequestingUp = function () {
		if (this.state === this.UP_REQUEST) {
			return true;
		} else {
			return false;
		}
	};

	// Is this floor requesting down?
	Floor.prototype.isRequestingDown = function () {
		if (this.state === this.DOWN_REQUEST) {
			return true;
		} else {
			return false;
		}
	};

	// Is this floor requesting up and down?
	Floor.prototype.isRequestingBoth = function () {
		if (this.state === this.BOTH_REQUEST) {
			return true;
		} else {
			return false;
		}
	};

	// Clear all requests on this floor
	Floor.prototype.clearRequests = function () {
		this.state = this.NONE_REQUEST;
		return this;
	};

	// Are there waiting passengers for the specified direction?
	Floor.prototype.hasWaitingPassengers = function (direction) {
		var passengers = this.passengers;

		if (direction === 1) {
			for (var i = 0; i < passengers.length; i++) {
				if (passengers[i].isWaiting() && passengers[i].isGoingUp()) {
					return true;
				}
			}
			return false;
		} else if (direction === -1) {
			for (var i = 0; i < passengers.length; i++) {
				if (passengers[i].isWaiting() && passengers[i].isGoingDown()) {
					return true;
				}
			}
			return false;
		}
	};

	// Return array of waiting passengers on this floor
	Floor.prototype.getWaitingPassengers = function () {
		var waiting_passengers = [];
		for (var i = 0; i < this.passengers.length; i++) {
			if (this.passengers[i].isWaiting()) {
				waiting_passengers.push(this.passengers[i]);
			}
		}
		return waiting_passengers;
	};

	// Return an array of elevators currently on this floor 
	Floor.prototype.getElevators = function () {
		var elevators = this.controller.elevators;
		var local_elevators = [];
		for (var i = 0; i < elevators.length; i++) {
			if (elevators[i].floor === this) {
				local_elevators.push(elevators[i]);
			}
		}

		return local_elevators;
	};

	return Floor;
});