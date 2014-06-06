define(function () {

	var Passenger = function () {};

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

	// Take the stairs instead, which sets passenger status to -1
	Passenger.prototype.takeStairs = function () {
		this.status = -1;
		this.floor = null;
		this.elevator = null;
	};

	return Passenger;

});