export default class {
  constructor(
    $translate,
    $uibModalInstance,
    optionName,
    price,
    priceAsNumber,
  ) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.optionName = optionName;
    this.price = price;
    this.priceAsNumber = priceAsNumber;
  }

  $onInit() {
    this.bindings = {
      text: this.chooseText(),
    };
  }

  chooseText() {
    const translationsValues = {
      optionName: `<strong>${this.optionName}</strong>`,
      price: `<strong>${this.price}</strong>`,
    };

    if (this.priceAsNumber === 0) {
      return this.$translate.instant('confirm_order_option_question_0', translationsValues);
    }

    if (this.priceAsNumber < 0) {
      return this.$translate.instant('confirm_order_option_question_deducting', translationsValues);
    }

    if (this.priceAsNumber <= 1) {
      return this.$translate.instant('confirm_order_option_question_adding_1', translationsValues);
    }

    return this.$translate.instant('confirm_order_option_question_adding_many', translationsValues);
  }
}
