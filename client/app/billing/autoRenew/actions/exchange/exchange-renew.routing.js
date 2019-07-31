export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.exchange', {
    url: '/exchange?organization&exchangeName',
    component: 'exchangeAccountRenew',
    resolve: {
      goBack: /* @ngInject */ goToAutorenew => goToAutorenew,
      organization: /* @ngInject */ $transition$ => $transition$.params().organization,
      exchangeName: /* @ngInject */ $transition$ => $transition$.params().exchangeName,
      onError: /* @ngInject */ goBack => result => goBack(result, 'danger'),
      onSuccess: /* @ngInject */ goBack => result => goBack(result),
    },
  });
};
