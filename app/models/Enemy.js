exports.definition = {
    config : {
        columns : {
            "lat" : "real",
            "lon" : "real",
            "name" : "text",
            "icon" : "text",
            "status" : "integer",
            "value" : "integer",
            "type" : "text"
        },
        adapter : {
            type : "sql",
            collection_name : "Enemy"
        }
    },
    extendModel : function(Model) {
        _.extend(Model.prototype, {
            
            /**
             * ritorna il controller necessario
             */
            getEnemyController : function() {
                return Alloy.createController("enemy", {
                    enemy : this
                });
            },
        });

        return Model;
    },
    extendCollection : function(Collection) {
        _.extend(Collection.prototype, {
            // extended functions and properties go here
        });

        return Collection;
    }
}; 