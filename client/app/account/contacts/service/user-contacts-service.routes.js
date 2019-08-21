angular.module('UserAccount').config(($stateProvider) => {
  $stateProvider.state('app.account.useraccount.contacts.services', {
    url: '/services?serviceName&category',
    templateUrl: 'account/contacts/service/user-contacts-service.html',
    controller: 'UserAccount.controllers.contactServices',
    controllerAs: 'ctrlServices',
  });
});
