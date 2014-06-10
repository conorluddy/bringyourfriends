/*! LiftApp - v0.0.1 - 2014-03-21

*//**
 * MBP - Mobile boilerplate helper functions
 */

(function(document) {

    window.MBP = window.MBP || {};

    /**
     * Fix for iPhone viewport scale bug
     * http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
     */

    MBP.viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]');
    MBP.ua = navigator.userAgent;

    MBP.scaleFix = function() {
        if (MBP.viewportmeta && /iPhone|iPad|iPod/.test(MBP.ua) && !/Opera Mini/.test(MBP.ua)) {
            MBP.viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
            document.addEventListener('gesturestart', MBP.gestureStart, false);
        }
    };

    MBP.gestureStart = function() {
        MBP.viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
    };

    /**
     * Normalized hide address bar for iOS & Android
     * (c) Scott Jehl, scottjehl.com
     * MIT License
     */

    // If we split this up into two functions we can reuse
    // this function if we aren't doing full page reloads.

    // If we cache this we don't need to re-calibrate everytime we call
    // the hide url bar
    MBP.BODY_SCROLL_TOP = false;

    // So we don't redefine this function everytime we
    // we call hideUrlBar
    MBP.getScrollTop = function() {
        var win = window;
        var doc = document;

        return win.pageYOffset || doc.compatMode === 'CSS1Compat' && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
    };

    // It should be up to the mobile
    MBP.hideUrlBar = function() {
        var win = window;

        // if there is a hash, or MBP.BODY_SCROLL_TOP hasn't been set yet, wait till that happens
        if (!location.hash && MBP.BODY_SCROLL_TOP !== false) {
            win.scrollTo( 0, MBP.BODY_SCROLL_TOP === 1 ? 0 : 1 );
        }
    };

    MBP.hideUrlBarOnLoad = function() {
        var win = window;
        var doc = win.document;
        var bodycheck;

        // If there's a hash, or addEventListener is undefined, stop here
        if ( !location.hash && win.addEventListener ) {

            // scroll to 1
            window.scrollTo( 0, 1 );
            MBP.BODY_SCROLL_TOP = 1;

            // reset to 0 on bodyready, if needed
            bodycheck = setInterval(function() {
                if ( doc.body ) {
                    clearInterval( bodycheck );
                    MBP.BODY_SCROLL_TOP = MBP.getScrollTop();
                    MBP.hideUrlBar();
                }
            }, 15 );

            win.addEventListener('load', function() {
                setTimeout(function() {
                    // at load, if user hasn't scrolled more than 20 or so...
                    if (MBP.getScrollTop() < 20) {
                        // reset to hide addr bar at onload
                        MBP.hideUrlBar();
                    }
                }, 0);
            });
        }
    };

    /**
     * Fast Buttons - read wiki below before using
     * https://github.com/h5bp/mobile-boilerplate/wiki/JavaScript-Helper
     */

    MBP.fastButton = function(element, handler, pressedClass) {
        this.handler = handler;
        // styling of .pressed is defined in the project's CSS files
        this.pressedClass = typeof pressedClass === 'undefined' ? 'pressed' : pressedClass;

        if (element.length && element.length > 1) {
            for (var singleElIdx in element) {
                this.addClickEvent(element[singleElIdx]);
            }
        } else {
            this.addClickEvent(element);
        }
    };

    MBP.fastButton.prototype.handleEvent = function(event) {
        event = event || window.event;

        switch (event.type) {
            case 'touchstart': this.onTouchStart(event); break;
            case 'touchmove': this.onTouchMove(event); break;
            case 'touchend': this.onClick(event); break;
            case 'click': this.onClick(event); break;
        }
    };

    MBP.fastButton.prototype.onTouchStart = function(event) {
        var element = event.target || event.srcElement;
        event.stopPropagation();
        element.addEventListener('touchend', this, false);
        document.body.addEventListener('touchmove', this, false);
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;

        element.className+= ' ' + this.pressedClass;
    };

    MBP.fastButton.prototype.onTouchMove = function(event) {
        if (Math.abs(event.touches[0].clientX - this.startX) > 10 ||
            Math.abs(event.touches[0].clientY - this.startY) > 10) {
            this.reset(event);
        }
    };

    MBP.fastButton.prototype.onClick = function(event) {
        event = event || window.event;
        var element = event.target || event.srcElement;
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        this.reset(event);
        this.handler.apply(event.currentTarget, [event]);
        if (event.type == 'touchend') {
            MBP.preventGhostClick(this.startX, this.startY);
        }
        var pattern = new RegExp(' ?' + this.pressedClass, 'gi');
        element.className = element.className.replace(pattern, '');
    };

    MBP.fastButton.prototype.reset = function(event) {
        var element = event.target || event.srcElement;
        rmEvt(element, 'touchend', this, false);
        rmEvt(document.body, 'touchmove', this, false);

        var pattern = new RegExp(' ?' + this.pressedClass, 'gi');
        element.className = element.className.replace(pattern, '');
    };

    MBP.fastButton.prototype.addClickEvent = function(element) {
        addEvt(element, 'touchstart', this, false);
        addEvt(element, 'click', this, false);
    };

    MBP.preventGhostClick = function(x, y) {
        MBP.coords.push(x, y);
        window.setTimeout(function() {
            MBP.coords.splice(0, 2);
        }, 2500);
    };

    MBP.ghostClickHandler = function(event) {
        if (!MBP.hadTouchEvent && MBP.dodgyAndroid) {
            // This is a bit of fun for Android 2.3...
            // If you change window.location via fastButton, a click event will fire
            // on the new page, as if the events are continuing from the previous page.
            // We pick that event up here, but MBP.coords is empty, because it's a new page,
            // so we don't prevent it. Here's we're assuming that click events on touch devices
            // that occur without a preceding touchStart are to be ignored.
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        for (var i = 0, len = MBP.coords.length; i < len; i += 2) {
            var x = MBP.coords[i];
            var y = MBP.coords[i + 1];
            if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    };

    // This bug only affects touch Android 2.3 devices, but a simple ontouchstart test creates a false positive on
    // some Blackberry devices. https://github.com/Modernizr/Modernizr/issues/372
    // The browser sniffing is to avoid the Blackberry case. Bah
    MBP.dodgyAndroid = ('ontouchstart' in window) && (navigator.userAgent.indexOf('Android 2.3') != -1);

    if (document.addEventListener) {
        document.addEventListener('click', MBP.ghostClickHandler, true);
    }

    addEvt(document.documentElement, 'touchstart', function() {
        MBP.hadTouchEvent = true;
    }, false);

    MBP.coords = [];

    // fn arg can be an object or a function, thanks to handleEvent
    // read more about the explanation at: http://www.thecssninja.com/javascript/handleevent
    function addEvt(el, evt, fn, bubble) {
        if ('addEventListener' in el) {
            // BBOS6 doesn't support handleEvent, catch and polyfill
            try {
                el.addEventListener(evt, fn, bubble);
            } catch(e) {
                if (typeof fn == 'object' && fn.handleEvent) {
                    el.addEventListener(evt, function(e){
                        // Bind fn as this and set first arg as event object
                        fn.handleEvent.call(fn,e);
                    }, bubble);
                } else {
                    throw e;
                }
            }
        } else if ('attachEvent' in el) {
            // check if the callback is an object and contains handleEvent
            if (typeof fn == 'object' && fn.handleEvent) {
                el.attachEvent('on' + evt, function(){
                    // Bind fn as this
                    fn.handleEvent.call(fn);
                });
            } else {
                el.attachEvent('on' + evt, fn);
            }
        }
    }

    function rmEvt(el, evt, fn, bubble) {
        if ('removeEventListener' in el) {
            // BBOS6 doesn't support handleEvent, catch and polyfill
            try {
                el.removeEventListener(evt, fn, bubble);
            } catch(e) {
                if (typeof fn == 'object' && fn.handleEvent) {
                    el.removeEventListener(evt, function(e){
                        // Bind fn as this and set first arg as event object
                        fn.handleEvent.call(fn,e);
                    }, bubble);
                } else {
                    throw e;
                }
            }
        } else if ('detachEvent' in el) {
            // check if the callback is an object and contains handleEvent
            if (typeof fn == 'object' && fn.handleEvent) {
                el.detachEvent("on" + evt, function() {
                    // Bind fn as this
                    fn.handleEvent.call(fn);
                });
            } else {
                el.detachEvent('on' + evt, fn);
            }
        }
    }

    /**
     * Autogrow
     * http://googlecode.blogspot.com/2009/07/gmail-for-mobile-html5-series.html
     */

    MBP.autogrow = function(element, lh) {
        function handler(e) {
            var newHeight = this.scrollHeight;
            var currentHeight = this.clientHeight;
            if (newHeight > currentHeight) {
                this.style.height = newHeight + 3 * textLineHeight + 'px';
            }
        }

        var setLineHeight = (lh) ? lh : 12;
        var textLineHeight = element.currentStyle ? element.currentStyle.lineHeight : getComputedStyle(element, null).lineHeight;

        textLineHeight = (textLineHeight.indexOf('px') == -1) ? setLineHeight : parseInt(textLineHeight, 10);

        element.style.overflow = 'hidden';
        element.addEventListener ? element.addEventListener('input', handler, false) : element.attachEvent('onpropertychange', handler);
    };

    /**
     * Enable CSS active pseudo styles in Mobile Safari
     * http://alxgbsn.co.uk/2011/10/17/enable-css-active-pseudo-styles-in-mobile-safari/
     */

    MBP.enableActive = function() {
        document.addEventListener('touchstart', function() {}, false);
    };

    /**
     * Prevent default scrolling on document window
     */
     
    MBP.preventScrolling = function() {
        document.addEventListener('touchmove', function(e) {
            if (e.target.type === 'range') { return; }
            e.preventDefault();
        }, false);
    };

    /**
     * Prevent iOS from zooming onfocus
     * https://github.com/h5bp/mobile-boilerplate/pull/108
     * Adapted from original jQuery code here: http://nerd.vasilis.nl/prevent-ios-from-zooming-onfocus/
     */

    MBP.preventZoom = function() {
        var formFields = document.querySelectorAll('input, select, textarea');
        var contentString = 'width=device-width,initial-scale=1,maximum-scale=';
        var i = 0;

        for (i = 0; i < formFields.length; i++) {
            formFields[i].onfocus = function() {
                MBP.viewportmeta.content = contentString + '1';
            };
            formFields[i].onblur = function() {
                MBP.viewportmeta.content = contentString + '10';
            };
        }
    };

    /**
     * iOS Startup Image helper
     */

    MBP.startupImage = function() {
        var portrait;
        var landscape;
        var pixelRatio;
        var head;
        var link1;
        var link2;

        pixelRatio = window.devicePixelRatio;
        head = document.getElementsByTagName('head')[0];

        if (navigator.platform === 'iPad') {
            portrait = pixelRatio === 2 ? 'img/startup/startup-tablet-portrait-retina.png' : 'img/startup/startup-tablet-portrait.png';
            landscape = pixelRatio === 2 ? 'img/startup/startup-tablet-landscape-retina.png' : 'img/startup/startup-tablet-landscape.png';

            link1 = document.createElement('link');
            link1.setAttribute('rel', 'apple-touch-startup-image');
            link1.setAttribute('media', 'screen and (orientation: portrait)');
            link1.setAttribute('href', portrait);
            head.appendChild(link1);

            link2 = document.createElement('link');
            link2.setAttribute('rel', 'apple-touch-startup-image');
            link2.setAttribute('media', 'screen and (orientation: landscape)');
            link2.setAttribute('href', landscape);
            head.appendChild(link2);
        } else {
            portrait = pixelRatio === 2 ? "img/startup/startup-retina.png" : "img/startup/startup.png";
            portrait = screen.height === 568 ? "img/startup/startup-retina-4in.png" : portrait;
            link1 = document.createElement('link');
            link1.setAttribute('rel', 'apple-touch-startup-image');
            link1.setAttribute('href', portrait);
            head.appendChild(link1);
        }

        //hack to fix letterboxed full screen web apps on 4" iPhone / iPod
        if ((navigator.platform === 'iPhone' || 'iPod') && (screen.height === 568)) {
            if (MBP.viewportmeta) {
                MBP.viewportmeta.content = MBP.viewportmeta.content
                    .replace(/\bwidth\s*=\s*320\b/, 'width=320.1')
                    .replace(/\bwidth\s*=\s*device-width\b/, '');
            }
        }
    };

})(document);

;
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any Zepto/helper plugins in here.
;


// LiftApp (LA)
// ----

// Location helpers




if (typeof LA === "undefined" || !LA) 
	window.LA = {};

if (typeof LA.store === "undefined" || !LA.store)
	window.LA.store = {};




// Location related methods
// ----
LA.store.coordinates = {

	//The location of the device
	ourLocation: null,

	//Beginning of the trip
	startLocation: null,
	
	//Destination of the trip
	endLocation: null

};


;


// LiftApp (LA)
// ----

// Location helpers




if (typeof LA === "undefined" || !LA) 
	window.LA = {};

if (typeof LA.store === "undefined" || !LA.store)
	window.LA.store = {};




// Location related methods
// ----
LA.store.friends = {};






;


// LiftApp (LA)
// ----

// Location helpers




if (typeof LA === "undefined" || !LA) 
	window.LA = {};

if (typeof LA.store === "undefined" || !LA.store)
	window.LA.store = {};




// Location related methods
// ----
LA.store.invitees = [];






;
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
		yellowdot: {
			url: 'img/markers/circle-yellow.png',
			size: new google.maps.Size(32, 32),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(16, 16),
			scaledSize: new google.maps.Size(32, 32)
		},
		greendot: {
			url: 'img/markers/circle-green.png',
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
;
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
;


// LiftApp (LA)
// ----

// Location helpers




if (typeof LA === "undefined" || !LA) 
	window.LA = {};

if (typeof LA.store === "undefined" || !LA.store)
	window.LA.store = {};




// Location related methods
// ----
LA.store.notifications = {};






;


// LiftApp (LA)
// ----

// Save the trip data




if (typeof LA === "undefined" || !LA) 
	window.LA = {};

if (typeof LA.store === "undefined" || !LA.store)
	window.LA.store = {};




// Location related methods
// ----
LA.store.trip = {

	startLat : 0,
	startLon : 0,
	//
	endLat : 0,
	endLon : 0,
	//
	startTime : 0,
	etaTime : 0,
	//
	invitees : null,
	seats : 4, //TODO - make option
	//
	polyline: ''

};






;


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

	
	instruct_panel : '#panel_instruct',

	// instruct_panel_msg : $('#panel_instruct h4'),

	// ok_btn : $('#panel_instruct a'),

	// confirm_panel : $('#panel_confirm'),

	// confirm_panel_msg : $('#panel_confirm span'),

	// yes_btn : $('#panel_confirm .Y'),

	// no_btn : $('#panel_confirm .N'),

	friends_panel : '#friends_panel',
	
	friends_panel_list : '#friends_panel ul'

};
;

/*

	LiftApp
	
	Directions

 */

if (typeof LA.maps === "undefined" || !LA.maps) 
	window.LA.maps = {};




LA.maps.directions = {
	style: {
		polylineOpts: new google.maps.Polyline({
			strokeColor: '#C1FC00',
			strokeOpacity: 0.9,
			strokeWeight: 3
		})
	}
};














;

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














;


/*

	LiftApp
	
	Map styles

 */

if (typeof LA === "undefined" || !LA) 
	window.LA = {};
if (typeof LA.maps === "undefined" || !LA.maps) 
	window.LA.maps = {};



/*
Map styling
*/
LA.maps.styles = [{
				"featureType": "landscape",
				"stylers": [{
					"saturation": -100
				}, {
					"lightness": 65
				}, {
					"visibility": "on"
				}]
			}, {
				"featureType": "poi",
				"stylers": [{
					"saturation": -100
				}, {
					"lightness": 51
				}, {
					"visibility": "simplified"
				}]
			}, {
				"featureType": "road.highway",
				"stylers": [{
					"saturation": -100
				}, {
					"visibility": "simplified"
				}]
			}, {
				"featureType": "road.arterial",
				"stylers": [{
					"saturation": -100
				}, {
					"lightness": 30
				}, {
					"visibility": "on"
				}]
			}, {
				"featureType": "road.local",
				"stylers": [{
					"saturation": -100
				}, {
					"lightness": 40
				}, {
					"visibility": "on"
				}]
			}, {
				"featureType": "transit",
				"stylers": [{
					"saturation": -100
				}, {
					"visibility": "simplified"
				}]
			}, {
				"featureType": "administrative.province",
				"stylers": [{
					"visibility": "off"
				}]
			}, {
				"featureType": "water",
				"elementType": "labels",
				"stylers": [{
					"visibility": "on"
				}, {
					"lightness": -25
				}, {
					"saturation": -100
				}]
			}, {
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [{
					"hue": "#ffff00"
				}, {
					"lightness": -25
				}, {
					"saturation": -97
				}]
}];






























;
/*

	LiftApp (LA)
	
	Location helpers

 */


if (typeof LA.locations === "undefined" || !LA.locations)
	window.LA.locations = {};



/*
Location related methods
 */
LA.locations.locate = {


		/*
		Set the start point for the trip	
		 */
		setStartPoint: function() {

		},




		/*
		Set the end point for the trip	
		 */
		setEndPoint: function() {

		},




		
		/*
		Return the coordinates of the users current location if possible
		 */
		getOurLocation: function() {

			var
			fallbackLocation = new google.maps.LatLng( 53.27055, -9.05666 ),
			ourLocation,
			browserSupportFlag = false;
			///


			// Try W3C Geolocation (Preferred)
			if (navigator.geolocation) {
				browserSupportFlag = true;

				navigator.geolocation.getCurrentPosition(function(position) {

					ourLocation = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
					
					LA.store.coordinates.ourLocation = ourLocation;
					
					LA.map.setCenter( ourLocation );

					// LA.store.coordinates.startLocation = LA.locations.marker.placeMarker( ourLocation, LA.store.marker.icon.startPoint );

				}, function() {
					LA.map.setCenter( fallbackLocation );	
				});
			}

			// Browser doesn't support Geolocation
			else {
				LA.map.setCenter( fallbackLocation );
			}	

		}
};





















;

/*

	LiftApp
	
	Location helpers

 */


if (typeof LA.locations === "undefined" || !LA.locations) 
	window.LA.locations = {};




/*
Marker related methods
*/
LA.locations.marker = {


		/*
		Place a marker on a location
		*/
		placeMarker: function( location, icon ) {

			if ( typeof icon === 'undefined' ) icon = LA.store.marker.icon.defaultMarker;

			var marker = new google.maps.Marker({

				position: location,
				map: LA.map,
				icon: icon

			});

			return marker;

		},

		placeFriendMarker: function( location, icon, friend ) {

			if ( typeof icon === 'undefined' ) icon = LA.store.marker.icon.defaultMarker;

			var marker = new google.maps.Marker({

				position: location,
				map: LA.map,
				icon: icon,
				friend: friend,
				activated: false //Toggles when marker is selected

			});

			return marker;

		}




};
;

/*

	LiftApp
	
	Update messages on the UI

 */


if (typeof LA === "undefined" || !LA ) 
	window.LA = {};

if (typeof LA.controller === "undefined" || !LA.controller) 
	window.LA.controller = {};




LA.controller.trip = {

	updateTripForm : function () {

		var
		inviteeIDs = "",
		first = true;

		//Start point
		$('#trip-startLat').val( LA.store.coordinates.startLocation.lat );
		$('#trip-startLon').val( LA.store.coordinates.startLocation.lon );

		//End point
		$('#trip-endLat').val( LA.store.coordinates.endLocation.lat );
		$('#trip-endLon').val( LA.store.coordinates.endLocation.lon );

		//Hopefully we can use this to trace a route on the static maps...TODO
		$('#trip-polyline').val( LA.store.trip.polyline );

		//Create Invitees ID string
		$(LA.store.invitees).each( function(index, invitee) {
			//Add a comma if it's not the first ID
			inviteeIDs += first ? '' : ',';
			inviteeIDs += invitee.id;
			first = false;
		});		

		$('#trip-invitees').val( inviteeIDs );
		

		// $('#trip-startTime').val(  );
		// $('#trip-etaTime').val(  );
		// $('#trip-seats').val(  );
	}

};



;



//	LiftApp
//	----	
//	App control methods


if (typeof LA === "undefined" || !LA ) 
	window.LA = {};

if (typeof LA.controller === "undefined" || !LA.controller) 
	window.LA.controller = {};





// Initialise the application
// --------------------------
LA.controller.story = {



		//Get the starting point of the trip
		//----
		//1) Set your starting location
		askForStartLocation : function () {

			var 
			startLocationListener,
			UI = LA.store.ui;

			//Set the user messages
			$( UI.instruct_panel ).html( '<h4>' + LA.store.message.story.step1 + '</h4>' );
			$.mobile.resetActivePageHeight();


			//Add map listener to get the location requested
			startLocationListener = google.maps.event.addListener( LA.map, 'click', function(event) {	
				google.maps.event.removeListener( startLocationListener );

				$( '<div data-role="navbar"><ul><li><a href="#" class="Y">Confirm</a></li><li><a href="#" class="N">Cancel</a></li></ul></div>' )
					.prependTo( UI.instruct_panel )
					.navbar();

				// Update the page height and padding
				$.mobile.resetActivePageHeight();

				setTriggers( $( UI.instruct_panel ).find('.Y'), $( UI.instruct_panel ).find('.N') );

				//Clear any saved marker for this
				if ( LA.store.coordinates.startLocation !== null)
					LA.store.coordinates.startLocation.setMap(null);

				//Add marker for the last clicked/tapped location
				LA.store.coordinates.startLocation = LA.locations.marker.placeMarker( event.latLng, LA.store.marker.icon.startPoint );
				
				LA.store.coordinates.startLocation.lat = event.latLng.lat();
				LA.store.coordinates.startLocation.lon = event.latLng.lng();
			});

			function setTriggers ( yes_btn, no_btn ) {
				//Location is confirmed, move to next step
				yes_btn.one('click', function(event) {
					event.preventDefault();

					if ( LA.store.coordinates.startLocation !== null){
						
						window.setTimeout(function() { 
							LA.controller.story.askForDestinationLocation(); 
						}, 20);

					}
					
				});

				//Location is cancelled, remove the marker and wait for new selection
				no_btn.one('click', function(event) {
					event.preventDefault();

					LA.store.coordinates.startLocation.setMap(null);

					LA.controller.story.askForStartLocation();

				});				
			}

		},












		//Get the destination point of the trip
		//----
		askForDestinationLocation : function () {

			var 
			destinationLocationListener,
			UI = LA.store.ui;

			//Set the user messages
			$( UI.instruct_panel ).html( '<h4>' + LA.store.message.story.step2 + '</h4>' );
			$( UI.instruct_panel ).toolbar( "refresh" );


			//Add map listener to get the location requested
			destinationLocationListener = google.maps.event.addListener( LA.map, 'click', function(event) {
				google.maps.event.removeListener( destinationLocationListener );

				$( '<div data-role="navbar"><ul><li><a href="#" class="Y">Confirm</a></li><li><a href="#" class="N">Cancel</a></li></ul></div>' )
					.prependTo( UI.instruct_panel )
					.navbar();

				// Update the page height and padding
				$.mobile.resetActivePageHeight();

				//These are added dynamically so we need to find them
				setTriggers( $( UI.instruct_panel ).find('.Y'), $( UI.instruct_panel ).find('.N') );

				//Clear any saved marker for this
				if ( LA.store.coordinates.endLocation !== null)
					LA.store.coordinates.endLocation.setMap(null);

				//Add marker for the last clicked/tapped location
				LA.store.coordinates.endLocation = LA.locations.marker.placeMarker( event.latLng, LA.store.marker.icon.endPoint );
				LA.store.coordinates.endLocation.lat = event.latLng.lat();
				LA.store.coordinates.endLocation.lon = event.latLng.lng();

			});

			function setTriggers ( yes_btn, no_btn ) {

				//Destination is confirmed, move to next step
				yes_btn.one('click', function(event) {
					event.preventDefault();

					if ( LA.store.coordinates.endLocation !== null){
					
						window.setTimeout(function() { 
							LA.controller.story.getARoute( LA.store.coordinates.startLocation, LA.store.coordinates.endLocation ); 
						}, 300);

					}
					
				});
				
				//Location is cancelled, remove the marker and wait for new selection
				no_btn.one('click', function(event) {
					event.preventDefault();

					LA.store.coordinates.endLocation.setMap(null);

					LA.controller.story.askForDestinationLocation();

				});
			}

		},









		//Find a route from A to B
		//----
		getARoute : function ( pointA, pointB ) {

			var
			UI = LA.store.ui,
			directionsService = new google.maps.DirectionsService(),
			directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions: LA.maps.directions.style.polylineOpts });
			directionRequest = {
				origin: pointA.position,
				destination: pointB.position,
				travelMode: google.maps.TravelMode.DRIVING,
				provideRouteAlternatives: true
			};


			//Set the user messages
			$( UI.instruct_panel ).html( '<h4>' + LA.store.message.directions.getting + '</h4>' );
			$( UI.instruct_panel ).toolbar( "refresh" );


			directionsDisplay.setMap(LA.map);

			directionsService.route(directionRequest, function(response, status) {

				//Set the user messages
				$( UI.instruct_panel ).html( '<h4>' + LA.store.message.friends.pick + '</h4>' )
					.prepend('<a href="#" id="submit" class="ui-btn-right ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-check">Save Trip</a>')
					.toolbar( "refresh" );

				// Update the page height and padding
				$.mobile.resetActivePageHeight();

				if ( status == google.maps.DirectionsStatus.OK )
					directionsDisplay.setDirections( response );

				if ( typeof response.routes[0].overview_polyline.points !== 'undefined' ) 
					LA.store.trip.polyline = response.routes[0].overview_polyline.points;

				//Put friends on the map
				LA.controller.friends.showFriends();

				//TODO - move this
				LA.controller.story.doTripSubmit();

			});

		},











		//ToDo - get date and time

		//Get the name of the destination

		//Get the message to send with the invitation
		
		//Get the number of free seats














		doTripSubmit : function () {

			$('#submit').on( "click", function( event ) {
				event.preventDefault();

				//Put the JS objects in the hidden form fields
				LA.controller.trip.updateTripForm();

				$( "form" ).submit();
			});

		},








		//Start the story
		//----
		init : function () {
			LA.controller.story.askForStartLocation();
		}

};

















;

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



;

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



;

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



;

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


















