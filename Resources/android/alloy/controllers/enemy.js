function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "enemy";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.enemy = Alloy.createModel("Enemy");
    $.__views.enemyView = Ti.UI.createView({
        id: "enemyView"
    });
    $.__views.enemyView && $.addTopLevelView($.__views.enemyView);
    $.__views.enemyIcon = Ti.UI.createImageView({
        id: "enemyIcon"
    });
    $.__views.enemyView.add($.__views.enemyIcon);
    var __alloyId2 = function() {
        $.enemyIcon.image = _.isFunction($.enemy.transform) ? $.enemy.transform()["icon"] : $.enemy.get("icon");
        $.enemyIcon.image = _.isFunction($.enemy.transform) ? $.enemy.transform()["icon"] : $.enemy.get("icon");
    };
    $.enemy.on("fetch change destroy", __alloyId2);
    exports.destroy = function() {
        $.enemy.off("fetch change destroy", __alloyId2);
    };
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var enemy = args.enemy;
    $.enemy.set(enemy);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;