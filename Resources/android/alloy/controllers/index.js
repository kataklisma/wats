function Controller() {
    function createEnemies() {
        var enemy = Alloy.createModel("Enemy", {
            lat: "37.50942942",
            lon: "15.08363915",
            name: Alloy.Globals.DefaultEnemy.NAME,
            icon: Alloy.Globals.DefaultEnemy.IMAGE,
            status: 0,
            value: Alloy.Globals.DefaultEnemy.VALUE,
            type: Alloy.Globals.DefaultEnemy.TYPE
        });
        enemy.save();
        var enemies = Alloy.createCollection("Enemy");
        enemies.add(enemy);
        return enemies;
    }
    function start() {
        Alloy.createController("ar", {
            enemies: createEnemies()
        }).getView().open();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        zIndex: 0,
        orientationModes: [ Ti.UI.PORTRAIT ],
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.start = Ti.UI.createButton({
        id: "start",
        title: "start"
    });
    $.__views.index.add($.__views.start);
    start ? $.__views.start.addEventListener("click", start) : __defers["$.__views.start!click!start"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    __defers["$.__views.start!click!start"] && $.__views.start.addEventListener("click", start);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;