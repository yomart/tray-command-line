'use strict';

var remote = require('electron').remote;

angular
.module('EditView', ['Command', 'Common'])
.controller('EditCtrl', ['$scope', '$filter','Generator', 'CommandDAO',
function(scope, $filter, Generator, CommandDAO) {

	var vm = this;
	vm.isCommandOpened = false;
	vm.selectedCommand = null;
	var init = true;
	var command_ref = null;

	CommandDAO
	.init()
	.then(function(db) {
		reload();
	});

	var createNewCommand =  function(){
		return {
			uuid:Generator.create(),
			name:'New command',
			command:'',
			description: 'New command description',
			order:0,
			show:false
		};
	}

	var reload = function(){
		vm.commands = CommandDAO.getAll();
		orderCommands();
	}

	var orderCommands = function(){
		vm.commands = $filter('orderBy')(vm.commands, 'order');
	}

	vm.editCommand = function(cmd){
		if(init){
			document.getElementById('edit-command').style.visibility = "visible";
			init= false;
		}
		vm.isCommandOpened = true;
		command_ref = cmd;
		vm.selectedCommand = angular.copy(cmd);
	}

	vm.deleteCommand = function(cmd){
		//delete from db
		CommandDAO
		.reload()
		.then(CommandDAO.remove(cmd))
		.then(function() {
			reload();
		});
	}

	vm.add = function(){
		CommandDAO
		.reload()
		.then(function(){
			CommandDAO.add(createNewCommand());
		})
		.then(function() {
			reload();
		});
	};

	vm.cancel = function(){
		closeEditPanel();
		//refresh items
	}

	var closeEditPanel = function(){
		vm.isCommandOpened = false;
		vm.selectedCommand = null;
	}

	vm.quit = function(){
		ipcRenderer.send('hide-edit-window');
	}

	vm.update = function(){
		//save in DB
		CommandDAO
		.reload()
		.then(function(){
			CommandDAO.update(vm.selectedCommand);
		})
		.then(function() {
			closeEditPanel();
			reload();
		});

	}


}]);
