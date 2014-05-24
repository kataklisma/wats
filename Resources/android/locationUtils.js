exports.toRad = function(val) {
    return val * Math.PI / 180;
};

exports.calculateBearing = function(point1, point2) {
    var lat2 = null == point2.latitude ? point2.get("latitude") : point2.latitude;
    var lon2 = null == point2.longitude ? point2.get("longitude") : point2.longitude;
    var radlat1 = exports.toRad(point1.latitude);
    var radlat2 = exports.toRad(lat2);
    var dlng = exports.toRad(lon2 - point1.longitude);
    var y = Math.sin(dlng) * Math.cos(lat2);
    var x = Math.cos(radlat1) * Math.sin(radlat2) - Math.sin(radlat1) * Math.cos(radlat2) * Math.cos(dlng);
    var brng = Math.atan2(y, x);
    return (brng * (180 / Math.PI) + 360) % 360;
};

exports.calculateDistance = function(point1, point2) {
    var R = 6371;
    var lat2 = null == point2.latitude ? point2.get("latitude") : point2.latitude;
    var lon2 = null == point2.longitude ? point2.get("longitude") : point2.longitude;
    var dLat = exports.toRad(lat2 - point1.latitude);
    var dLon = exports.toRad(lon2 - point1.longitude);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(exports.toRad(point1.latitude)) * Math.cos(exports.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 1e3 * R * c;
};

exports.checkGeoServices = function() {
    return Ti.Geolocation.getLocationServicesEnabled ? true : false;
};

exports.checkCompassServices = function() {
    return Ti.Geolocation.hasCompass;
};

exports.checkNetworkServices = function() {
    return Titanium.Network.online ? true : false;
};

exports.checkCameraExists = function() {
    return Ti.Media.isCameraSupported ? true : false;
};

exports.initGeoSettings = function() {
    Ti.Geolocation.Android.accuracy = Ti.Geolocation.ACCURACY_HIGH;
    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
    Ti.Geolocation.headingFilter = .6;
    Ti.Geolocation.showCalibration = false;
};

exports.checkGoogleService = function(MapModule) {
    switch (MapModule.isGooglePlayServicesAvailable()) {
      case MapModule.SUCCESS:
        Ti.API.info("Google Play services is installed.");
        return true;

      case MapModule.SERVICE_MISSING:
        alert("Google Play services is missing. Please install Google Play services from the Google Play store.");
        break;

      case MapModule.SERVICE_VERSION_UPDATE_REQUIRED:
        alert("Google Play services is out of date. Please update Google Play services.");
        break;

      case MapModule.SERVICE_DISABLED:
        alert("Google Play services is disabled. Please enable Google Play services.");
        break;

      case MapModule.SERVICE_INVALID:
        alert("Google Play services cannot be authenticated. Reinstall Google Play services.");
        break;

      default:
        alert("Unknown error.");
    }
    return false;
};