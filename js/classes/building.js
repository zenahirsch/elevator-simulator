define(['./floor'], function (Floor) {

	var Building = function () {};

	// The floors contained within this building
	Building.prototype.floors = [];

	// Register floors to this building
	Building.prototype.registerFloors = function (num_floors) {
		for (var i = 0; i < num_floors; i++) {
			this.floors.push(new Floor());
		}
	};

	// Remove a random passenger from floor 0,
	// who has destination set to 0
	// This passenger has left the building
	Building.prototype.exitPassenger = function () {
		var passengers = this.passengers;
		var first_floor = this.floors[0];
		for (var i = 0, l = passengers.length; i < l; i++) {
			if (passengers[i].floor === first_floor && passengers[i].destination === first_floor) {
				passengers.splice(i);
			}
		}
	};

	return Building;

});