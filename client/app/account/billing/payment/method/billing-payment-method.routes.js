import angular from 'angular';

angular
  .module('Billing')
  .config(($stateProvider, $urlRouterProvider) => {
    const name = 'app.account.billing.payment.method';

    $stateProvider.state(name, {
      url: '/method',
      templateUrl: 'account/billing/payment/method/billing-payment-method.html',
      controller: 'BillingPaymentMethodCtrl',
      controllerAs: '$ctrl',
      translations: ['./'],
      resolve: {
        paymentMethodListResolve: ($q, ovhPaymentMethod) => {
          const paymentMethodListDeferred = $q.defer();

          ovhPaymentMethod
            .getAllPaymentMethods({
              transform: true,
            })
            .then(paymentMethods => paymentMethodListDeferred.resolve(
              _.filter(paymentMethods, ({ paymentType, status }) => {
                if (paymentType.value !== 'BANK_ACCOUNT') {
                  return true;
                }
                return status.value !== 'BLOCKED_FOR_INCIDENTS';
              }),
            ))
            .catch(error => paymentMethodListDeferred.reject(error));

          return paymentMethodListDeferred;
        },
      },
    });

    $urlRouterProvider.when(
      /^\/billing\/mean$/,
      ($location, $state) => $state.go(name),
    );
  });
