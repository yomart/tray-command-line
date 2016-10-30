angular
.module('Command', ['Base'])
.service('CommandDAO', ['BaseDAO',CommandDAO])
;

function CommandDAO(BaseDAO) {
  angular.extend(CommandDAO.prototype, BaseDAO);
  this.collectionName = 'command';
}
