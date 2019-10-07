import { API_MODEL_SUPPORT_LEVEL } from './support-level/support-level.constants';
import SupportLevel from './support-level/SupportLevel.class';

import template from './user.html';
import controller from './user.controller';

angular
  .module('UserAccount')
  .config(/* @ngInject */ ($stateProvider) => {
    const name = 'app.account.user';

    $stateProvider.state(name, {
      url: '/useraccount',
      static: true,
      template,
      controller,
      controllerAs: '$ctrl',
      translations: {
        format: 'json',
        value: ['./'],
      },
      redirectTo: `${name}.method`,
      resolve: {
        schema: /* @ngInject */ OvhApiMe => OvhApiMe
          .v6()
          .schema()
          .$promise,
        supportLevel: /* @ngInject */ (
          OvhApiMe,
          schema,
        ) => (schema.models[API_MODEL_SUPPORT_LEVEL] ? OvhApiMe
          .v6()
          .supportLevel()
          .$promise.then(supportLevel => new SupportLevel(supportLevel)) : Promise.resolve(null)),
      },
    });
  });
