cordova-on-browser
==================

Simple and painless way to test Cordova applications on a desktop browser. The goal of this project is to enable anyone writing a Cordova/PhoneGap application to quickly and painlessly test the application logic and UI layout on a browser by simply adding one line to the index.html file of the Cordova application. From that point, opening index.html with your web browser (even as a file) will display your Cordova application in the browser as it would be seen on a mobile device.

### Using cordova-on-browser

Simple: In a cordova project, there's the index.html file. First, copy the cordova_stub.js file included in this project to the same directory as your project's www/index.html file. Now in index.html add the inclusion of cordova_stub.js (preferably just above the &lt;/body&gt; tag), i.e:


```javascript
<script type="text/javascript" charset="utf-8" src="cordova_stub.js"></script>
```

preferably just above the:

```
</body>
```

and that's it - you're ready to go. Just double click the index.html file and watch your phone application run on your browser.

Notes:
Since this is still a work in progress, Jacascript simulations of more Cordova plugins should be added with time. Currently the following plugin simulations work:

* Accelerometer (org.apache.cordova.device-motion)
* Compass (org.apache.cordova.device-orientation)
* Geolocation (org.apache.cordova.geolocation) - Currently uses browser's own implementation
