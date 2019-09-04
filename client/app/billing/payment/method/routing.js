import component from './component';

export default ($stateProvider, $transitionsProvider, $urlRouterProvider) => {
  const name = 'app.account.billing.payment.method';

  $stateProvider.state(name, {
    url: '/method',
    params: {
      redirectToParams: {
        type: 'any',
      },
    },
    component: component.name,
    resolve: {
      getActionHref: /* @ngInject */ $state => (action, params = {}) => {
        if (action !== 'add') {
          return $state.href(`${name}.action.${action}`, params);
        }
        return $state.href(`${name}.${action}`, params);
      },
      guides: /* @ngInject */ User => User.getUrlOf('guides'),
      paymentMethods: /* @ngInject */ (
        OVH_PAYMENT_MEAN_STATUS,
        OVH_PAYMENT_METHOD_TYPE,
        ovhPaymentMethod,
      ) => ovhPaymentMethod.getAllPaymentMethods({
        transform: true,
      })
        .then(paymentMethods => _.filter(paymentMethods, ({ paymentType, status }) => {
          if (paymentType !== OVH_PAYMENT_METHOD_TYPE.BANK_ACCOUNT) {
            return true;
          }
          return status !== OVH_PAYMENT_MEAN_STATUS.BLOCKED_FOR_INCIDENTS;
        })),
      message: /* @ngInject */ ($transition$, $timeout, $translate) => {
        const redirectToParams = _.get($transition$.params(), 'redirectToParams');
        if (redirectToParams) {
          return {
            type: redirectToParams.status,
            text: $translate.instant(`billing_payment_method_${redirectToParams.data.action}_${redirectToParams.status}`, {
              errorMessage: _.get(redirectToParams, 'data.error.data.message'),
            }),
          };
        }

        return null;
      },
    },
  });

  // add an abstract state that will handle actions on payment method
  $stateProvider.state(`${name}.action`, {
    url: '/{paymentMethodId:int}',
    abstract: true,
    resolve: {
      paymentMethod: /* @ngInject */ ($transition$, paymentMethods) => _.find(paymentMethods, {
        paymentMethodId: $transition$.params().paymentMethodId,
      }),
    },
  });

  $urlRouterProvider.when(
    /^\/billing\/mean$/,
    ($location, $state) => $state.go(name),
  );
};
