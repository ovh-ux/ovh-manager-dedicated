export default class BillingPaymentMethodAddCtrl {
  /* @ngInject */

  constructor($q, $state, ovhPaymentMethod, paymentMethodListResolve) {
    // dependencies injections
    this.$q = $q;
    this.$state = $state;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.paymentMethodListResolve = paymentMethodListResolve;

    // other attributes used in view
    this.loading = {
      init: false,
      add: false,
    };

    this.model = {
      selectedPaymentMethodType: null,
    };

    this.paymentMethodTypes = null;
  }

  /* ==============================
  =            Events            =
  ============================== */

  onPayentMethodAddBtnClick() {
    console.log('onPayentMethodAddBtnClick');
    this.loading.add = true;

    // return this.ovhPaymentMethod.add
  }

  /* =====  End of Events  ====== */

  /* =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
    this.loading.init = true;

    return this.$q.all({
      paymentMethods: this.paymentMethodListResolve.promise,
      paymentMethodTypes: this.ovhPaymentMethod.getAvailablePaymentMethodTypes(),
    }).then(({ paymentMethods, paymentMethodTypes }) => {
      this.hasPaymentMethod = paymentMethods.length > 0;
      this.paymentMethodTypes = paymentMethodTypes;
    })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */
}
