angular.module('UserAccount').config(($stateProvider, $urlRouterProvider) => {
  const name = 'app.account.user.contacts';

  $stateProvider.state(name, {
    url: '/contacts',
    templateUrl: 'account/user/contacts/user-contacts.html',
    controller: 'UserAccount.controllers.contactCtrl',
    controllerAs: 'contactCtrl',
    abstract: true,
  });

  $urlRouterProvider.when(
    /^\/useraccount\/contacts$/,
    ($location, $state) => $state.go(`${name}.services`, $location.search()),
  );
});
