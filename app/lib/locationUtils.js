/**
 * Converte il valore passato in radianti
 */
exports.toRad = function(val) {
    return val * Math.PI / 180;
};

/**
 * calcola l'angolo tra due punti
 */

//	example of use: locationUtils.generateEnemy(37.509319, 15.083504000000005, 1, 10);	

exports.generateEnemy = function(player_latitude, player_longitute, gamearea_radius, number_of_enemies) {
	var enemies = Alloy.createCollection("Enemy");
	 for ( i = 0; i < number_of_enemies; i++) {
		var angle = (Math.random() * 360);
		var distance = ((Math.random() * gamearea_radius) * Math.PI ) / 180;

		deltaX = distance * Math.cos(angle);
		deltaY = distance * Math.sin(angle);

		xnew = player_latitude + deltaX;
		ynew = player_longitute + deltaY;

		var enemy = Alloy.createModel("Enemy", {
			lat : xnew,
			lon : ynew,
			name: "pippo"+(Math.random() * 360),
			icon : "/images/enemy.png",
			status : 0,
			value : 1,
			type: "ciao"
		});
		enemy.save();
		enemies.add(enemy);
	 }
	return enemies;
};

exports.calculateBearing = function(point1, point2) {
    var lat2 = point2.latitude == null ? point2.get("lat") : point2.latitude;
    var lon2 = point2.longitude == null ? point2.get("lon") : point2.longitude;

    var radlat1 = exports.toRad(point1.latitude);
    var radlat2 = exports.toRad(lat2);
    var dlng = exports.toRad((lon2 - point1.longitude));
    var y = Math.sin(dlng) * Math.cos(lat2);
    var x = Math.cos(radlat1) * Math.sin(radlat2) - Math.sin(radlat1) * Math.cos(radlat2) * Math.cos(dlng);
    var brng = Math.atan2(y, x);
    return ((brng * (180 / Math.PI)) + 360) % 360;
};

/**
 * calcola la distanza tra due punti passati
 */
exports.calculateDistance = function(point1, point2) {

    //Ti.API.info("LOCATION " + JSON.stringify(point1));
    //Ti.API.info("PUNTO " + JSON.stringify(point2));
    var R = 6371;

    var lat2 = point2.latitude == null ? point2.get("lat") : point2.latitude;
    var lon2 = point2.longitude == null ? point2.get("lon") : point2.longitude;
    var dLat = (exports.toRad(lat2 - point1.latitude));
    var dLon = (exports.toRad(lon2 - point1.longitude));
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(exports.toRad(point1.latitude)) * Math.cos(exports.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // Distance in m
    
    return R * c * 1000;
};

/*
 * Check if the user has GPS and its enabled.
 */
exports.checkGeoServices = function() {
    return (Ti.Geolocation.getLocationServicesEnabled) ? true : false;
};

/*
 * Check if the user has a compass
 */
exports.checkCompassServices = function() {
    return Ti.Geolocation.hasCompass;
};

/*
 * Check if the user has internet
 */
exports.checkNetworkServices = function() {
    return (Titanium.Network.online) ? true : false;
};

/*
 * Check if the device has a camera
 */
exports.checkCameraExists = function() {
    return (Ti.Media.isCameraSupported) ? true : false;
};

/**
 * impostazioni geolocalizzazione
 */
exports.initGeoSettings = function() {
    if (OS_ANDROID) {
        Ti.Geolocation.Android.accuracy = Ti.Geolocation.ACCURACY_HIGH;
        Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
    } else {
        Ti.Geolocation.distanceFilter = 10;
        Ti.Geolocation.preferredProvider = "gps";
        Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
        Ti.Geolocation.purpose = L("ar_purpose");
    }
    // Setup the location  properties for callbacks
    Ti.Geolocation.headingFilter = 0.6;
    Ti.Geolocation.showCalibration = false;
};

/**
 * controlla se i servizi necessari sono presenti
 */
exports.checkGoogleService = function(MapModule) {
    // TODO mettere messagi traducibilie
    switch (MapModule.isGooglePlayServicesAvailable()) {
        case MapModule.SUCCESS:
            Ti.API.info('Google Play services is installed.');
            return true;
            break;
        case MapModule.SERVICE_MISSING:
            alert('Google Play services is missing. Please install Google Play services from the Google Play store.');
            break;
        case MapModule.SERVICE_VERSION_UPDATE_REQUIRED:
            alert('Google Play services is out of date. Please update Google Play services.');
            break;
        case MapModule.SERVICE_DISABLED:
            alert('Google Play services is disabled. Please enable Google Play services.');
            break;
        case MapModule.SERVICE_INVALID:
            alert('Google Play services cannot be authenticated. Reinstall Google Play services.');
            break;
        default:
            alert('Unknown error.');
            break;
    }
    return false;
};

