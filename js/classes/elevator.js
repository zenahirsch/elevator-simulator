ES.Elevator = (function () {
	var Elevator = function () {};

	// The capacity of the elevator in pounds
	Elevator.prototype.capacity = 500;

	// The current floor index of the elevator
	// 0 is the ground floor
	Elevator.prototype.floor = 10;

	// The default floor index for this elevator
	Elevator.prototype.default_floor = 0;

	// The time (in milliseconds) to travel one floor
	Elevator.prototype.speed = 1000;

	// Whether the elevator has permission to move
	Elevator.prototype.can_move = true;

	// Move to the given floor, and return the current floor index
	Elevator.prototype.move = function (destination_floor) {
		var direction = null;

		if (destination_floor < this.floor) {
			direction = -1;
		} else if (destination_floor > this.floor) {
			direction = 1;
		} else {
			direction = 0;
			console.log('Already there!');
			return this.floor;
		}

		var that = this;

		console.log('Leaving floor: ' + that.floor);

		var t = setInterval(function () {

			if (that.can_move) {
				if (direction === 1) {
					that.floor++;
				} else if (direction === -1) {
					that.floor--;
				}

				if (destination_floor === that.floor) {
					console.log('Arrived at destination floor: ' + that.floor);
					clearInterval(t);
					return that.floor;
				} else {
					console.log('Arrived at floor: ' + that.floor);
				}
			}

		}, this.speed);
	};

	// Revoke elevator's moving permission
	Elevator.prototype.halt = function () {
		this.can_move = false;
		console.log('Revoked ability for elevator to move');
		console.log('The current floor: ' + this.floor);
	};

	// Reinstate elevator's moving permission
	Elevator.prototype.resume = function () {
		this.can_move = true;
		console.log('Reinstated ability for elevator to move');
	}

	// Move the elevator to the ground floor (floor 0)
	Elevator.prototype.toGround = function () {
		return this.move(0);
	};

	// Move the elevator to its default floor 
	Elevator.prototype.toDefault = function () {
		return this.move(this.default_floor);
	}

	return Elevator;
})();