import _ from 'lodash';

angular
  .module('UserAccount')
  .config(($stateProvider, $urlRouterProvider, coreConfigProvider) => {
    const name = 'app.account.user.emails';
    const nameDetails = 'app.account.user.emailsDetails';

    if (_.includes(['EU', 'CA'], coreConfigProvider.getRegion())) {
      $stateProvider.state(name, {
        url: '/emails',
        templateUrl: 'account/user/emails/user-emails.html',
        controller: 'UserAccount.controllers.emails',
        translations: {
          format: 'json',
          value: ['../'],
        },
      });

      $stateProvider.state(nameDetails, {
        url: '/emails/:emailId',
        templateUrl: 'account/user/emails/details/user-emails-details.html',
        controller: 'UserAccount.controllers.emails.details',
      });
    }
  });
