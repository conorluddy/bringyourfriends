/*

	LiftApp (LA)
	
	Location helpers

 */


if (typeof LA.locations === "undefined" || !LA.locations)
	window.LA.locations = {};



/*
Location related methods
 */
LA.locations.locate = {


		/*
		Set the start point for the trip	
		 */
		setStartPoint: function() {

		},




		/*
		Set the end point for the trip	
		 */
		setEndPoint: function() {

		},




		
		/*
		Return the coordinates of the users current location if possible
		 */
		getOurLocation: function() {

			var
			fallbackLocation = new google.maps.LatLng( 53.27055, -9.05666 ),
			ourLocation,
			browserSupportFlag = false;
			///


			// Try W3C Geolocation (Preferred)
			if (navigator.geolocation) {
				browserSupportFlag = true;

				navigator.geolocation.getCurrentPosition(function(position) {

					ourLocation = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
					
					LA.store.coordinates.ourLocation = ourLocation;
					
					LA.map.setCenter( ourLocation );

					// LA.store.coordinates.startLocation = LA.locations.marker.placeMarker( ourLocation, LA.store.marker.icon.startPoint );

				}, function() {
					LA.map.setCenter( fallbackLocation );	
				});
			}

			// Browser doesn't support Geolocation
			else {
				LA.map.setCenter( fallbackLocation );
			}	

		}
};




















