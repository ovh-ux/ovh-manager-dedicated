class LegacyBankAccountModel {
  constructor(country) {
    this.country = country;

    this.ownerName = null;
    this.addressNumber = null;
    this.addressStreet = null;
    this.addressZip = null;
    this.addressCity = null;
    this.fullAddress = null;
  }

  get ownerAddress() {
    if (this.country !== 'FR') {
      return this.fullAddress;
    }

    return [
      this.addressNumber || '',
      this.addressStreet || '',
      this.addressZip || '',
      this.addressCity || '',
    ].join(' ').trim();
  }
}

export default class PaymentMethodAddLegacyBillingAddressCtrl {
  $onInit() {
    this.model.billingAddress = new LegacyBankAccountModel(this.currentUser.billingCountry);
  }
}
