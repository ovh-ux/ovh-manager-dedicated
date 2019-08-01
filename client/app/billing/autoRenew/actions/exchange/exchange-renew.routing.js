export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.exchange', {
    url: '/exchange?organization&exchangeName',
    component: 'exchangeAccountRenew',
    resolve: {
      goBack: /* @ngInject */ goToAutorenew => (message, type) => goToAutorenew(message, type),
      organization: /* @ngInject */ $transition$ => $transition$.params().organization,
      exchangeName: /* @ngInject */ $transition$ => $transition$.params().exchangeName,
    },
  });
};
