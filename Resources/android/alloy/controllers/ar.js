function Controller() {
    function assignPOIs() {
        _.each(pois, function(enemy) {
            Ti.API.info(enemy);
            var enemyController = enemy.getEnemyController();
            var enemyView = enemyController.getView();
            poi.view = enemyView;
        });
        $.arview.pois = pois;
        arConfig.openCamera(headingCallback, locationCallback, accelerometerCallback, closeAR, overlay);
    }
    function redrawPois() {
        if (!myLocation) {
            Ti.API.warn("location not known. Can't draw pois");
            return;
        }
        overlayLib.resetViews();
        activePois = [];
        _.each($.arview.pois, function(poi) {
            if (poi.view) {
                var distance = locationUtils.calculateDistance(myLocation, poi);
                if (arConfig.settings.MAX_DIST > distance) {
                    var bearing = locationUtils.calculateBearing(myLocation, poi);
                    var internalBearing = bearing / (360 / views.length);
                    var activeView = Math.floor(internalBearing);
                    activeView >= views.length && (activeView = 0);
                    var pixelOffset = Math.floor(internalBearing % 1 * arConfig.settings.SCREEN_W) + (views[0].width - arConfig.settings.SCREEN_W) / 2;
                    poi.distance = distance;
                    poi.pixelOffset = pixelOffset;
                    poi.activeView = activeView;
                    poi.bearing = bearing;
                    activePois.push(poi);
                } else Ti.API.debug(poi.title + " NOT ADDED, maxDistance=" + arConfig.settings.MAX_DIST);
            }
        });
        activePois.sort(function(a, b) {
            return b.distance - a.distance;
        });
        if (0 != activePois.length) {
            var maxDistance = activePois[0].distance;
            var minDistance = activePois[activePois.length - 1].distance;
            var distanceDelta = maxDistance - minDistance;
        }
        for (var i = 0; activePois.length > i; i++) {
            var poi = activePois[i];
            arConfig.settings.SHOW_COLORS && Ti.API.debug("viewColor=" + views[poi.activeView].backgroundColor);
            var distanceFromSmallest = poi.distance - minDistance;
            var percentFromSmallest = 1 - distanceFromSmallest / distanceDelta;
            var zoom = percentFromSmallest * arConfig.settings.DELTA_ZOOM + arConfig.MIN_ZOOM;
            var y = arConfig.MIN_Y + percentFromSmallest * arConfig.settings.DELTA_Y;
            var view = poi.view;
            var transform = Ti.UI.create2DMatrix();
            transform = transform.scale(zoom);
            view.transform = transform;
            view.center = {
                x: poi.pixelOffset,
                y: y
            };
            views[poi.activeView].add(view);
            overlayLib.addBlipToRadar(poi, maxDistance, locationUtils.toRad(poi.bearing));
        }
    }
    function headingCallback(e) {
        var currBearing = e.heading.trueHeading;
        var internalBearing = currBearing / (360 / views.length);
        var activeView = Math.floor(internalBearing);
        var pixelOffset = arConfig.settings.SCREEN_W - Math.floor(internalBearing % 1 * arConfig.settings.SCREEN_W);
        if (activeView != lastActiveView) {
            viewChange = true;
            lastActiveView = activeView;
        } else viewChange = false;
        for (var i = 0; views.length > i; i++) {
            1.05 * views[i].top - views[i].top;
            var diff = activeView - i;
            if (diff >= -1 && 1 >= diff) {
                views[i].center = {
                    y: arConfig.settings.CENTER_Y,
                    x: pixelOffset + -1 * diff * arConfig.settings.SCREEN_W
                };
                viewChange && (views[i].visible = true);
            } else viewChange && (views[i].visible = false);
        }
        if (0 == activeView) {
            views[views.length - 1].center = {
                y: arConfig.settings.CENTER_Y,
                x: views[0].center.x - arConfig.settings.SCREEN_W
            };
            viewChange && (views[views.length - 1].visible = true);
        } else if (activeView == views.length - 1) {
            views[0].center = {
                y: arConfig.settings.CENTER_Y,
                x: views[views.length - 1].center.x + arConfig.settings.SCREEN_W
            };
            viewChange && (views[0].visible = true);
        }
        label.text = L("ar_label") + Math.floor(currBearing) + "°";
        radar.transform = Ti.UI.create2DMatrix().rotate(-1 * currBearing);
    }
    function accelerometerCallback(e) {
        pixelOffsetY = arConfig.settings.SCREEN_H / 20 * Math.floor(-e.z);
    }
    function locationCallback(e) {
        myLocation = e.coords;
        redrawPois();
    }
    function closeAR() {
        Ti.Geolocation.removeEventListener("heading", headingCallback);
        Ti.Geolocation.removeEventListener("location", locationCallback);
        Ti.Accelerometer.removeEventListener("update", accelerometerCallback);
        locationUtils = null;
        overlayLib = null;
        arConfig = null;
        Ti.Media.hideCamera();
        navigation.closeWindow($.arview);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "ar";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.arview = Ti.UI.createWindow({
        backgroundColor: "#f5f5f5",
        top: "0dp",
        left: "0dp",
        zIndex: 0,
        fullscreen: true,
        navBarHidden: true,
        id: "arview",
        layout: "vertical"
    });
    $.__views.arview && $.addTopLevelView($.__views.arview);
    $.__views.__alloyId0 = Ti.UI.createView({
        id: "__alloyId0"
    });
    $.__views.arview.add($.__views.__alloyId0);
    $.__views.__alloyId1 = Ti.UI.createLabel({
        text: "Window che contiene la realtà aumentata",
        id: "__alloyId1"
    });
    $.__views.__alloyId0.add($.__views.__alloyId1);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var arConfig = require("ar/arConfig");
    var overlayLib = require("ar/overlay");
    var locationUtils = require("locationUtils");
    var lastActiveView = -1;
    var viewChange = false;
    var activePois = [];
    var pixelOffsetY = 0;
    var myLocation = null;
    var overlay = overlayLib.getOverlay();
    var views = overlayLib.views;
    var label = overlayLib.debugLabel;
    var radar = overlayLib.radar;
    var pois = null;
    $.arview.addEventListener("open", function() {
        locationUtils.initGeoSettings();
        var closeButton = overlayLib.closeButton();
        closeButton.addEventListener("click", closeAR);
        overlay.add(closeButton);
        pois = args.enemies;
        pois.fetch();
        Ti.API.info(pois);
        assignPOIs();
    });
    $.arview.addEventListener("android:back", function() {
        closeAR();
        $.destroy();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;