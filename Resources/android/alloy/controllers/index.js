function Controller() {
    function start() {
        createEnemies();
        Alloy.createController("ar", {
            enemies: Alloy.Collections.Enemy
        }).getView().open();
    }
    function createEnemies() {
        var enemy = Alloy.createModel("Enemy", {
            name: Alloy.Globals.DefaultEnemy.NAME,
            lat: "37.50942942",
            lon: "15.08363915",
            type: Alloy.Globals.DefaultEnemy.TYPE,
            point: Alloy.Globals.DefaultEnemy.POINT,
            image: Alloy.Globals.DefaultEnemy.IMAGE,
            status: 0
        });
        enemy.save();
        Alloy.Collections.Enemy.add(enemy);
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