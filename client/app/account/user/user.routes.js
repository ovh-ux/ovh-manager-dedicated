import template from './user.html';
import controller from './user.controller';

angular
  .module('UserAccount')
  .config(($stateProvider) => {
    const name = 'app.account.user';

    $stateProvider.state(name, {
      url: '/useraccount',
      static: true,
      template,
      controller,
      controllerAs: '$ctrl',
      translations: ['./'],
      redirectTo: `${name}.method`,
    });
  });
