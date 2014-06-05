ES.Controller = (function () {

	var Controller = function () {};

	// The elevators controlled by this controller
	Controller.prototype.elevators = [];

	// Move the specified elevator(s) to the specified floor
	Controller.prototype.moveElevators = function (elevator_ids_array, destination_floor) {
		for (var i = 0, l = elevator_ids_array.length; i < l; i++) {
			var elevator_id = elevator_ids_array[i];
			this.elevators[elevator_id].move(destination_floor);
		}
	};

	// Move the specified elevator(s) to the ground floor (floor 0)
	Controller.prototype.groundElevators = function (elevator_ids_array) {
		for (var i = 0, l = elevator_ids_array.length; i < l; i++) {
			var elevator_id = elevator_ids_array[i];
			this.elevators[elevator_id].toGround();
		}
	};

	// Move the specified elevator(s) to its default position
	Controller.prototype.defaultElevators = function (elevator_ids_array) {
		for (var i = 0, l = elevator_ids_array.length; i < l; i++) {
			var elevator_id = elevator_ids_array[i];
			this.elevators[elevator_id].toDefault();
		}
	};

	// Get the current floor of a given elevator
	Controller.prototype.getFloor = function (elevator_id) {
		return this.elevators[elevator_id].floor;
	};

	// Revoke given elevators' moving permission
	Controller.prototype.haltElevators = function (elevator_ids_array) {
		for (var i = 0, l = elevator_ids_array.length; i < l; i++) {
			var elevator_id = elevator_ids_array[i];
			this.elevators[elevator_id].halt();
		}
	};

	// Reinstate given elevators' moving permission
	Controller.prototype.resumeElevators = function (elevator_ids_array) {
		for (var i = 0, l = elevator_ids_array.length; i < l; i++) {
			var elevator_id = elevator_ids_array[i];
			this.elevators[elevator_id].resume();
		}
	};

	return Controller;

})();

var c = new ES.Controller;

var e1 = new ES.Elevator;
var e2 = new ES.Elevator;
var e3 = new ES.Elevator;

c.elevators = [e1, e2, e3];

c.defaultElevators([0, 1, 2]);

setTimeout(function () {
	c.haltElevators([0, 1, 2]);
}, 2000);

setTimeout(function () {
	c.resumeElevators([0, 1, 2]);
}, 7000);