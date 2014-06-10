
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

			LA.store.ui.instruct_panel_msg.html( msg );

		},

		confirm: function ( msg ) {
			
			LA.store.ui.confirm_panel_msg.html( msg );

		},

		yesBtn: function ( msg ) {
			
			LA.store.ui.yes_btn.html( msg );

		},

		noBtn: function ( msg ) {
			
			LA.store.ui.no_btn.html( msg );

		},

		okBtn: function ( msg ) {
			
			LA.store.ui.ok_btn.html( msg );

		}
};


