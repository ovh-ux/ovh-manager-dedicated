export default class PaymentMethodAddLegacyBankAccountCtrl {
  /* @ngInject */
  constructor(ovhPaymentMethodHelper) {
    // other attributes
    this.isValidIban = ovhPaymentMethodHelper.isValidIban;
    this.isValidBic = ovhPaymentMethodHelper.isValidBic;
  }

  $onInit() {
    this.model.bankAccount = {
      iban: null,
      bic: null,
    };
    // _.set(this.$state.current, 'sharedModel.legacyBankAccount', this.model);
  }
}
