/*

	LiftApp (LA)
	
	Messages /text

 */


if (typeof LA === "undefined" || !LA)
	window.LA = {};

if (typeof LA.store === "undefined" || !LA.store)
	window.LA.store = {};



/*
Location related methods
 */
LA.store.message = {

	story: {
		step1: 'Pick a starting location',
		step2: 'Set your destination'
	},

	confirm: {
		step1: 'Use this as your starting point?',
		step2: 'Use this as your destination?'
	},

	directions: {
		getting: 'Getting directions...'
	},

	friends: {
		pick: 'Pick some passengers'
	},

	btn: {
		y: 'Yup!',
		n: 'No.',
		k: 'OK!',
		///////
		y2: 'Sure',
		n2: 'No.',
		k2: 'OK!'
	}

};