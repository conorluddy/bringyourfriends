

// LiftApp (LA)
// ----

// Location helpers




if (typeof LA === "undefined" || !LA) 
	window.LA = {};

if (typeof LA.store === "undefined" || !LA.store)
	window.LA.store = {};




// Location related methods
// ----
LA.store.ui = {

	
	instruct_panel : $('#panel_instruct'),

	instruct_panel_msg : $('#panel_instruct span'),

	ok_btn : $('#panel_instruct a'),

	confirm_panel : $('#panel_confirm'),

	confirm_panel_msg : $('#panel_confirm span'),

	yes_btn : $('#panel_confirm .Y'),

	no_btn : $('#panel_confirm .N'),

	friends_panel : $('#panel_friends'),

	friends_panel_list : $('#panel_friends ul')

};