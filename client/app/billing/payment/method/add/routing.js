import component from './component';

export default (($stateProvider, $urlRouterProvider) => {
  const name = 'app.account.billing.payment.method.add';

  $stateProvider.state(name, {
    url: '/add',
    views: {
      '@app.account.billing.payment': {
        component: component.name,
      },
    },
    resolve: {
      addSteps: /* @ngInject */ (model, OVH_PAYMENT_METHOD_INTEGRATION_TYPE) => ({
        paymentMethodType: {
          name: 'paymentMethodType',
          loading: true,
          isVisible: () => true,
          isLastStep: () => {
            const paymentMethodType = model.selectedPaymentMethodType;

            return paymentMethodType.integration === OVH_PAYMENT_METHOD_INTEGRATION_TYPE.REDIRECT
              || paymentMethodType.integration === OVH_PAYMENT_METHOD_INTEGRATION_TYPE.IN_CONTEXT;
          },
        },
      }),
      getBackButtonHref: /**/ ($state, $transition$) => () => $state.href(_.get($transition$.params(), 'from', '^')),
      isLastStep: /* @ngInject */ addSteps => (stepName) => {
        const step = _.get(addSteps, stepName);
        if (step.loading) {
          return true;
        }

        return step.isLastStep();
      },
      model: () => ({}),
      onPaymentMethodAdded: /* @ngInject */ (
        $state,
        $transition$,
        getBackButtonHref,
      ) => paymentMethod => $state.go(_.get($transition$.params(), 'from', '^'), {
        redirectToParams: {
          status: 'success',
          data: {
            action: 'add',
            paymentMethod,
          },
        },
      }),
    },
  });

  $urlRouterProvider.when(
    /^\/billing\/mean\/add$/,
    ($location, $state) => $state.go(name),
  );
});

/*
paymentMethodType: {
        name: 'paymentMethodType',
        isVisible: () => true,
        isLastStep: () => {
          const isLegacy = _.has(this.model.selectedPaymentMethodType, 'original');
          const isLegacyBankAccount = _.get(
            this.model.selectedPaymentMethodType,
            'original.value',
          ) === 'bankAccount';
          const isInContextRegister = this.ovhPaymentMethod
            .isPaymentMethodTypeRegisterableInContext(this.model.selectedPaymentMethodType);

          return isLegacy && !isLegacyBankAccount && !isInContextRegister;
        },
      },
      legacyBankAccount: {
        name: 'legacyBankAccount',
        position: 2,
        isVisible: () => _.get(
          this.model.selectedPaymentMethodType,
          'original.value',
        ) === 'bankAccount',
        isLastStep: () => false,
      },
      legacyBankAccountOwner: {
        name: 'legacyBankAccountOwner',
        position: 3,
        isVisible: () => _.get(
          this.model.selectedPaymentMethodType,
          'original.value',
        ) === 'bankAccount',
        isLastStep: () => true,
      },
      billingAddress: {
        name: 'billingAddress',
        position: 2,
        isLoading: false,
        isVisible: () => this.ovhPaymentMethod
          .isPaymentMethodTypeRequiringContactId(this.model.selectedPaymentMethodType),
        isLastStep: () => false,
      },
      paymentMethod: {
        name: 'paymentMethod',
        position: 3,
        isVisible: () => this.ovhPaymentMethod
          .isPaymentMethodTypeRegisterableInContext(this.model.selectedPaymentMethodType),
        isLastStep: () => true,
        onFocus: () => {
          if (!this.registerInstance) {
            throw new Error(`You must create a new register instance for '${this.model.selectedPaymentMethodType.integration}' payment method integration.`);
          }

          if (!this.registerInstance.instanciated) {
            this.registerInstance.instanciate();
          }
        },
      },
 */


// import template from './billing-payment-method-add.html';
// import controller from './billing-payment-method-add.controller';

// // views templates
// import legacyBankAccountTemplate from './views/legacy-bank-account/add-legacy-bank-account.html';
// import legacyBankAccountViewCtrl from './views/legacy-bank-account/add-legacy-bank-account.controller';

// import legacyBillingAddressTemplate from './views/legacy-billing-address/add-legacy-billing-address.html';
// import legacyBillingAddressViewCtrl from './views/legacy-billing-address/add-legacy-billing-address.controller';

// import billingContactTemplate from './views/billing-address/add-billing-address.html';
// import billingAddressViewCtrl from './views/billing-address/add-billing-address.controller';

// angular
//   .module('Billing')
//   .config(($stateProvider, $urlRouterProvider) => {
//     const name = 'app.account.billing.payment.method.add';

//     $stateProvider.state(name, {
//       url: '/add?status&from',
//       views: {
//         '@app.account.billing.payment': {
//           template,
//           controller,
//           controllerAs: '$ctrl',
//         },
//         'legacyBankAccount@app.account.billing.payment.method.add': {
//           template: legacyBankAccountTemplate,
//           controller: legacyBankAccountViewCtrl,
//           controllerAs: '$ctrl',
//         },
//         'legacyBankAccountOwner@app.account.billing.payment.method.add': {
//           template: legacyBillingAddressTemplate,
//           controller: legacyBillingAddressViewCtrl,
//           controllerAs: '$ctrl',
//         },
//         'billingAddress@app.account.billing.payment.method.add': {
//           template: billingContactTemplate,
//           controller: billingAddressViewCtrl,
//           controllerAs: '$ctrl',
//         },
//       },
//     });


//   });
