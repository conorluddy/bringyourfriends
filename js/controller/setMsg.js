
/*

	LiftApp
	
	Update messages on the UI

 */


if (typeof LA === "undefined" || !LA ) 
	window.LA = {};

if (typeof LA.controller === "undefined" || !LA.controller) 
	window.LA.controller = {};




LA.controller.setMsg = {

		instruct: function ( msg ) {

			LA.instruct_panel_msg.html( msg );

		},

		confirm: function ( msg ) {
			
			LA.confirm_panel_msg.html( msg );

		},

		yesBtn: function ( msg ) {
			
			LA.yes_btn.html( msg );

		},

		noBtn: function ( msg ) {
			
			LA.no_btn.html( msg );

		},

		okBtn: function ( msg ) {
			
			LA.ok_btn.html( msg );

		}
};


