

// LiftApp (LA)
// ----

// Location helpers




if (typeof LA === "undefined" || !LA) 
	window.LA = {};

if (typeof LA.store === "undefined" || !LA.store)
	window.LA.store = {};




// Location related methods
// ----
LA.store.coordinates = {

	//The location of the device
	ourLocation: null,

	//Beginning of the trip
	startLocation: null,
	
	//Destination of the trip
	endLocation: null

};

