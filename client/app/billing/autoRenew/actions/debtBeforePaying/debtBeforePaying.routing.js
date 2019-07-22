export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.payDebt', {
    url: '/pay-debt?serviceName',
    views: {
      modal: {
        component: 'billingAutorenewDebtBeforePaying',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ goToAutorenew => goToAutorenew,
      payDebt: /* @ngInject */ $state => () => {
        $state.go('app.account.billing.main.history');
      },
      serviceName: /* @ngInject */ $transition$ => $transition$.params().serviceName,
    },
  });
};
