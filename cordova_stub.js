//  Copyright 2013 Amnon David (amnon.david@gmail.com)

//------------------------------------------------------------------------------------------
// A quick hack to enable audio play (org.apache.cordova.media)
//------------------------------------------------------------------------------------------
if (typeof(Media)=='undefined')
	Media = Audio;


//------------------------------------------------------------------------------------------
// Compass (org.apache.cordova.device-orientation)
//------------------------------------------------------------------------------------------
if (!navigator.compass) {

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
				        100 );
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
				compassOptions = {frequency:100};

			if (!compassOptions.frequency)
				compassOptions.frequency = 100;


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

//------------------------------------------------------------------------------------------
// Accelerometer (org.apache.cordova.device-motion)
//------------------------------------------------------------------------------------------
if (!navigator.accelerometer) {
	
	navigator.accelerometer = (function() {
		var nav_accelerometer = this;

		var oAccelerometer = (function() {
			var self = this;

			self.AccelerometerVals = [9.5, 0.54, -0.51];

	        self.getAcceleration = function() {
	        	var avals = self.AccelerometerVals;
	        	var which = Math.floor(Math.random()*3);
	        	for (var i=0; i<3; i++)
	        		avals[i] += (Math.random()-0.5)/2.0;
	        	avals[which] = 0;
	        	var squares = avals[0]*avals[0]+avals[1]*avals[1]+avals[2]*avals[2];
	        	var newg = 9.8+(Math.random()-0.5)/4.0;
	        	newgs = newg * newg;
	        	if (newgs < squares) {
	        		var tmp = squares;
	        		squares = newgs;
	        		newgs = squares;
	        	}
	        	avals[which] = Math.sqrt( newg*newg - squares );
				// x: Amount of acceleration on the x-axis. (in m/s^2) (Number)
				// y: Amount of acceleration on the y-axis. (in m/s^2) (Number)
				// z: Amount of acceleration on the z-axis. (in m/s^2) (Number)
				// timestamp: Creation timestamp in milliseconds. (DOMTimeStamp)
	        	var av = {x:avals[0], y:avals[1], z:avals[2]}
	        	av.timestamp = new Date().getTime();
	        	return av;
	        }
	        return self;
		})();

		nav_accelerometer.getCurrentAcceleration = function(accelerometerSuccess, accelerometerError)
		{
			// The accelerometer is a motion sensor that detects the change (delta)
			// in movement relative to the current device orientation, in three dimensions
			// along the x, y, and z axis.

			// These acceleration values are returned to the accelerometerSuccess
			// callback function.

			setTimeout( function() { accelerometerSuccess( oAccelerometer.getAcceleration() ) }, 
				        100 );
		}

		nav_accelerometer.watchAcceleration = function(accelerometerSuccess, accelerometerError, accelerometerOptions)
		{
			// The accelerometer.watchAcceleration method retrieves the device's current
			// acceleration at a regular interval, executing the accelerometerSuccess 
			// callback function each time. Specify the interval in milliseconds via the
			// acceleratorOptions object's frequency parameter.

			// The returned watch ID references the accelerometer's watch interval, and
			// can be used with accelerometer.clearWatch to stop watching the accelerometer.
			if (!accelerometerOptions)
				accelerometerOptions = {frequency:10000};

			if (!accelerometerOptions.frequency)
				accelerometerOptions.frequency = 10000;


			return setInterval( function() { accelerometerSuccess( oAccelerometer.getAcceleration() ) }, 
				        		accelerometerOptions.frequency );
		}

		nav_accelerometer.clearWatch = function(watchID)
		{
			clearInterval(watchID);
		}

		return nav_accelerometer;
	}) ();
}


//------------------------------------------------------------------------------------------
// Relocate the entire Cordova application elements from the main document body to
// an iFrame with the size of the mobile device
//------------------------------------------------------------------------------------------
(function () {
	var prev_onLoad = window.onload;
	window.onload = function() {
		if (typeof(prev_onLoad)=='function')
			prev_onLoad();

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
			var items = document.querySelectorAll( 'body > *' );
			for (var i = items.length-1; i>=0 ; i--) {
			    var node = items[i];
			    if (node && node != ifrm) {
				    document.body.removeChild(node);
				}
			}
		}
		else {
			// This will only be called for the iframe window if the iframe was created,
			// and after all the HTML/CSS/JavaScript of the main window were copied to it,
			// which will only happen if we are running in a browser.
			onDeviceReady();
		}
	}
})();
