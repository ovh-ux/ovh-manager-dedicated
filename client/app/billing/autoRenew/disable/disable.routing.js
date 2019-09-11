export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.disable', {
    url: '/disable?services',
    component: 'billingAutorenewDisable',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ goToAutorenew => goToAutorenew,
      servicesId: /* @ngInject */ $transition$ => $transition$.params().services.split(','),
      servicesList: /* @ngInject */ (
        BillingAutorenewDisable,
        billingServices,
        currentUser,
        servicesId,
      ) => BillingAutorenewDisable.constructor.groupByManualRenewCapabilities(
        _.filter(billingServices, service => servicesId.includes((service.id).toString())),
        currentUser.nichandle,
      ),
      updateRenew: /* @ngInject */
        BillingAutoRenew => services => BillingAutoRenew.updateServices(
          _.map(services, (service) => {
            service.setManualRenew();
            return service;
          }),
        ),
    },
  });
};
