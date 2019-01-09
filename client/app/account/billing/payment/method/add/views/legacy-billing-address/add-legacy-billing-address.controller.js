import _ from 'lodash';

export default class PaymentMethodAddLegacyBankAccountCtrl {
  /* @ngInject */

  constructor($state, currentUser) {
    // dependencies injections
    this.$state = $state;
    this.currentUser = currentUser; // from app route resolve

    // other attribute used in views
    this.model = {
      ownerName: null,
      ownerAddress: null,
    };
  }

  $onInit() {
    _.set(this.$state.current, 'sharedModel.legacyBillingAddress', this.model);
  }
}
