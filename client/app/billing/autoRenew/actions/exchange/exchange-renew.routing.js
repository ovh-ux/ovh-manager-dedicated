export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.exchange', {
    url: '/exchange?organization&serviceName',
    views: {
      modal: {
        component: 'billingAutorenewExchangeRenew',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ goToAutorenew => goToAutorenew,
      organization: /* @ngInject */ $transition$ => $transition$.params().organization,
      serviceName: /* @ngInject */ $transition$ => $transition$.params().serviceName,
    },
  });
};
