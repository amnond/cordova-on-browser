//  Copyright 2013 Amnon David (amnon.david@gmail.com)

if (!navigator.compass) {
	// -------------------------------------------
	// Compass (device-orientation Cordova plugin)
	// -------------------------------------------
	
	navigator.compass = (function() {
		var nav_compass = this;

		var oCompass = (function() {
			var self = this;

			self.CompassHeading = {
				// magneticHeading: The heading in degrees from 0-359.99 at a 
				// single moment in time. (Number)

				// trueHeading: The heading relative to the geographic North 
				// Pole in degrees 0-359.99 at a single moment in time. 
				// A negative value indicates that the true heading cannot 
				// be determined. (Number)

				// headingAccuracy: The deviation in degrees between the reported 
				// heading and the true heading. (Number)

				// timestamp: The time at which this heading was determined.
				// (milliseconds)
				magneticHeading:240
			};

	        self.getCompassHeading = function() {
	        	var rndDeg1 = Math.floor(Math.random()*6)-3;
	        	var rndDeg2 = Math.floor(Math.random()*4)-4;
	        	var h = self.CompassHeading;
	        	h.magneticHeading += rndDeg1;
	        	if (h.magneticHeading > 359)
	        		h.magneticHeading -= 360;
	        	if (h.magneticHeading < 0)
	        		h.magneticHeading += 360;
	        	h.trueHeading = self.CompassHeading.magneticHeading + rndDeg2;
	        	if (h.trueHeading > 359)
	        		h.trueHeading -= 360;
	        	if (h.trueHeading < 0)
	        		h.trueHeading += 360;
	        	h.headingAccuracy = rndDeg2;
	        	h.timestamp = new Date().getTime();
	        	return h;
	        }
	        return self;
		})();

		nav_compass.getCurrentHeading = function(compassSuccess, compassError, compassOptions)
		{
			// The compass is a sensor that detects the direction or heading that the device is
			// pointed, typically from the top of the device. It measures the heading in degrees
			// from 0 to 359.99, where 0 is north.

			// The compass heading information is returned via a CompassHeading object using the
			// compassSuccess callback function.

			setTimeout( function() { compassSuccess( oCompass.getCompassHeading() ) }, 
				        compassOptions.frequency );
		}

		nav_compass.watchHeading = function(compassSuccess, compassError, compassOptions)
		{
			// The compass is a sensor that detects the direction or heading that the device is pointed.
			// It measures the heading in degrees from 0 to 359.99.

			// The compass.watchHeading gets the device's current heading at a regular interval. Each time
			// the heading is retrieved, the headingSuccess callback function is executed. Specify the interval
			// in milliseconds via the frequency parameter in the compassOptions object.

			// The returned watch ID references the compass watch interval. The watch ID can be used with
			// compass.clearWatch to stop watching the compass.

			if (!compassOptions)
				compassOptions = {frequency:2000};

			if (!compassOptions.frequency)
				compassOptions.frequency = 2000;


			return setInterval( function() { compassSuccess( oCompass.getCompassHeading() ) }, 
				        		compassOptions.frequency );
		}

		nav_compass.clearWatch = function(watchID)
		{
			clearInterval(watchID);
		}

		return nav_compass;
	}) ();
}

// TODO: Handle case where onload is already used for some reason by the Cordova app code.
window.onload = function() {
	if (window == window.parent) {
		// Check whether we are running on a desktop browser
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/))
			// Assume Cordova is available - abort Cordova browser emulation
			return;

		// Get the HTML string of the main (index.html) Cordova file
		var page_html = document.documentElement.innerHTML;
		// Create an iframe, and prepend it to the mail HTML (we do it after getting the
		// original HTML otherwise we'll have a replay of the inception movie...)
		var ifrm = document.createElement('iframe');
		document.body.insertBefore(ifrm, document.body.firstChild);

		// Set the iframe size (which will simulate the phone size), and write the original
		// application html contents to this iframe 
		// TODO: replace this with selectable UI in the parent window.
		ifrm.width = "320px";
		ifrm.height = "480px";
		ifrmw = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
		ifrmw.document.open();
		ifrmw.document.write(page_html);
		ifrmw.document.close();

		// Remove all the UI elements from the parent window where the app originally was so
		// that all we can see is the iframe and the application within it
		var items = document.body.getElementsByTagName("*");
		for (var i = items.length-1; i>=0 ; i--) {
		    var node = items[i];
		    if (node && node != ifrm) {
		    	console.log( "removing:" + node);
			    document.body.removeChild(node);
			}
		}
	}
	else
	{
		// This will only be called for the iframe window if the iframe was created,
		// and after all the HTML/CSS/JavaScript of the main window were copied to it,
		// which will only happen if we are running in a browser.
		onDeviceReady();
	}
}