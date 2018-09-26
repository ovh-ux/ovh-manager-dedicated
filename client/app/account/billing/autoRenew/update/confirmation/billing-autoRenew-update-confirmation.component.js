angular
  .module('Billing.components')
  .component('billingAutoRenewUpdateConfirmation', {
    bindings: {
      serviceTypes: '<',
    },
    templateUrl: 'account/billing/autoRenew/update/confirmation/billing-autoRenew-update-confirmation.html',
    controller: 'billingAutoRenewUpdateConfirmationCtrl',
  });
