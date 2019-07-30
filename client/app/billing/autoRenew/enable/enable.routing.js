export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.enable', {
    url: '/enable?services',
    component: 'billingAutorenewEnable',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ goToAutorenew => goToAutorenew,
      servicesId: /* @ngInject */ $transition$ => $transition$.params().services.split(','),
      servicesList: /* @ngInject */ (
        BillingAutorenewEnable,
        currentUser,
        services,
        servicesId,
      ) => BillingAutorenewEnable.constructor.groupByAutorenewCapabilities(
        _.filter(services, service => servicesId.includes((service.id).toString())),
        currentUser.nichandle,
      ),
      updateRenew: /* @ngInject */
          BillingAutoRenew => services => BillingAutoRenew.updateServices(
            _.map(services, (service) => {
              service.setAutoRenew();
              return service;
            }),
          ),
    },
  });
};
