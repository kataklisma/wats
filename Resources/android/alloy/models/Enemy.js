exports.definition = {
    config: {
        columns: {
            lat: "real",
            lon: "real",
            name: "text",
            icon: "text",
            status: "integer",
            value: "integer",
            type: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "Enemy"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            getEnemyController: function() {
                return Alloy.createController("Enemy", {
                    enemy: this
                });
            }
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("Enemy", exports.definition, []);

collection = Alloy.C("Enemy", exports.definition, model);

exports.Model = model;

exports.Collection = collection;