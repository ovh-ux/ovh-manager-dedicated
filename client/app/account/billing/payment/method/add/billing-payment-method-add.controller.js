export default class BillingPaymentMethodAddCtrl {
  /* @ngInject */

  constructor($state, ovhPaymentMethod) {
    // dependencies injections
    this.$state = $state;
    this.ovhPaymentMethod = ovhPaymentMethod;

    // other attributes used in view
    this.loading = {
      init: false,
    };
  }

  /* =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
    this.loading.init = true;

    return this.ovhPaymentMethod.getAvailablePaymentTypes();
  }

  /* -----  End of INITIALIZATION  ------ */
}
