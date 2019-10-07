export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.confirmTerminate', {
    url: '/confirmTerminate?id&token',
    component: 'billingConfirmTerminate',
    translations: { value: ['..'], format: 'json' },
  });
};
