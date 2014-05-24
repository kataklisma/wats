function openCamera(headingCallback, locationCallback, accelerometerCallback, closeCallback, overlay) {
    Ti.Geolocation.addEventListener("heading", headingCallback);
    Ti.Geolocation.addEventListener("location", locationCallback);
    Ti.Accelerometer.addEventListener("update", accelerometerCallback);
    Ti.Android.currentActivity.addEventListener("pause", function() {
        Ti.API.info("removing accelerometer callback on pause");
        Ti.Accelerometer.removeEventListener("update", accelerometerCallback);
    });
    Ti.Android.currentActivity.addEventListener("resume", function() {
        Ti.API.info("adding accelerometer callback on resume");
        Ti.Accelerometer.addEventListener("update", accelerometerCallback);
    });
    Ti.Media.showCamera({
        success: function() {},
        cancel: function() {
            closeCallback();
        },
        error: function() {
            alert("unable to open AR Window");
            closeCallback();
        },
        mediaTypes: [ Ti.Media.MEDIA_TYPE_VIDEO ],
        showControls: false,
        autohide: false,
        autofocus: "off",
        animated: false,
        overlay: overlay
    });
}

exports.MAX_ZOOM = 1;

exports.MIN_ZOOM = .35;

exports.MIN_Y = Math.floor(Ti.Platform.displayCaps.platformHeight / 6);

exports.MAX_Y = Math.floor(3 * (Ti.Platform.displayCaps.platformWidth / 4));

var settings = {
    SCREEN_H: Ti.Platform.displayCaps.platformHeight,
    SCREEN_W: Ti.Platform.displayCaps.platformWidth,
    DELTA_ZOOM: exports.MAX_ZOOM - exports.MIN_ZOOM,
    DELTA_Y: exports.MAX_Y - exports.MIN_Y,
    CENTER_Y: Ti.Platform.displayCaps.platformHeight / 2,
    SHOW_COLORS: false,
    COLORS: [ "red", "yellow", "pink", "green", "purple", "orange", "blue", "aqua", "white", "silver" ],
    NUM_OF_VIEWS: 9,
    MAX_DIST: 5e4
};

exports.settings = settings;

exports.openCamera = openCamera;