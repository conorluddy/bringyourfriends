


//	LiftApp
//	----	
//	App control methods


if (typeof LA === "undefined" || !LA ) 
	window.LA = {};

if (typeof LA.controller === "undefined" || !LA.controller) 
	window.LA.controller = {};





// Initialise the application
// --------------------------
LA.controller.story = {



		//Get the starting point of the trip
		//----
		//1) Set your starting location
		askForStartLocation : function () {

			var startLocationListener;

			//Set the user messages
			LA.controller.setMsg.instruct( LA.store.message.story.step1 );
			LA.controller.setMsg.confirm( LA.store.message.confirm.step1 );
			LA.controller.setMsg.okBtn( LA.store.message.btn.k );
			LA.controller.setMsg.yesBtn( LA.store.message.btn.y );
			LA.controller.setMsg.noBtn( LA.store.message.btn.n );

			//Hide the instruction panel on 'OK' click
			LA.store.ui.ok_btn.one('click', function(event) {
				event.preventDefault();
				LA.store.ui.instruct_panel.addClass('away');
			});

			//Add map listener to get the location requested
			startLocationListener = google.maps.event.addListener( LA.map, 'click', function(event) {	

				//Show the confirmation panel when a location is selected
				LA.store.ui.confirm_panel.removeClass('away');

				//Clear any saved marker for this
				if ( LA.store.coordinates.startLocation !== null)
					LA.store.coordinates.startLocation.setMap(null);

				//Add marker for the last clicked/tapped location
				LA.store.coordinates.startLocation = LA.locations.marker.placeMarker( event.latLng, LA.store.marker.icon.startPoint );

			});

			//Location is confirmed, move to next step
			LA.store.ui.yes_btn.one('click', function(event) {
				event.preventDefault();

				if ( LA.store.coordinates.startLocation !== null){
					
					LA.store.ui.confirm_panel.addClass('away');

					LA.store.ui.no_btn.off('click');

					google.maps.event.removeListener( startLocationListener );

					window.setTimeout(function() { 
						LA.controller.story.askForDestinationLocation(); 
					}, 20);
				}
				
			});

			//Location is cancelled, remove the marker and wait for new selection
			LA.store.ui.no_btn.on('click', function(event) {
				event.preventDefault();

				LA.store.coordinates.startLocation.setMap(null);

				LA.store.ui.confirm_panel.addClass('away');
			});
		},












		//Get the destination point of the trip
		//----
		askForDestinationLocation : function () {

			var destinationLocationListener;

			//Set the user messages
			LA.controller.setMsg.instruct( LA.store.message.story.step2 );
			LA.controller.setMsg.confirm( LA.store.message.confirm.step2 );
			LA.controller.setMsg.okBtn( LA.store.message.btn.k2 );
			LA.controller.setMsg.yesBtn( LA.store.message.btn.y2 );
			LA.controller.setMsg.noBtn( LA.store.message.btn.n2 );

			LA.store.ui.instruct_panel.removeClass('away');

			LA.store.ui.ok_btn.one('click', function(event) {
				event.preventDefault();
				LA.store.ui.instruct_panel.addClass('away');
			});

			//Add map listener to get the location requested
			destinationLocationListener = google.maps.event.addListener( LA.map, 'click', function(event) {	

				//Show the confirmation panel when a location is selected
				LA.store.ui.confirm_panel.removeClass('away');

				//Clear any saved marker for this
				if ( LA.store.coordinates.endLocation !== null)
					LA.store.coordinates.endLocation.setMap(null);

				//Add marker for the last clicked/tapped location
				LA.store.coordinates.endLocation = LA.locations.marker.placeMarker( event.latLng, LA.store.marker.icon.endPoint );

			});

			//Destination is confirmed, move to next step
			LA.store.ui.yes_btn.one('click', function(event) {
				event.preventDefault();

				if ( LA.store.coordinates.endLocation !== null){
					
					LA.store.ui.confirm_panel.addClass('away');

					LA.store.ui.no_btn.off('click');

					google.maps.event.removeListener( destinationLocationListener );

					window.setTimeout(function() { 
						LA.controller.story.getARoute( LA.store.coordinates.startLocation, LA.store.coordinates.endLocation ); 
					}, 300);
				}
				
			});
			
			//Location is cancelled, remove the marker and wait for new selection
			LA.store.ui.no_btn.on('click', function(event) {
				event.preventDefault();

				LA.store.coordinates.endLocation.setMap(null);

				LA.store.ui.confirm_panel.addClass('away');
			});


		},









		//Find a route from A to B
		//----
		getARoute : function ( pointA, pointB ) {

			var
			directionsService = new google.maps.DirectionsService(),
			directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions: LA.maps.directions.style.polylineOpts });
			directionRequest = {
				origin: pointA.position,
				destination: pointB.position,
				travelMode: google.maps.TravelMode.DRIVING,
				provideRouteAlternatives: true
			};

			directionsDisplay.setMap(LA.map);

			directionsService.route(directionRequest, function(response, status) {

				if ( status == google.maps.DirectionsStatus.OK )
					directionsDisplay.setDirections( response );

				//Put friends on the map
				LA.controller.friends.showFriends();

				//TODO - move this
				LA.controller.story.doTripSubmit();

			});

		},








		doTripSubmit : function () {



			$( "form" ).on( "submit", function( event ) {
				event.preventDefault();
				//Put the JS objects in the hidden form fields
				LA.controller.trip.updateTripForm();
				this.submit();
			});

		},





		//Start the story
		//----
		init : function () {
			LA.controller.story.askForStartLocation();
		}

};
















