
/*

	LiftApp
	
	Map methods

 */

if (typeof LA.maps === "undefined" || !LA.maps) 
	window.LA.maps = {};



/*
Initialise the map
*/
LA.maps.initialise = {


		/*
		Set up the map
		 */
		map: function() {

			var mapOptions = {
				center: new google.maps.LatLng(-34.397, 150.644),
				zoom: 17,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				styles: LA.maps.styles
			};

			LA.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

		},


		/*
		Set up the search box
		 */
		search: function() {

			var
			image,
			marker,
			markers = [],
			map = LA.map,
			input = /** @type {HTMLInputElement} */ (document.getElementById('pac-input'));// Create the search box and link it to the UI element.

			map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

			var searchBox = new google.maps.places.SearchBox( /** @type {HTMLInputElement} */ (input));

			// Listen for the event fired when the user selects an item from the
			// pick list. Retrieve the matching places for that item.
			google.maps.event.addListener(searchBox, 'places_changed', function() {

					places = searchBox.getPlaces();

					for ( i = 0; i < markers.length; i++ ) {
						marker = markers[i];
						marker.setMap(null);
					}

					// For each place, get the icon, place name, and location.
					markers = [];

					var bounds = new google.maps.LatLngBounds();

					for (var i = 0, place; place = places[i]; i++) {

						image = {
							// url: place.icon,
							url: LA.store.marker.icon.defaultMarker,
							size: new google.maps.Size(32, 46),
							origin: new google.maps.Point(0, 0),
							anchor: new google.maps.Point(16, 46),
							scaledSize: new google.maps.Size(32, 46)
						};

						// Create a marker for each place.
						marker = new google.maps.Marker({
							map: map,
							icon: image,
							title: place.name,
							position: place.geometry.location
						});

						markers.push(marker);
						bounds.extend(place.geometry.location);


					}

					map.fitBounds(bounds);

			});

			// Bias the SearchBox results towards places that are within the bounds of the
			// current map's viewport.
			google.maps.event.addListener(map, 'bounds_changed', function() {
				var bounds = map.getBounds();
				searchBox.setBounds(bounds);
			});

	}

};













