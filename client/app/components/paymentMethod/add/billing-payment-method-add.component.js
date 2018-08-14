angular.module('directives').component('billingPaymentMethodAdd', {
  templateUrl: 'components/paymentMethod/add/billing-payment-method-add.html',
  controller: 'BillingPaymentMethodAddCtrl',
  bindings: {
    type: '<',
    onChange: '&',
  },
});
