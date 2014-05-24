exports.definition = {
	config: {
		columns: {
		    "lat": "float",
		    "lon": "float",
		    "name": "string",
		    "icon": "string",
		    "status": "int",
		    "value": "int",
		    "type": "string"
		},
		adapter: {
			type: "sql",
			collection_name: "Enemy"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};