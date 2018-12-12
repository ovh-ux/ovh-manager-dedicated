export default class BillingPaymentCtrl {
  /* @ngInject */

  constructor($state, constants) {
    // dependencies injections
    this.$state = $state;
    this.constants = constants;

    console.log(this.constants);
  }
}
