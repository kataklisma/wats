exports.MAX_ZOOM = 1.0;
exports.MIN_ZOOM = 0.35;
exports.MIN_Y = Math.floor(Ti.Platform.displayCaps.platformHeight / 6);
exports.MAX_Y = Math.floor(Ti.Platform.displayCaps.platformWidth / 4 * 3);

//Array settaggi base
var settings = {
    SCREEN_H : Ti.Platform.displayCaps.platformHeight,
    SCREEN_W : Ti.Platform.displayCaps.platformWidth,
    DELTA_ZOOM : exports.MAX_ZOOM - exports.MIN_ZOOM,
    DELTA_Y : exports.MAX_Y - exports.MIN_Y,
    CENTER_Y : Ti.Platform.displayCaps.platformHeight / 2,

    SHOW_COLORS : false,
    COLORS : ['red', 'yellow', 'pink', 'green', 'purple', 'orange', 'blue', 'aqua', 'white', 'silver'],
    NUM_OF_VIEWS : 9,
    MAX_DIST : 50000, // in metri
};

/**
 * apre la fotocamera
 */
function openCamera(headingCallback, locationCallback, accelerometerCallback, closeCallback, overlay) {
    Ti.Geolocation.addEventListener('heading', headingCallback);
    Ti.Geolocation.addEventListener('location', locationCallback);
    Ti.Accelerometer.addEventListener('update', accelerometerCallback);

    if (OS_ANDROID) {
        Ti.Android.currentActivity.addEventListener('pause', function(e) {
            Ti.API.info("removing accelerometer callback on pause");
            Ti.Accelerometer.removeEventListener('update', accelerometerCallback);
        });

        Ti.Android.currentActivity.addEventListener('resume', function(e) {
            Ti.API.info("adding accelerometer callback on resume");
            Ti.Accelerometer.addEventListener('update', accelerometerCallback);
        });
    }

    // The actual show camera part
    Ti.Media.showCamera({
        success : function(event) {
        },
        cancel : function() {
            // only gets called if Android
            closeCallback();
        },
        error : function(error) {
            alert('unable to open AR Window');
            closeCallback();
        },
        mediaTypes : [Ti.Media.MEDIA_TYPE_VIDEO],
        showControls : false,
        autohide : false,
        autofocus : "off",
        animated : false,
        overlay : overlay
    });
}

exports.settings = settings;
exports.openCamera = openCamera;
