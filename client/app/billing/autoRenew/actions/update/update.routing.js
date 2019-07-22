import _ from 'lodash';
import BillingService from '../../BillingService';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.update', {
    url: '/update?serviceId',
    component: 'billingAutorenewUpdate',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      addPaymentMean: /* @ngInject */ $state => () => $state.go('app.account.billing.payment.method.add'),
      autorenewAgreements: /* @ngInject */
        BillingAutoRenew => BillingAutoRenew.getAutorenewAgreements(),
      defaultPaymentMean: /* @ngInject */
        ovhPaymentMethod => ovhPaymentMethod.getDefaultPaymentMethod(),
      goBack: /* @ngInject */ goToAutorenew => goToAutorenew,
      services: /* @ngInject */ (OvhHttp, serviceId) => OvhHttp.get('/billing/autorenew/services', {
        rootPath: '2api',
        params: {
          count: 10,
          offset: 1,
          search: serviceId,
          type: null,
          renew: null,
          renewal: null,
          order: null,
          nicBilling: null,
        },
      }),
      serviceId: /* @ngInject */ $transition$ => $transition$.params().serviceId,
      service: /* @ngInject */ (
        serviceId,
        services,
      ) => new BillingService(_.find(services.list.results, { serviceId })),
      updateRenew: /* @ngInject */
        BillingAutoRenew => (
          service,
          agreements,
        ) => BillingAutoRenew.updateRenew(service, agreements),
    },
  });
};
