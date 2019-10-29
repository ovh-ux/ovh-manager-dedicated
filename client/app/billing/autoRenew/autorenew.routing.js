import _ from 'lodash';
import BillingService from '../../models/BillingService.class';
import { NIC_ALL } from './autorenew.constants';

export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  $stateProvider.state('app.account.billing.autorenewRedirection', {
    url: '/autoRenew?selectedType&pageSize&pageNumber&filters&searchText&nicBilling&sort',
    redirectTo: 'app.account.billing.autorenew',
  });

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
        value: JSON.stringify({ predicate: 'serviceId', reverse: false }),
        squash: true,
      },
    },
    resolve: _.assign({
      currentActiveLink: /* @ngInject */ $state => () => $state
        .href($state.current.name, {}, { inherit: false }),
      sshLink: /* @ngInject */ $state => $state.href('app.account.billing.autorenew.ssh', {}, { inherit: false }),
    }, (coreConfigProvider.region !== 'US' ? {
      activationLink: /* @ngInject */ $state => $state.href(
        'app.account.billing.autorenew.activation',
      ),
      agreementsLink: /* @ngInject */ $state => $state.href(
        'app.account.billing.autorenew.agreements',
        {},
        { inherit: false },
      ),
      billingServices: /* @ngInject */ services => _.map(
        services.list.results,
        service => new BillingService(service),
      ),
      cancelServiceResiliation: /* @ngInject */ $state => ({
        id,
      }) => $state.go('app.account.billing.autorenew.cancelResiliation', { serviceId: id }),
      canDisableAllDomains: /* @ngInject */ services => services.bulkDomains,
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

      homeLink: /* @ngInject */ $state => $state.href('app.account.billing.autorenew', {}, { inherit: false }),

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

      offset: /* @ngInject */ (
        pageNumber,
        pageSize,
      ) => pageSize * (pageNumber - 1),

      onListParamChanges: /* @ngInject */ $state => params => $state.go('.', params,
        { notify: false }),

      pageNumber: /* @ngInject */ $transition$ => parseInt($transition$.params().pageNumber, 10),
      pageSize: /* @ngInject */ $transition$ => parseInt($transition$.params().pageSize, 10),
      payDebtLink: /* @ngInject */ $state => $state.href('app.account.billing.main.history'),
      resiliateService: /* @ngInject */ $state => ({
        id,
      }) => $state.go('app.account.billing.autorenew.delete', { serviceId: id }),

      searchText: /* @ngInject */ $transition$ => $transition$.params().searchText,

      selectedType: /* @ngInject */ $transition$ => $transition$.params().selectedType,

      services: /* @ngInject */ (
        BillingAutoRenew,
        filters,
        nicBilling,
        pageSize,
        offset,
        searchText,
        selectedType,
        sort,
      ) => BillingAutoRenew.getServices(
        pageSize,
        offset,
        searchText,
        selectedType,
        filters.expiration,
        filters.status,
        filters.state,
        sort,
        nicBilling,
      ),

      serviceTypes: /* @ngInject */ (
        BillingAutoRenew,
        services,
      ) => BillingAutoRenew.getServicesTypes(services),

      sort: /* @ngInject */ $transition$ => JSON.parse($transition$.params().sort),

      terminateEmail: /* @ngInject */ $state => service => $state.go('app.account.billing.autorenew.terminateEmail', { serviceId: service.serviceId, name: service.domain }),
      terminateEnterpriseCloudDatabase: /* @ngInject */ $state => serviceId => $state.go('app.account.billing.autorenew.terminateEnterpriseCloudDatabase', { serviceId }),
      terminateHostingWeb: /* @ngInject */ $state => serviceId => $state.go('app.account.billing.autorenew.terminateHostingWeb', { serviceId }),
      terminatePrivateDatabase: /* @ngInject */ $state => serviceId => $state.go('app.account.billing.autorenew.terminatePrivateDatabase', { serviceId }),
      terminateWebCoach: /* @ngInject */ $state => serviceId => $state.go('app.account.billing.autorenew.terminateWebCoach', { serviceId }),
      updateServices: /* @ngInject */ $state => ({ id }) => $state.go('app.account.billing.autorenew.update', { serviceId: id }),
      updateExchangeBilling: /* @ngInject */ $state => ({ serviceId }) => {
        const [organization, exchangeName] = serviceId.split('/service/');
        $state.go('app.account.billing.autorenew.exchange', { organization, exchangeName });
      },

      warnNicBilling: /* @ngInject */ $state => nic => $state.go('app.account.billing.autorenew.warnNic', { nic }),
    } : {})),
    redirectTo: /* @ngInject */ () => (coreConfigProvider.region === 'US' ? 'app.account.billing.autorenew.ssh' : false),
  });
};
