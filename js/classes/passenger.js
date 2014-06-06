define(['./entity'], function (Entity) {
	var Passenger = function (params) {
		this.id = params.id;
		this.weight = params.weight;
	};

	Passenger.prototype = new Entity();

	// The passenger's desired destination
	Passenger.prototype.destination = null;

	// The passenger's weight (pounds)
	Passenger.prototype.weight = 130;

	// Passenger status
	// 0: Waiting for elevator
	// 1: Riding elevator
	// -1: Not waiting (not on elevator)
	Passenger.prototype.status = 0;

	// The current floor of the passenger
	Passenger.prototype.floor = null;

	// Elevator that the passenger is currently riding, if any
	Passenger.prototype.elevator = null;

	return Passenger;
});