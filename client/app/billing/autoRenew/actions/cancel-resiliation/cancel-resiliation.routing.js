// Should be moved to current folder
// import template from './billing-autoRenew.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.cancelResiliation', {
    url: '/cancel-resiliation?serviceId',
    views: {
      modal: {
        component: 'billingAutorenewCancelResiliation',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ goToAutorenew => goToAutorenew,
      cancelResiliation: /* @ngInject */ BillingAutoRenew => (service) => {
        service.cancelResiliation();
        BillingAutoRenew.updateService(
          service,
        );
      },
      serviceId: /* @ngInject */ $transition$ => $transition$.params().serviceId,
      service: /* @ngInject */ (
        BillingAutoRenew,
        serviceId,
      ) => BillingAutoRenew.getService(serviceId),
    },
  });
};
