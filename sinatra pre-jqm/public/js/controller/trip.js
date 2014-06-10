
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
		$('#trip-startLat').val( LA.store.coordinates.startLocation.position.d );
		$('#trip-startLon').val( LA.store.coordinates.startLocation.position.e );

		//End point
		$('#trip-endLat').val( LA.store.coordinates.endLocation.position.d );
		$('#trip-endLon').val( LA.store.coordinates.endLocation.position.e );

		//Create Invitees ID string
		$(LA.store.invitees).each( function(index, invitee) {
			//Add a comma if it's not the first ID
			inviteeIDs += first ? '' : ',';
			inviteeIDs += invitee.id;
			first = false;
		});		
		$('#trip-invitees').val( inviteeIDs );


		// $('#trip-startTime').val(  );
		// $('#trip-etaTime').val(  );
		// $('#trip-seats').val(  );
	}

};


