var args = arguments[0] || {};

var arConfig = require("ar/arConfig");
var overlayLib = require("ar/overlay");

// VARIABILI  LOCALI
var lastActiveView = -1;
var viewChange = false;
var activePois = [];
var pixelOffsetY = 0;
var myLocation = null;

//ELEMENTI GRAFICI
var overlay = overlayLib.getOverlay();
var views = overlayLib.views;
var label = overlayLib.debugLabel;
var radar = overlayLib.radar;
var pois = null;

/**
 * All'apertura della finestra carica i poi
 */
$.arview.addEventListener('open', function() {
    // TODO fare i check dei servizi disponibili di geolocalizzazione

    locationUtils.initGeoSettings();

    //aggiungo il bottone per chiudere su iOS
    if (OS_ANDROID) {
        var closeButton = overlayLib.closeButton();
        closeButton.addEventListener('click', closeAR);
        overlay.add(closeButton);
    }
    
    pois = args.enemies;
    pois.fetch();
    assignPOIs();
});



/**
 * carica i POIe apre la camera
 */
function assignPOIs() {

    _.each(pois, function(poi) {
       /* var arPinController = poi.getArPinController();
        var arPinView = arPinController.getView();
        arPinView.addEventListener('click', function(e) {
            arPinController.clickPoi(overlay);
        });*/
        poi.view = arPinView;
    });

    $.arview.pois = pois;

    arConfig.openCamera(headingCallback, locationCallback, accelerometerCallback, closeAR, overlay);
};

/**
 * richiamato su click di un POI
 *
 * @param {Object} e
 */
function clickPoi(e) {
    var poi = activePois[e.source.number];
    var view = poi.view;
    poi.view.fireEvent('click', {
        source : poi.view,
        poi : poi
    });
}

/**
 * Si occupa si ridisegnare i poi a ogni refresh della posizione
 */
function redrawPois() {
    if (!myLocation) {
        Ti.API.warn("location not known. Can't draw pois");
        return;
    }

    // remove any existing views
    overlayLib.resetViews();

    //Resetta il radar
    //overlayLib.resetRadar();

    // Draw the Points of Interest on the Views
    activePois = [];

    _.each($.arview.pois, function(poi) {

        if (poi.view) {
            var distance = locationUtils.calculateDistance(myLocation, poi);
            //Ti.API.debug("POI: " + poi.get("name") + " DISTANCE: " + Math.floor(distance));

            //calcolo il limite della distanza
            if (distance < arConfig.settings.MAX_DIST) {

                var bearing = locationUtils.calculateBearing(myLocation, poi);
                var internalBearing = bearing / (360 / views.length);
                var activeView = Math.floor(internalBearing);
                if (activeView >= views.length) {
                    activeView = 0;
                }

                var pixelOffset = Math.floor((internalBearing % 1) * arConfig.settings.SCREEN_W) + ((views[0].width - arConfig.settings.SCREEN_W) / 2);
                poi.distance = distance;
                poi.pixelOffset = pixelOffset;
                poi.activeView = activeView;
                poi.bearing = bearing;

                activePois.push(poi);
            } else {
                Ti.API.debug(poi.title + " NOT ADDED, maxDistance=" + arConfig.settings.MAX_DIST);
            }
        }
    });

    // Sort by Distance
    activePois.sort(function(a, b) {
        return b.distance - a.distance;
    });

    if (activePois.length != 0) {
        var maxDistance = activePois[0].distance;
        var minDistance = activePois[activePois.length - 1].distance;
        var distanceDelta = maxDistance - minDistance;
    }

    // Add the view
    for (var i = 0; i < activePois.length; i++) {
        var poi = activePois[i];

        if (arConfig.settings.SHOW_COLORS) {
            Ti.API.debug('viewColor=' + views[poi.activeView].backgroundColor);
        }
        //Ti.API.debug('bearing=' + poi.bearing);
        // Calcuate the Scaling (for distance)
        var distanceFromSmallest = poi.distance - minDistance;
        var percentFromSmallest = 1 - (distanceFromSmallest / distanceDelta);

        var zoom = (percentFromSmallest * arConfig.settings.DELTA_ZOOM) + arConfig.MIN_ZOOM;
        // Calculate the y (farther away = higher )
        var y = arConfig.MIN_Y + (percentFromSmallest * arConfig.settings.DELTA_Y);
        var view = poi.view;
        // Apply the transform
        var transform = Ti.UI.create2DMatrix();
        transform = transform.scale(zoom);
        view.transform = transform;
        //Ti.API.debug('pixelOffset=' + poi.pixelOffset);
        view.center = {
            x : poi.pixelOffset,
            y : y
        };

        views[poi.activeView].add(view);

        // add to blip to the radar
        // The Radar Blips ....
        overlayLib.addBlipToRadar(poi, maxDistance, locationUtils.toRad(poi.bearing));
    }
};

/**
 * Callback listener su Aggiornamento heading
 * @param {Object} e
 */
function headingCallback(e) {

    var currBearing = e.heading.trueHeading;
    var internalBearing = currBearing / (360 / views.length);
    var activeView = Math.floor(internalBearing);

    // TODO probabliamente da qua si cambia la sensibilità dello scorrimento delle viste
    var pixelOffset = arConfig.settings.SCREEN_W - (Math.floor((internalBearing % 1) * arConfig.settings.SCREEN_W));
    //Ti.API.info("OFFSET: " + (Math.floor((internalBearing % 1) * arConfig.settings.SCREEN_W)));
    //    Ti.API.info("BEARING OFFSET: " + pixelOffset);
    if (activeView != lastActiveView) {
        viewChange = true;
        lastActiveView = activeView;
    } else {
        viewChange = false;
    }

    for (var i = 0; i < views.length; i++) {

        // Sposto la views in altezza
        var offsetY = (views[i].top * 1.05) - views[i].top;

        /*if (views[i] && Math.abs(pixelOffsetY) > offsetY) {
         views[i].top = pixelOffsetY;
         }*/

        var diff = activeView - i;
        if (diff >= -1 && diff <= 1) {
            views[i].center = {
                y : arConfig.settings.CENTER_Y,
                x : pixelOffset + (-1 * diff * arConfig.settings.SCREEN_W)
            };

            if (viewChange) {
                views[i].visible = true;
            }
        } else {
            if (viewChange) {
                views[i].visible = false;
            }
        }
    }

    if (activeView == 0) {
        views[views.length - 1].center = {
            y : arConfig.settings.CENTER_Y,
            x : views[0].center.x - arConfig.settings.SCREEN_W
        };

        if (viewChange) {
            views[views.length - 1].visible = true;
        }
    } else if (activeView == (views.length - 1 )) {
        views[0].center = {
            y : arConfig.settings.CENTER_Y,
            x : views[views.length - 1].center.x + arConfig.settings.SCREEN_W
        };

        if (viewChange) {
            views[0].visible = true;
        }
    }

    // REM this if you don't want the user to see their heading
    label.text = L("ar_label") + Math.floor(currBearing) + "\xB0";

    // Rotate the radar
    radar.transform = Ti.UI.create2DMatrix().rotate(-1 * currBearing);
}

/**
 *  callback listener Aggiornamento accelerometro
 * @param {Object} e
 */
function accelerometerCallback(e) {
    pixelOffsetY = (arConfig.settings.SCREEN_H / 20) * Math.floor(-e.z);
    //Ti.API.debug("CHANGE OFFSET Y: " + pixelOffsetY);
}

/**
 *  Callback listener su aggiornamento location
 * @param {Object} e
 */
function locationCallback(e) {
    myLocation = e.coords;
    //Ti.API.debug("LOCATION CALLBACK: " + myLocation.latitude + " " + myLocation.longitude);
    redrawPois();
};

/**
 * Rilascia tutte le variabili alla chiusura della finestra
 */
function closeAR() {
    Ti.Geolocation.removeEventListener('heading', headingCallback);
    Ti.Geolocation.removeEventListener('location', locationCallback);
    Ti.Accelerometer.removeEventListener('update', accelerometerCallback);
    locationUtils = null;
    overlayLib = null;
    arConfig = null;
    //utils = null;

    //if (!OS_ANDROID) {
    Ti.Media.hideCamera();
    //}
    navigation.closeWindow($.arview);
    //$.destroy();
}

/**
 * Listener su chiusura finestra
 */
$.arview.addEventListener('android:back', function() {
    closeAR();
    $.destroy();
});

