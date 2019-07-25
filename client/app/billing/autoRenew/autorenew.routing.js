import _ from 'lodash';

import BillingService from './BillingService.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew', {
    url: '/autorenew',
    component: 'autoRenew',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      agreementsLink: /* @ngInject */ $state => $state.href(
        'app.account.billing.autorenew.agreements',
      ),
      currentActiveLink: /* @ngInject */ (
        $state,
        $transition$,
      ) => () => $state.href($transition$.to().name),
      defaultPaymentMean: /* @ngInject */
        ovhPaymentMethod => ovhPaymentMethod.getDefaultPaymentMethod(),
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

      allServices: /* @ngInject */ BillingAutoRenew => BillingAutoRenew.getAllServices(),
      services: /* @ngInject */ allServices => _.get(allServices, 'list.results', []),
      nicBilling: /* @ngInject */ allServices => _.get(allServices, 'nicBilling', []),

      getSMSAutomaticRenewalURL: /* @ngInject */ constants => service => `${constants.MANAGER_URLS.telecom}sms/${service.serviceId}/options/recredit`,
      getSMSCreditBuyingURL: /* @ngInject */ constants => service => `${constants.MANAGER_URLS.telecom}sms/${service.serviceId}/order`,

      filtersOptions: /* @ngInject */ ($translate, services) => {
        const serviceTypesValues = _(services)
          .map('serviceType')
          .uniq()
          .mapKeys()
          .mapValues(serviceType => $translate.instant(`autorenew_service_type_${serviceType}`))
          .value();

        return {
          serviceType: {
            hideOperators: true,
            values: serviceTypesValues,
          },
          renewStatus: {
            hideOperators: true,
            values: [],
          },
          renewExpiration: {
            hideOperators: true,
            values: [],
          },
        };
      },
    },
    redirectTo: /* @ngInject */ isEnterpriseCustomer => (isEnterpriseCustomer ? 'app.account.billing.autorenew.agreements' : false),
  });
};
