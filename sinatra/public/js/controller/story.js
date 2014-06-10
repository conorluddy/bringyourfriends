


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

			var 
			startLocationListener,
			UI = LA.store.ui;

			//Set the user messages
			$( UI.instruct_panel ).html( '<h4>' + LA.store.message.story.step1 + '</h4>' );
			$.mobile.resetActivePageHeight();


			//Add map listener to get the location requested
			startLocationListener = google.maps.event.addListener( LA.map, 'click', function(event) {	
				google.maps.event.removeListener( startLocationListener );

				$( '<div data-role="navbar"><ul><li><a href="#" class="Y">Confirm</a></li><li><a href="#" class="N">Cancel</a></li></ul></div>' )
					.prependTo( UI.instruct_panel )
					.navbar();

				// Update the page height and padding
				$.mobile.resetActivePageHeight();

				setTriggers( $( UI.instruct_panel ).find('.Y'), $( UI.instruct_panel ).find('.N') );

				//Clear any saved marker for this
				if ( LA.store.coordinates.startLocation !== null)
					LA.store.coordinates.startLocation.setMap(null);

				//Add marker for the last clicked/tapped location
				LA.store.coordinates.startLocation = LA.locations.marker.placeMarker( event.latLng, LA.store.marker.icon.startPoint );
				
				LA.store.coordinates.startLocation.lat = event.latLng.lat();
				LA.store.coordinates.startLocation.lon = event.latLng.lng();
			});

			function setTriggers ( yes_btn, no_btn ) {
				//Location is confirmed, move to next step
				yes_btn.one('click', function(event) {
					event.preventDefault();

					if ( LA.store.coordinates.startLocation !== null){
						
						window.setTimeout(function() { 
							LA.controller.story.askForDestinationLocation(); 
						}, 20);

					}
					
				});

				//Location is cancelled, remove the marker and wait for new selection
				no_btn.one('click', function(event) {
					event.preventDefault();

					LA.store.coordinates.startLocation.setMap(null);

					LA.controller.story.askForStartLocation();

				});				
			}

		},












		//Get the destination point of the trip
		//----
		askForDestinationLocation : function () {

			var 
			destinationLocationListener,
			UI = LA.store.ui;

			//Set the user messages
			$( UI.instruct_panel ).html( '<h4>' + LA.store.message.story.step2 + '</h4>' );
			$( UI.instruct_panel ).toolbar( "refresh" );


			//Add map listener to get the location requested
			destinationLocationListener = google.maps.event.addListener( LA.map, 'click', function(event) {
				google.maps.event.removeListener( destinationLocationListener );

				$( '<div data-role="navbar"><ul><li><a href="#" class="Y">Confirm</a></li><li><a href="#" class="N">Cancel</a></li></ul></div>' )
					.prependTo( UI.instruct_panel )
					.navbar();

				// Update the page height and padding
				$.mobile.resetActivePageHeight();

				//These are added dynamically so we need to find them
				setTriggers( $( UI.instruct_panel ).find('.Y'), $( UI.instruct_panel ).find('.N') );

				//Clear any saved marker for this
				if ( LA.store.coordinates.endLocation !== null)
					LA.store.coordinates.endLocation.setMap(null);

				//Add marker for the last clicked/tapped location
				LA.store.coordinates.endLocation = LA.locations.marker.placeMarker( event.latLng, LA.store.marker.icon.endPoint );
				LA.store.coordinates.endLocation.lat = event.latLng.lat();
				LA.store.coordinates.endLocation.lon = event.latLng.lng();

			});

			function setTriggers ( yes_btn, no_btn ) {

				//Destination is confirmed, move to next step
				yes_btn.one('click', function(event) {
					event.preventDefault();

					if ( LA.store.coordinates.endLocation !== null){
					
						window.setTimeout(function() { 
							LA.controller.story.getARoute( LA.store.coordinates.startLocation, LA.store.coordinates.endLocation ); 
						}, 300);

					}
					
				});
				
				//Location is cancelled, remove the marker and wait for new selection
				no_btn.one('click', function(event) {
					event.preventDefault();

					LA.store.coordinates.endLocation.setMap(null);

					LA.controller.story.askForDestinationLocation();

				});
			}

		},









		//Find a route from A to B
		//----
		getARoute : function ( pointA, pointB ) {

			var
			UI = LA.store.ui,
			directionsService = new google.maps.DirectionsService(),
			directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions: LA.maps.directions.style.polylineOpts });
			directionRequest = {
				origin: pointA.position,
				destination: pointB.position,
				travelMode: google.maps.TravelMode.DRIVING,
				provideRouteAlternatives: true
			};


			//Set the user messages
			$( UI.instruct_panel ).html( '<h4>' + LA.store.message.directions.getting + '</h4>' );
			$( UI.instruct_panel ).toolbar( "refresh" );


			directionsDisplay.setMap(LA.map);

			directionsService.route(directionRequest, function(response, status) {

				//Set the user messages
				$( UI.instruct_panel ).html( '<h4>' + LA.store.message.friends.pick + '</h4>' )
					.prepend('<a href="#" id="submit" class="ui-btn-right ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-check">Save Trip</a>')
					.toolbar( "refresh" );

				// Update the page height and padding
				$.mobile.resetActivePageHeight();

				if ( status == google.maps.DirectionsStatus.OK )
					directionsDisplay.setDirections( response );

				if ( typeof response.routes[0].overview_polyline.points !== 'undefined' ) 
					LA.store.trip.polyline = response.routes[0].overview_polyline.points;

				//Put friends on the map
				LA.controller.friends.showFriends();

				//TODO - move this
				LA.controller.story.doTripSubmit();

			});

		},











		//ToDo - get date and time

		//Get the name of the destination

		//Get the message to send with the invitation
		
		//Get the number of free seats














		doTripSubmit : function () {

			$('#submit').on( "click", function( event ) {
				event.preventDefault();

				//Put the JS objects in the hidden form fields
				LA.controller.trip.updateTripForm();

				$( "form" ).submit();
			});

		},








		//Start the story
		//----
		init : function () {
			LA.controller.story.askForStartLocation();
		}

};
















