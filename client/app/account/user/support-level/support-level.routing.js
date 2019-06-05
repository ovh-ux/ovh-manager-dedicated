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
      resolve: {
        supportLevel: /* @ngInject */ OvhApiMe => OvhApiMe
          .v6()
          .supportLevel()
          .$promise,
        schema: /* @ngInject */ OvhApiMe => OvhApiMe
          .v6()
          .schema()
          .$promise,
      },
    });
  });
