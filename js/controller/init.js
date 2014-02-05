
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

			//Save these elements for global access
			LA.instruct_panel = $('#panel_instruct');
			LA.instruct_panel_msg = $('#panel_instruct span');
			LA.ok_btn = LA.instruct_panel.find('a');
			LA.confirm_panel = $('#panel_confirm');
			LA.confirm_panel_msg = $('#panel_confirm span');
			LA.yes_btn = LA.confirm_panel.find('.Y');
			LA.no_btn = LA.confirm_panel.find('.N');

		},

		//Set up the map and an array for the markers
		map : function () {

			LA.markers = [];

			LA.maps.initialise.map();			
			LA.maps.initialise.search();

		},

		locations : function () {

			LA.locations.locate.getOurLocation();
			
		}
};





/* When doc is ready, run */
jQuery(function($, window, document, undefined) {

	"use strict";

	LA.controller.init.map();

	LA.controller.init.locations();


	LA.controller.init.ui();

	LA.controller.story.init();


}(jQuery, window, document));


















