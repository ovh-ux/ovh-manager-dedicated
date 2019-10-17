angular
  .module('UserAccount')
  .config(/* @ngInject */($stateProvider) => {
    const name = 'app.account.user.security.mfa';

    $stateProvider.state(name, {
      url: '/mfa',
      templateUrl: 'account/user/security/2fa/user-security-2fa.html',
      controller: 'UserAccount.controllers.doubleAuth.2fa.enable',
      translations: { value: ['../..'], format: 'json' },
      layout: 'modal',
      toChilds: true,
    });
  });
