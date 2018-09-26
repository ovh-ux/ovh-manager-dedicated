angular
  .module('Billing.components')
  .component('billingAutoRenewUpdate', {
    bindings: {
      servicesToChangeRenewalOf: '<',
    },
    templateUrl: 'account/billing/autoRenew/update/billing-autoRenew-update.html',
    controller: 'billingAutoRenewUpdateCtrl',
  });
