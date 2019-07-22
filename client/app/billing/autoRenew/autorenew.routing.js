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
      sshLink: /* @ngInject */ $state => $state.href('app.account.billing.autorenew.ssh'),
      isEnterpriseCustomer: /* @ngInject */ currentUser => currentUser.isEnterprise,
      goToAutorenew: /* @ngInject */ ($state, $timeout, Alerter) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go('app.account.billing.autorenew', {}, {
          reload,
        });

        if (message) {
          promise.then(() => $timeout(() => Alerter.set(`alert-${type}`, message)));
        }

        return promise;
      },
    },
    redirectTo: /* @ngInject */ isEnterpriseCustomer => (isEnterpriseCustomer ? 'app.account.billing.autorenew.agreements' : false),
  });
};
