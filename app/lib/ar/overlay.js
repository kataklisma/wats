var arConfig = require("ar/arConfig");

var views = [];

// Create all the view that will contain the points of interest
function getOverlay() {

    // Create the main view - only as wide as the viewport
    var overlay = Ti.UI.createView({
        top : 0,
        left : 0,
        height : arConfig.settings.SCREEN_H,
        width : arConfig.settings.SCREEN_W,
        backgroundColor : 'transparent'
    });

    for (var i = 0; i < arConfig.settings.NUM_OF_VIEWS; i++) {
        
        // create a view 1.6x the screen width
        // they will overlap so any poi view that
        // are near the edge will continue over into the
        // 'next' view.
        views[i] = Ti.UI.createView({
            top : 0,
            right : 0,
            height : arConfig.settings.SCREEN_H,
            width : arConfig.settings.SCREEN_W * 1.6,
            visible : false
        });

        if (arConfig.settings.SHOW_COLORS) {
            views[i].backgroundColor = arConfig.settings.COLORS[i];
            views[i].opacity = 0.5;
        }

        overlay.add(views[i]);
    };

    //crea la label in basso doe viene stampato i gradi
    var label = Ti.UI.createLabel({
        bottom : '20dp',
        height : '20dp',
        text : "",
        textAlign : 'center',
        color : '#f5f5f5',
        backgroundColor : '#272822',
        opacity : 0.7,
        font : {
            fontSize : '14dp'
        }
    });
    //crea il radar a fondo pagina
    var radar = Ti.UI.createView({
        backgroundImage : '/images/ic_radar.png',
        width : '100dp',
        height : '100dp',
        top : '10dp',
        left : '10dp',
        opacity : 0.7
    });

    overlay.add(radar);
    overlay.add(label);

    exports.debugLabel = label;
    exports.radar = radar;

    return overlay;
}

/**
 * Aggiunge un blip al radar
 */
function addBlipToRadar(poi, maxDistance, rad) {
    var relativeDistance = poi.distance / (maxDistance * 1.2);
    var centerX = (50 + (relativeDistance * 50 * Math.sin(rad)));
    var centerY = (50 - (relativeDistance * 50 * Math.cos(rad)));

    var displayBlip = Ti.UI.createView({
        height : '3dp',
        width : '3dp',
        backgroundColor : 'black',
        borderRadius : 4,
        top : (centerY - 1) + "dp",
        left : (centerX - 1) + "dp"
    });

    exports.radar.add(displayBlip);
};

/**
 *  Rimuove i blip dal radar
 */
function resetRadar(view) {
    if (radar.children.length > 0) {
        for (var j = radar.children.length; j > 0; j--) {
            try {
                radar.remove(view.children[j - 1]);
            } catch (e) {
                Ti.API.error('error removing child ' + j + ' from radar');
            }
        }
    }
};

/**
 * Rimuove tutti i figli delle views
 */
function resetViews() {
    for (var i = 0; i < views.length; i++) {
        //Ti.API.info(views);
        var view = views[i];
        if (view.children) {
            if (view.children.length > 0) {
                for (var j = view.children.length; j > 0; j--) {
                    try {
                        view.remove(view.children[j - 1]);
                    } catch (e) {
                        Ti.API.error('error removing child ' + j + ' from view');
                    }
                }
            }
        }
    }
};

/**
 * creo il botton per chiudere la AR se non sono una android
 */
function closeButton() {
    return Ti.UI.createButton({
        top : '5dp',
        right : '5dp',
        height : '45dp',
        width : '45dp',
        backgroundImage : '/images/ic_close.png'
    });
};

exports.getOverlay = getOverlay;
exports.views = views;
exports.closeButton = closeButton;
exports.addBlipToRadar = addBlipToRadar;
exports.resetRadar = resetRadar;
exports.resetViews = resetViews;
