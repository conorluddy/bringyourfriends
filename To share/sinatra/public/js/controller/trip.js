
/*

	LiftApp
	
	Update messages on the UI

 */


if (typeof LA === "undefined" || !LA ) 
	window.LA = {};

if (typeof LA.controller === "undefined" || !LA.controller) 
	window.LA.controller = {};




LA.controller.trip = {

	updateTripForm : function () {

		var
		inviteeIDs = "",
		first = true;

		//Start point
		$('#trip-startLat').val( LA.store.coordinates.startLocation.lat );
		$('#trip-startLon').val( LA.store.coordinates.startLocation.lon );

		//End point
		$('#trip-endLat').val( LA.store.coordinates.endLocation.lat );
		$('#trip-endLon').val( LA.store.coordinates.endLocation.lon );

		//Hopefully we can use this to trace a route on the static maps...TODO
		$('#trip-polyline').val( LA.store.trip.polyline );

		//Create Invitees ID string
		$(LA.store.invitees).each( function(index, invitee) {
			//Add a comma if it's not the first ID
			inviteeIDs += first ? '' : ',';
			inviteeIDs += invitee.id;
			first = false;
		});		

		$('#trip-invitees').val( inviteeIDs );
		
	}

};


