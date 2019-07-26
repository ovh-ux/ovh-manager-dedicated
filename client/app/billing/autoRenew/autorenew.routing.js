import _ from 'lodash';
import { MIN_DOMAIN_LENGTH } from './autorenew.constants';

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

      user: /* @ngInject */ User => User.getUser(),
      userIsBillingOrAdmin: /* @ngInject */ user => service => service
        && Boolean(user
          && (service.contactBilling === user.nichandle
            || service.contactAdmin === user.nichandle)),

      updateServices: /* @ngInject */ $state => ({ serviceId }) => $state.go('app.account.billing.autorenew.update', { serviceId }),

      canResiliate: /* @ngInject */ userIsBillingOrAdmin => (service) => {
        const canDeleteAtExpiration = service.canDeleteAtExpiration
          || (service.service && service.service.canDeleteAtExpiration);
        return canDeleteAtExpiration && userIsBillingOrAdmin(service);
      },

      resiliateService: /* @ngInject */ $state => ({
        serviceId,
      }) => $state.go('app.account.billing.autorenew.delete', { serviceId }),

      canCancelResiliation: /* @ngInject */ userIsBillingOrAdmin => service => service.renew
          && service.renew.deleteAtExpiration
          && !service.renew.manualPayment
          && userIsBillingOrAdmin(service),

      cancelServiceResiliation: /* @ngInject */ $state => ({
        serviceId,
      }) => $state.go('app.account.billing.autorenew.cancelResiliation', { serviceId }),

      canDisableAllDomains: /* @ngInject */ services => _.filter(services, 'serviceType', 'DOMAIN').length > MIN_DOMAIN_LENGTH,
      disableAutorenewForDomains: /* @ngInject */ $state => () => $state.go('app.account.billing.autorenew.disableDomainsBulk'),

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
