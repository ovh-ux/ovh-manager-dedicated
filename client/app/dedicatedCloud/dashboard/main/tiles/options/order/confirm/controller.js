export default class {
  constructor(
    $uibModalInstance,
    optionName,
    price,
    priceAsNumber,
  ) {
    this.$uibModalInstance = $uibModalInstance;
    this.optionName = optionName;
    this.price = price;
    this.priceAsNumber = priceAsNumber;
  }
}
