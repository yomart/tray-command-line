'use strict';

var remote = require('electron').remote;

angular
.module('IndexView', ['Command'])
.controller('IndexCtrl', ['$scope', '$filter', 'CommandDAO',
function(scope, $filter, CommandDAO) {

	var vm = this;
	vm.selectedCommand = null;

	CommandDAO
	.init()
	.then(function(db) {
		reload();
	});
	//ipcRenderer.on('info' , function(event , data){ console.log(data.msg) });

	var reload = function(){
		vm.commands = CommandDAO.getAll();
		orderCommands();
	}

	vm.refresh = function(){
		CommandDAO
		.init()
		.then(function(db) {
			reload();
		});
	}

	var orderCommands = function(){
		vm.commands = $filter('orderBy')(vm.commands, 'order');
	}

	vm.quit = function(){
		window.close();
	}

	vm.showSettings = function(){
		ipcRenderer.send('show-edit-window');
	}

	vm.run = function(cmd){
		ipcRenderer.send('run-command',cmd);
	}
}]);
