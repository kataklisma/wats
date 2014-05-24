function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "black",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.home - menu = Ti.UI.createView({
        id: "home-menu"
    });
    $.__views.index.add($.__views.home - menu);
    $.__views.home - menu - easy = Ti.UI.createButton({
        id: "home-menu-easy",
        title: "EASY"
    });
    $.__views.home - menu.add($.__views.home - menu - easy);
    exports.destroy = function() {};
    _.extend($, $.__views);
    alert("ciao");
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;