
/*

	LiftApp
	
	App control methods

 */


if (typeof LA === "undefined" || !LA ) 
	window.LA = {};

if (typeof LA.controller === "undefined" || !LA.controller) 
	window.LA.controller = {};




/*
Initialise the application 
*/
LA.controller.init = {

		//Hook JS to UI elements
		ui : function () {

		},

		//Set up the map and an array for the markers
		map : function () {

			LA.markers = [];
			LA.maps.initialise.map();			
			LA.maps.initialise.search();

		},

		locations : function () {

			LA.locations.locate.getOurLocation();
			
		},

		friends : function () {

			LA.controller.friends.getJSON();
			
		},

		notifications : function () {

			LA.controller.notifications.getJSON();

		}
};





/* When doc is ready, run */
jQuery(function($, window, document, undefined) {

	"use strict";



	//Map page
	if ( $('#map-canvas').length ) {
		
		LA.controller.init.map();

		LA.controller.init.locations();

		LA.controller.init.friends();

		LA.controller.init.notifications();

		LA.controller.init.ui();

		LA.controller.story.init();

	}

}(jQuery, window, document));


















