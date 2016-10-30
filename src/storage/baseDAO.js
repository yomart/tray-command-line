angular
    .module('Base', ['Common'])
    .service('BaseDAO', ['Storage', function(Storage) {

				this.collectionName = 'base';

        this.init = function() {
					return Storage.init(this.collectionName);
        };

        this.reload = function() {
          return Storage.reload();
        };

        this.getCollection = function() {
            return Storage.getCollection(this.collectionName);
        };

        this.isLoaded = function() {
            return Storage.isLoaded();
        };

        this.add = function(data) {
            return Storage.addDoc(data, this.collectionName);
        };

				this.update = function(data) {
						return Storage.updateDoc(data, this.collectionName);
				};

        this.remove = function(data) {
            return Storage.removeDoc(data, this.collectionName);
        };

        this.getAll = function() {
					return (this.getCollection()) ? this.getCollection().data : null;
        };
    }])
    ;
