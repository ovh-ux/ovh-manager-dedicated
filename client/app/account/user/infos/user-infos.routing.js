angular
  .module('UserAccount')
  .config(($stateProvider) => {
    const name = 'app.account.user.infos';

    $stateProvider.state(name, {
      url: '/infos',
      templateUrl: 'account/user/infos/user-infos.html',
      controller: 'UserAccount.controllers.Infos',
      translations: ['../newAccountForm'],
    });
  });
