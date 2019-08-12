import _ from 'lodash';

angular
  .module('UserAccount')
  .config(($stateProvider, $urlRouterProvider, coreConfigProvider) => {
    const name = 'app.account.user.advanced';

    if (_.includes(['EU', 'CA'], coreConfigProvider.getRegion())) {
      $stateProvider.state(name, {
        url: '/advanced',
        templateUrl: 'account/user/advanced/user-advanced.html',
        controller: 'UserAccount.controllers.advanced',
        translations: {
          format: 'json',
          value: ['../'],
        },
      });
    }
  });
