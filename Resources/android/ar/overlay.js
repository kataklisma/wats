function getOverlay() {
    var overlay = Ti.UI.createView({
        top: 0,
        left: 0,
        height: arConfig.settings.SCREEN_H,
        width: arConfig.settings.SCREEN_W,
        backgroundColor: "transparent"
    });
    for (var i = 0; arConfig.settings.NUM_OF_VIEWS > i; i++) {
        views[i] = Ti.UI.createView({
            top: 0,
            right: 0,
            height: arConfig.settings.SCREEN_H,
            width: 1.6 * arConfig.settings.SCREEN_W,
            visible: false
        });
        if (arConfig.settings.SHOW_COLORS) {
            views[i].backgroundColor = arConfig.settings.COLORS[i];
            views[i].opacity = .5;
        }
        overlay.add(views[i]);
    }
    var label = Ti.UI.createLabel({
        bottom: "20dp",
        height: "20dp",
        text: "",
        textAlign: "center",
        color: "#f5f5f5",
        backgroundColor: "#272822",
        opacity: .7,
        font: {
            fontSize: "14dp"
        }
    });
    var radar = Ti.UI.createView({
        backgroundImage: "/images/ic_radar.png",
        width: "100dp",
        height: "100dp",
        top: "10dp",
        left: "10dp",
        opacity: .7
    });
    overlay.add(radar);
    overlay.add(label);
    exports.debugLabel = label;
    exports.radar = radar;
    return overlay;
}

function addBlipToRadar(poi, maxDistance, rad) {
    var relativeDistance = poi.distance / (1.2 * maxDistance);
    var centerX = 50 + 50 * relativeDistance * Math.sin(rad);
    var centerY = 50 - 50 * relativeDistance * Math.cos(rad);
    var displayBlip = Ti.UI.createView({
        height: "3dp",
        width: "3dp",
        backgroundColor: Alloy.Globals.defaultTitleColor,
        borderRadius: 4,
        top: centerY - 1 + "dp",
        left: centerX - 1 + "dp"
    });
    exports.radar.add(displayBlip);
}

function resetRadar(view) {
    if (radar.children.length > 0) for (var j = radar.children.length; j > 0; j--) try {
        radar.remove(view.children[j - 1]);
    } catch (e) {
        Ti.API.error("error removing child " + j + " from radar");
    }
}

function resetViews() {
    for (var i = 0; views.length > i; i++) {
        var view = views[i];
        if (view.children && view.children.length > 0) for (var j = view.children.length; j > 0; j--) try {
            view.remove(view.children[j - 1]);
        } catch (e) {
            Ti.API.error("error removing child " + j + " from view");
        }
    }
}

function closeButton() {
    return Ti.UI.createButton({
        top: "5dp",
        right: "5dp",
        height: "45dp",
        width: "45dp",
        backgroundImage: "/images/ic_close.png"
    });
}

var arConfig = require("ar/arConfig");

var views = [];

exports.getOverlay = getOverlay;

exports.views = views;

exports.closeButton = closeButton;

exports.addBlipToRadar = addBlipToRadar;

exports.resetRadar = resetRadar;

exports.resetViews = resetViews;