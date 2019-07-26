export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.delete', {
    url: '/delete?serviceId',
    views: {
      modal: {
        component: 'billingAutorenewDelete',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      engagement: /* @ngInject */ (
        Server,
        service,
      ) => (service.canHaveEngagement()
        ? Server.getSelected(service.serviceId) : Promise.resolve()),
      goBack: /* @ngInject */ goToAutorenew => goToAutorenew,
      serviceId: /* @ngInject */ $transition$ => $transition$.params().serviceId,
      service: /* @ngInject */ (
        BillingAutoRenew,
        serviceId,
      ) => BillingAutoRenew.getService(serviceId),
      updateService: /* @ngInject */ BillingAutoRenew => service => BillingAutoRenew.updateService(
        service,
      ),
    },
  });
};
