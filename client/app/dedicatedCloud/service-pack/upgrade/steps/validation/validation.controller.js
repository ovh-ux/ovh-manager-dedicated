export default class {
  /* @ngInject */
  constructor(
    $q,
    OvhApiOrder,
  ) {
    this.$q = $q;
    this.OvhApiOrder = OvhApiOrder;
  }

  $onInit() {
    this.currentService = this.stepper.memorizedStateParams.currentService;
    this.servicePackToOrder = this.stepper.memorizedStateParams.servicePackToOrder;

    if (this.servicePackToOrder == null) {
      return this.stepper.exit();
    }

    return this.placeOrder();
  }
}
