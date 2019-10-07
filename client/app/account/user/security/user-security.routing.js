angular
  .module('UserAccount')
  .config(/* @ngInject */($stateProvider) => {
    const name = 'app.account.user.security';

    $stateProvider.state(name, {
      url: '/security',
      templateUrl: 'account/user/security/user-security.html',
      controller: 'UserAccount.controllers.doubleAuth',
      translations: ['../'],
    });
  });
