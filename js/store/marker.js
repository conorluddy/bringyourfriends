/*

	LiftApp (LA)
	
	Location helpers

 */


if (typeof LA === "undefined" || !LA)
	window.LA = {};

if (typeof LA.store === "undefined" || !LA.store)
	window.LA.store = {};



/*
Location related methods
 */
LA.store.marker = {

	icon: {

		startPoint: {
			url: 'img/markers/play.png',
			size: new google.maps.Size(32, 32),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(16, 16),
			scaledSize: new google.maps.Size(32, 32)
		},
		dude: {
			url: 'img/markers/dude.png',
			size: new google.maps.Size(32, 32),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(16, 16),
			scaledSize: new google.maps.Size(32, 32)
		},
		endPoint: {
			url: 'img/markers/finish.png',
			size: new google.maps.Size(32, 32),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(16, 16),
			scaledSize: new google.maps.Size(32, 32)
		},
		defaultMarker: {
			url: 'img/markers/default.png'
			// size: new google.maps.Size(32, 32),
			// origin: new google.maps.Point(0, 0),
			// anchor: new google.maps.Point(16, 16),
			// scaledSize: new google.maps.Size(32, 32)
		}


	}

};