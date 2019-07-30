import _ from 'lodash';
import { MIN_DOMAIN_LENGTH, NIC_ALL, RENEW_URL } from './autorenew.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew', {
    url: '/autorenew?selectedType',
    component: 'autoRenew',
    translations: { value: ['.'], format: 'json' },
    params: {
      selectedType: {
        value: null,
        squash: true,
      },
    },
    resolve: {
      agreementsLink: /* @ngInject */ $state => $state.href(
        'app.account.billing.autorenew.agreements',
      ),
      currentActiveLink: /* @ngInject */ (
        $state,
        $transition$,
      ) => () => $state.href($transition$.to().name),
      disableBulkAutorenew: /* @ngInject */ $state => services => $state.go('app.account.billing.autorenew.disable', {
        services: _.map(services, 'id'),
      }),
      enableBulkAutorenew: /* @ngInject */ $state => services => $state.go('app.account.billing.autorenew.enable', {
        services: _.map(services, 'id'),
      }),
      homeLink: /* @ngInject */ $state => $state.href('app.account.billing.autorenew'),
      sshLink: /* @ngInject */ $state => $state.href('app.account.billing.autorenew.ssh'),
      isEnterpriseCustomer: /* @ngInject */ currentUser => currentUser.isEnterprise,
      isInDebt: /* @ngInject */ DEBT_STATUS => service => _.includes(DEBT_STATUS, service.status),

      getServices: /* @ngInject */ BillingAutoRenew => (
        count, offset, search, type, renewDateType, status, order, nicBilling,
      ) => BillingAutoRenew
        .getServices(count, offset, search, type, renewDateType, status, order, nicBilling),

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

      selectedType: /* @ngInject */ $transition$ => $transition$.params().selectedType,

      serviceTypes: /* @ngInject */ (
        BillingAutoRenew,
        services,
      ) => BillingAutoRenew.getServicesTypes(services),

      allServices: /* @ngInject */ BillingAutoRenew => BillingAutoRenew.getAllServices(),
      services: /* @ngInject */ allServices => _.get(allServices, 'list.results', []),
      nicBilling: /* @ngInject */ ($translate, allServices) => [$translate.instant(NIC_ALL), ..._.get(allServices, 'nicBilling', [])],

      updateServices: /* @ngInject */ $state => ({ serviceId }) => $state.go('app.account.billing.autorenew.update', { serviceId }),
      updateExchangeBilling: /* @ngInject */ $state => ({ serviceId }) => $state.go('app.account.billing.autorenew.exchange', { serviceId }),

      canResiliate: /* @ngInject */ (
        BillingAutoRenew,
        currentUser,
      ) => service => BillingAutoRenew.canResiliate(service, currentUser),

      resiliateService: /* @ngInject */ $state => ({
        serviceId,
      }) => $state.go('app.account.billing.autorenew.delete', { serviceId }),

      resiliateExchangeService: /* @ngInject */ (
        $window,
        BillingAutoRenew,
      ) => ({ serviceId }) => {
        const [organization, exchangeName] = serviceId.split('/service/');
        return BillingAutoRenew.getExchangeService(organization, exchangeName)
          .then(({ offer }) => $window.location.assign(BillingAutoRenew.getExchangeUrl(organization, exchangeName, offer, 'resiliate')));
      },

      canCancelResiliation: /* @ngInject */ (
        BillingAutoRenew,
        currentUser,
      ) => service => BillingAutoRenew.canCancelResiliation(service, currentUser),

      cancelServiceResiliation: /* @ngInject */ $state => ({
        serviceId,
      }) => $state.go('app.account.billing.autorenew.cancelResiliation', { serviceId }),

      canDisableAllDomains: /* @ngInject */ services => _.filter(services, 'serviceType', 'DOMAIN').length > MIN_DOMAIN_LENGTH,
      disableAutorenewForDomains: /* @ngInject */ $state => () => $state.go('app.account.billing.autorenew.disableDomainsBulk'),

      getRenewUrl: /* @ngInject */ currentUser => ({ serviceId }) => {
        const subsidiary = _.get(currentUser, 'ovhSubsidiary', false);
        const renewUrl = (subsidiary || RENEW_URL[subsidiary])
          ? RENEW_URL[subsidiary]
          : RENEW_URL.default;

        return renewUrl.replace('{serviceName}', serviceId);
      },
      getSMSAutomaticRenewalURL: /* @ngInject */ constants => service => `${constants.MANAGER_URLS.telecom}sms/${service.serviceId}/options/recredit`,
      getSMSCreditBuyingURL: /* @ngInject */ constants => service => `${constants.MANAGER_URLS.telecom}sms/${service.serviceId}/order`,
    },
    redirectTo: /* @ngInject */ isEnterpriseCustomer => (isEnterpriseCustomer ? 'app.account.billing.autorenew.agreements' : false),
  });
};
