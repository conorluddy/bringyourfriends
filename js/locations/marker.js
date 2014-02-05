
/*

	LiftApp
	
	Location helpers

 */


if (typeof LA.locations === "undefined" || !LA.locations) 
	window.LA.locations = {};




/*
Marker related methods
*/
LA.locations.marker = {


		/*
		Place a marker on a location
		*/
		placeMarker: function( location, icon ) {

			if ( typeof icon === 'undefined' ) icon = LA.store.marker.icon.defaultMarker;

			var marker = new google.maps.Marker({

				position: location,
				map: LA.map,
				icon: icon

			});

			return marker;

		}




};