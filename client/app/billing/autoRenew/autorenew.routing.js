// Should be moved to current folder
import template from './billing-autoRenew.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew', {
    url: '/autorenew',
    // needs to be imported
    controller: 'Billing.controllers.AutoRenew',
    template,
    translations: { value: ['.'], format: 'json' },
    resolve: {
      agreementsLink: /* @ngInject */ $state => $state.href(
        'app.account.billing.autorenew.agreements',
      ),
      currentActiveLink: /* @ngInject */ (
        $state,
        $transition$,
      ) => () => $state.href($transition$.to().name),
      homeLink: /* @ngInject */ $state => $state.href('app.account.billing.autorenew'),
      isEnterpriseCustomer: /* @ngInject */ currentUser => currentUser.isEnterprise,
    },
    redirectTo: /* @ngInject */ isEnterpriseCustomer => (isEnterpriseCustomer ? 'app.account.billing.autorenew.agreements' : false),
  });
};
