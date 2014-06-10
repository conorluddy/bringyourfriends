

// LiftApp (LA)
// ----

// Save the trip data




if (typeof LA === "undefined" || !LA) 
	window.LA = {};

if (typeof LA.store === "undefined" || !LA.store)
	window.LA.store = {};




// Location related methods
// ----
LA.store.trip = {

	startLat : 0,
	startLon : 0,
	//
	endLat : 0,
	endLon : 0,
	//
	startTime : 0,
	etaTime : 0,
	//
	invitees : null,
	seats : 4, //TODO - make option
	//
	polyline: ''

};





