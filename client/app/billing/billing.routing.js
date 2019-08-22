import template from './billing.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing', {
    url: '/billing',
    abstract: true,
    translations: { value: ['.'], format: 'json' },
    template,
    controller: 'BillingCtrl',
    resolve: {
      denyEnterprise: ($q, $state, currentUser) => {
        if (currentUser.isEnterprise && $state.transition.to().name !== 'app.account.billing.autorenew.ssh') {
          return $q.reject({
            status: 403,
            message: 'Access forbidden for enterprise accounts',
            code: 'FORBIDDEN_BILLING_ACCESS',
          });
        }

        return false;
      },
    },
  });
};
