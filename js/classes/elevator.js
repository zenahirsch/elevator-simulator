define(['./entity'], function (Entity) {
	var Elevator = function (params, controller) {
		this.id = params.id;
		this.capacity = params.capacity;
		this.speed = params.speed;

		this.controller = controller;

		this.passengers = [];
	};

	Elevator.prototype = new Entity();

	Elevator.prototype.STOP = 0;
	Elevator.prototype.MOVING = 1;
	Elevator.prototype.OPEN = 2;

	Elevator.prototype.UP = 1;
	Elevator.prototype.DOWN = -1;

	// The controller for this elevator
	Elevator.prototype.controller = null;

	// The id of this elevator 
	Elevator.prototype.id = null;

	// The capacity of the elevator in pounds
	Elevator.prototype.capacity = null;

	// The passengers currently riding in this elevator
	Elevator.prototype.passengers = null;

	// The current floor of the elevator
	Elevator.prototype.floor = null;

	// The next destination of the elevator
	Elevator.prototype.destination = null;

	// The pickup location received from the controller
	Elevator.prototype.pickup = null;

	// The time (in milliseconds) to travel one floor
	Elevator.prototype.speed = null;

	// State of the elevator
	Elevator.prototype.state = null;

	// The direction of the elevator
	Elevator.prototype.direction = null;

	// Set direction UP
	Elevator.prototype.setDirectionUp = function () {
		this.direction = this.UP;
	};

	// Set direction DOWN
	Elevator.prototype.setDirectionDown = function () {
		this.direction = this.DOWN;
	};

	// Reverse direction
	Elevator.prototype.reverseDirection = function () {
		if (this.direction === this.UP) {
			this.direction = this.DOWN;
		} else if (this.direction === this.DOWN) {
			this.direction = this.UP;
		}
	};

	// Return destination floor
	Elevator.prototype.getDestination = function () {
		return this.destination;
	};

	// Set the destination for this elevator
	Elevator.prototype.setDestination = function (floor) {
		this.destination = floor;
	};

	// Is there a destination set for this elevator?
	Elevator.prototype.hasDestination = function () {
		if (this.destination != null) {
			return true;
		} else {
			return false;
		}
	};

	// Return the current direction of the elevator
	Elevator.prototype.getDirection = function () {
		return this.direction;
	};

	// Is the elevator going up?
	Elevator.prototype.isGoingUp = function () {
		if (this.direction === this.UP) {
			return true;
		} else {
			return false;
		}
	};

	// Is the elevator going down?
	Elevator.prototype.isGoingDown = function () {
		if (this.direction === this.DOWN) {
			return true;
		} else {
			return false;
		}
	};

	// Return the current state of the elevator
	Elevator.prototype.getState = function () {
		return this.state;
	}; 

	// Is the elevator stopped?
	Elevator.prototype.isStopped = function () {
		if (this.state === this.STOP) {
			return true;
		} else {
			return false;
		}
	};

	// Is the elevator open?
	Elevator.prototype.isOpen = function () {
		if (this.state === this.OPEN) {
			return true;
		} else {
			return false;
		}
	};
  
	// Is the elevator at its destination?
	Elevator.prototype.isAtDestination = function () {
		if (this.floor === this.destination) {
			return true;
		} else {
			return false;
		}
	};

	// Are there passengers riding this elevator?
	Elevator.prototype.hasPassengers = function () {
		if (this.passengers.length > 0) {
			return true;
		} else {
			return false;
		}
	};

	// Clear the destination
	Elevator.prototype.clearDestination = function () {
		this.destination = null;
	};

	// Return the current floor
	Elevator.prototype.getFloor = function () {
		return this.floor;
	};

	// Is the elevator on the given floor?
	Elevator.prototype.isOnFloor = function (floor) {
		if (this.floor === floor) {
			return true;
		} else {
			return false;
		}
	};

	// Set the floor of the elevator
	Elevator.prototype.setFloor = function (floor_id) {
		this.floor = this.controller.floors[floor_id];
	};

	// Move one floor in the elevator's direction
	Elevator.prototype.move = function () {
		this.state = this.MOVING;
		this.floor = this.controller.floors[this.floor.id + this.direction];
		return true;
	};

	// Stop moving
	Elevator.prototype.stop = function () {
		this.state = this.STOP;
		return true;
	};

	// Open doors and allow passengers in
	Elevator.prototype.open = function () {
		if (this.state != this.MOVING) {
			this.state = this.OPEN;
			return true;
		} else {
			return false;
		}
	};	

	// Close doors
	Elevator.prototype.close = function () {
		if (this.state === this.OPEN) {
			this.state = this.STOP;
			return true;
		} else {
			return false;
		}
	};

	// Set nearest pickup (in correct direction) from controller
	Elevator.prototype.setPickup = function () {
		var d = '';
		this.getDirection() === this.UP ? d = 'up' : d = 'down';
		this.controller.sortPickups();

		var pickups = this.controller.pickups[d];
		var cur_floor_id = this.floor.id;
		var closest_floor = null;

		for (var i = 0; i < pickups.length; i++) {
			if (pickups[i].id >= cur_floor_id) {
				this.pickup = pickups[i];
				return true;
			}
		}

		return false;
	};

	// Return the current pickup destiantion
	Elevator.prototype.getPickup = function () {
		return this.pickup;
	};

	// Is there a pickup set for this elevator?
	Elevator.prototype.hasPickup = function () {
		if (this.pickup != null) {
			return true;
		} else {
			return false;
		}
	};

	return Elevator;
});