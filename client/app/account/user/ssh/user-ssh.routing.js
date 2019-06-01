import template from './user-ssh.html';
import controller from './user-ssh.controller';

angular
  .module('UserAccount')
  .config(($stateProvider) => {
    const name = 'app.account.user.ssh';

    $stateProvider.state(name, {
      url: '/ssh',
      template,
      controller,
      controllerAs: '$ctrl',
      translations: ['../'],
    });
  });
