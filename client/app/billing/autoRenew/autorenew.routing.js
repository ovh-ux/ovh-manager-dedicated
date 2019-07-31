import _ from 'lodash';
import BillingService from './BillingService.class';
import { NIC_ALL } from './autorenew.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew', {
    url: '/autorenew?selectedType&pageSize&pageNumber&filters&searchText&nicBilling&sort',
    component: 'autoRenew',
    translations: { value: ['.'], format: 'json' },
    params: {
      filters: {
        value: '{}',
        squash: true,
      },
      nicBilling: {
        value: null,
        squash: true,
      },
      pageNumber: {
        value: '1',
        squash: true,
      },
      pageSize: {
        value: '25',
        squash: true,
      },
      searchText: {
        value: null,
        squash: true,
      },
      selectedType: {
        value: null,
        squash: true,
      },
      sort: {
        value: JSON.stringify({ predicate: 'expiration', reverse: false }),
        squash: true,
      },
    },
    resolve: {
      activationLink: /* @ngInject */ $state => $state.href(
        'app.account.billing.autorenew.activation',
      ),
      agreementsLink: /* @ngInject */ $state => $state.href(
        'app.account.billing.autorenew.agreements',
      ),
      billingServices: /* @ngInject */ services => _.map(
        services.list.results,
        service => new BillingService(service),
      ),
      cancelServiceResiliation: /* @ngInject */ $state => ({
        serviceId,
      }) => $state.go('app.account.billing.autorenew.cancelResiliation', { serviceId }),
      canDisableAllDomains: /* @ngInject */ services => services.bulkDomains,
      currentActiveLink: /* @ngInject */ $state => () => $state.href($state.current.name),
      defaultPaymentMean: /* @ngInject */
        ovhPaymentMethod => ovhPaymentMethod.getDefaultPaymentMethod(),
      disableAutorenewForDomains: /* @ngInject */ $state => () => $state.go('app.account.billing.autorenew.disableDomainsBulk'),
      disableBulkAutorenew: /* @ngInject */ $state => services => $state.go('app.account.billing.autorenew.disable', {
        services: _.map(services, 'id').join(','),
      }),

      enableBulkAutorenew: /* @ngInject */ $state => services => $state.go('app.account.billing.autorenew.enable', {
        services: _.map(services, 'id').join(','),
      }),
      filters: /* @ngInject */ $transition$ => JSON.parse($transition$.params().filters),
      homeLink: /* @ngInject */ $state => $state.href('app.account.billing.autorenew'),
      sshLink: /* @ngInject */ $state => $state.href('app.account.billing.autorenew.ssh'),
      isEnterpriseCustomer: /* @ngInject */ currentUser => currentUser.isEnterprise,

      getSMSAutomaticRenewalURL: /* @ngInject */ constants => service => `${constants.MANAGER_URLS.telecom}sms/${service.serviceId}/options/recredit`,
      getSMSCreditBuyingURL: /* @ngInject */ constants => service => `${constants.MANAGER_URLS.telecom}sms/${service.serviceId}/order`,

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

      hasAutoRenew: /* @ngInject */ billingRenewHelper => service => billingRenewHelper
        .serviceHasAutomaticRenew(service),

      nicBilling: /* @ngInject */ $transition$ => $transition$.params().nicBilling,
      nicRenew: /* @ngInject */ (
        BillingAutoRenew,
        services,
      ) => BillingAutoRenew.getAutorenew()
        .then(nicRenew => ({
          ...nicRenew,
          isMandatory: services.userMustApproveAutoRenew,
          renewDays: _.range(1, 30),
        })),

      nics: /* @ngInject */ (
        $translate,
        services,
      ) => [$translate.instant(NIC_ALL), ..._.get(services, 'nicBilling', [])],

      onListParamChanges: /* @ngInject */ $state => params => $state.go('.', params,
        { notify: false }),

      pageNumber: /* @ngInject */ $transition$ => parseInt($transition$.params().pageNumber, 10),
      pageSize: /* @ngInject */ $transition$ => parseInt($transition$.params().pageSize, 10),

      resiliateService: /* @ngInject */ $state => ({
        serviceId,
      }) => $state.go('app.account.billing.autorenew.delete', { serviceId }),

      searchText: /* @ngInject */ $transition$ => $transition$.params().searchText,

      selectedType: /* @ngInject */ $transition$ => $transition$.params().selectedType,

      services: /* @ngInject */ (
        BillingAutoRenew,
        filters,
        nicBilling,
        pageNumber,
        pageSize,
        searchText,
        selectedType,
        sort,
      ) => BillingAutoRenew.getServices(
        pageSize,
        pageNumber - 1,
        searchText,
        selectedType,
        filters.expiration,
        filters.status,
        sort,
        nicBilling,
      ),

      serviceTypes: /* @ngInject */ (
        BillingAutoRenew,
        services,
      ) => BillingAutoRenew.getServicesTypes(services),

      sort: /* @ngInject */ $transition$ => $transition$.params().sort,

      terminateEmail: /* @ngInject */ $state => serviceId => $state.go('app.account.billing.autorenew.terminateEmail', { serviceId }),
      terminateHostingWeb: /* @ngInject */ $state => serviceId => $state.go('app.account.billing.autorenew.terminateHostingWeb', { serviceId }),
      terminatePrivateDatabase: /* @ngInject */ $state => serviceId => $state.go('app.account.billing.autorenew.terminatePrivateDatabase', { serviceId }),

      updateServices: /* @ngInject */ $state => ({ serviceId }) => $state.go('app.account.billing.autorenew.update', { serviceId }),
      updateExchangeBilling: /* @ngInject */ $state => ({ serviceId }) => $state.go('app.account.billing.autorenew.exchange', { serviceId }),

      warnNicBilling: /* @ngInject */ $state => nic => $state.go('app.account.billing.autorenew.warnNic', { nic }),
      warnNicPendingDebt: /* @ngInject */ $state => serviceName => $state.go('app.account.billing.autorenew.warnPendingDebt', { serviceName }),
    },
    redirectTo: /* @ngInject */ isEnterpriseCustomer => (isEnterpriseCustomer ? 'app.account.billing.autorenew.agreements' : false),
  });
};
