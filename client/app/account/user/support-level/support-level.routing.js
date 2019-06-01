import controller from './support-level.controller';
import template from './support-level.html';

angular
  .module('UserAccount')
  .config(($stateProvider) => {
    const name = 'app.account.user.support-level';

    $stateProvider.state(name, {
      url: '/support/level',
      template,
      controller,
      controllerAs: '$ctrl',
      translations: ['./'],
    });
  });
