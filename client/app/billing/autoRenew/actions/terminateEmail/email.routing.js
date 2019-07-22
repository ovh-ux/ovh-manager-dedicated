export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.terminateEmail', {
    url: '/delete-email?serviceId',
    views: {
      modal: {
        component: 'billingAutorenewTerminateEmail',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      email: /* @ngInject */ (
        BillingAutoRenew,
        serviceId,
      ) => BillingAutoRenew.getEmailInfos(serviceId),
      isHosting: /* @ngInject */ email => ['hosting'].includes(email.offer),
      goBack: /* @ngInject */ goToAutorenew => goToAutorenew,
      serviceId: /* @ngInject */ $transition$ => $transition$.params().serviceId,
      terminateEmail: /* @ngInject */ (
        BillingAutoRenew,
        serviceId,
      ) => () => BillingAutoRenew.terminateEmail(serviceId),
    },
  });
};
