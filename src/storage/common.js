
var electron = require('electron').remote;

const {ipcRenderer} = require('electron');
  var  clipboard = electron.clipboard,
    uuid = require('uuid'),
    loki = require('lokijs'),
    path = require('path');

angular
    .module('Common', [])
    .factory('Generator', function() {
        return {
            create: function() {
                return uuid.v4();
            }
        };
    })
    .service('Storage', ['$q', function($q) {
        this.db = new loki(path.resolve(__dirname, '../..', 'app.db'));
        this.collection = null;
        this.loaded = false;

        this.init = function(collectionName) {
            var d = $q.defer();

            this.reload()
                .then(function() {
                    this.collection = this.db.getCollection(collectionName);
                    // this.loaded = true;

                    d.resolve(this);
                }.bind(this))
                .catch(function(e) {
                    // create collection
                    this.db.addCollection(collectionName);
                    // save and create file
                    this.db.saveDatabase();

                    this.collection = this.db.getCollection(collectionName);
                    // this.loaded = true;

                    d.resolve(this);
                }.bind(this));

            return d.promise;
        };

        this.reload = function() {
            var d = $q.defer();

            this.loaded = false;

            this.db.loadDatabase({}, function(e) {
                if(e) {
                    d.reject(e);
                } else {
                    this.loaded = true;
                    d.resolve(this);
                }
            }.bind(this));

            return d.promise;
        };

        this.getCollection = function(collectionName) {
            this.collection = this.db.getCollection(collectionName);
            return this.collection;
        };

        this.isLoaded = function() {
            return this.loaded;
        };

        this.addDoc = function(data, collectionName) {
            var d = $q.defer();

            if(this.isLoaded() && this.getCollection(collectionName)) {
                this.getCollection(collectionName).insert(data);
                this.db.saveDatabase();

                d.resolve(this.getCollection(collectionName));
            } else {
                d.reject(new Error('DB NOT READY'));
            }

            return d.promise;
        };

				this.updateDoc = function(data, collectionName) {
						var d = $q.defer();

						if(this.isLoaded() && this.getCollection(collectionName)) {
								this.getCollection(collectionName).update(data);
								this.db.saveDatabase();

								d.resolve(this.getCollection(collectionName));
						} else {
								d.reject(new Error('DB NOT READY'));
						}

						return d.promise;
				};

        this.removeDoc = function(doc, collectionName) {
            return function() {
                var d = $q.defer();
                if(this.isLoaded() && this.getCollection(collectionName)) {
                    this.getCollection(collectionName).remove(doc);
                    this.db.saveDatabase();
                    // we need to inform the insert view that the db content has changed
                    //ipcRenderer.send('reload-insert-view');

                    d.resolve(true);
                } else {
                    d.reject(new Error('DB NOT READY'));
                }

                return d.promise;
            }.bind(this);
        };
    }])
    ;
