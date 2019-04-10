export default class {
  constructor(
    $uibModalInstance,
    optionName,
    price,
  ) {
    this.$uibModalInstance = $uibModalInstance;
    this.optionName = optionName;
    this.price = price;
  }
}
