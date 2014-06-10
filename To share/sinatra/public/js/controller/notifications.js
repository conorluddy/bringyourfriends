
/*

	LiftApp
	
	Update messages on the UI

 */


if (typeof LA === "undefined" || !LA ) 
	window.LA = {};

if (typeof LA.controller === "undefined" || !LA.controller) 
	window.LA.controller = {};




LA.controller.notifications = {

		//Get friend data JSON
		//----
		getJSON : function ( ) {

			$.getJSON( "/invitecount.json", function( data ) {

				LA.store.notifications.count = data;



				//TODO - make this a regular/live check
				if ( $('header .notifications').length ) $('header .notifications').html( 'Notifications: ' + data );

			});

		}




};


