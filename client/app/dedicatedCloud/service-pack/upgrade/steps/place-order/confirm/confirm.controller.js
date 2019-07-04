import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    $uibModalInstance,
    hasDefaultMeansOfPayment,
    itemName,
    itemType,
    price,
    priceAsNumber,
  ) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.hasDefaultMeansOfPayment = hasDefaultMeansOfPayment;
    this.itemName = itemName;
    this.itemType = itemType;
    this.price = price;
    this.priceAsNumber = priceAsNumber;
  }

  $onInit() {
    this.bindings = {
      text: this.chooseText(),
    };
  }

  chooseText() {
    const priceWithoutSign = _.isFinite(
      parseInt(this.price[0], 10),
    )
      ? this.price
      : this.price.substr(1);

    const translationsValues = {
      itemName: `<strong>${this.itemName}</strong>`,
      price: `<strong>${priceWithoutSign}</strong>`,
    };

    if (this.priceAsNumber === 0) {
      return this.$translate.instant(`confirm_order_${this.itemType}_question_0`, translationsValues);
    }

    if (this.priceAsNumber < 0) {
      return this.$translate.instant(`confirm_order_${this.itemType}_question_deducting`, translationsValues);
    }

    if (this.priceAsNumber <= 1) {
      return this.$translate.instant(`confirm_order_${this.itemType}_question_adding_1`, translationsValues);
    }

    return this.$translate.instant(`confirm_order_${this.itemType}_question_adding_many`, translationsValues);
  }
}
