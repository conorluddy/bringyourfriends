
/*

	LiftApp
	
	Update messages on the UI

 */


if (typeof LA === "undefined" || !LA ) 
	window.LA = {};

if (typeof LA.controller === "undefined" || !LA.controller) 
	window.LA.controller = {};




LA.controller.friends = {

		//Get friend data JSON
		//----
		getJSON : function ( ) {

			$.getJSON( "/friends.json", function( data ) {

				LA.store.friends = data;

			});

		},



		toggleSelectFriend : function () {

			var
			friend = this.friend,
			invitee,
			invitees = LA.store.invitees,
			
			friendPanel = $( LA.store.ui.friends_panel ),
			friendList = $( LA.store.ui.friends_panel_list ),

			idxToRemove = -1,

			activateFriend = function () {

				friendListItem = $('<li data-friendId="' + friend.id + '">'+ friend.firstname + '</li>');
				
				friendList.append( friendListItem );
				
				invitees.push( friend );

				friendPanel.trigger( "updatelayout" );
				friendList.trigger( "refresh" );

			},
			deactivateFriend = function () {

				invitee = friendList.children('li').filter(function(index) { return $(this).data('friendid') === friend.id; });				
					
				$.each(invitees, function(index, val) {
					if ( this.id === friend.id ){
						idxToRemove = index;
						invitee.remove();
						
						friendPanel.trigger( "updatelayout" );
						friendList.trigger( "refresh" );
					}
				});

				if ( idxToRemove > -1 )
					invitees.splice( idxToRemove, 1 );
			};

			friendPanel.removeClass('away');//TODO: Move this elsewhere

			if ( this.activated ) { 

				//Deactivate	
				this.setIcon( LA.store.marker.icon.yellowdot );
				deactivateFriend();

			} else { 

				//Activate
				this.setIcon( LA.store.marker.icon.greendot );
				activateFriend();

			}

			this.activated = !this.activated;
		},





		//Friends should already be stored
		//show where they are on the map
		//----
		showFriends : function () {

			var
			latlon,
			lat,
			lon;
			

			if ( !LA.store.friends.length ) return false;


			//Loop through the friends and create markers
			//then save the marker to the friend object
			$.each(LA.store.friends, function(i, friend) {
				
				latlon = friend.latlon.split(' ');

				//Temp swap. I probably put these in arseways in the demo data - TODO, swap back
				lon = latlon[0];
				lat = latlon[1];

				latlon = new google.maps.LatLng( lat, lon );

				friend = LA.locations.marker.placeFriendMarker( latlon, LA.store.marker.icon.yellowdot, friend);

				google.maps.event.addListener(friend, 'click', LA.controller.friends.toggleSelectFriend);
			});
			
		}






};


