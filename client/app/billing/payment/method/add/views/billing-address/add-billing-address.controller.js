import _ from 'lodash';

export default class PaymentMethodAddBillingAddressViewCtrl {
  /* @ngInject */

  constructor($q, $state, ovhContacts) {
    // dependencies injections
    this.$q = $q;
    this.$state = $state;
    this.ovhContacts = ovhContacts;

    // other attributes used in view
    this.loading = {
      init: false,
    };

    this.model = {
      activeTab: null,
      existingContact: null,
      newContact: {
        address: {},
      },
    };

    this.contactList = null;
    this.creationRules = null;
  }

  addContact(contact) {
    this.contactList.push(contact);
    return this.sortContacts(this.contactList);
  }

  sortContacts(contacts) {
    this.contactList = _.sortBy(contacts, 'lastName');
    return this.contactList;
  }

  onContactSelectChange() {
    _.set(this.$state.current, 'sharedModel.billingAddress', this.model.existingContact);
  }

  onExistingContactTabActive() {
    this.model.activeTab = 'exising';
    _.set(this.$state.current, 'sharedModel.billingAddress', this.model.existingContact);
  }

  onNewContactTabActive() {
    this.model.activeTab = 'new';
    this.model.newContact = {
      address: {},
    };
    _.set(this.$state.current, 'sharedModel.billingAddress', this.model.newContact);
  }

  $onInit() {
    this.loading.init = true;
    this.$state.current.sharedSteps.billingAddress.isLoading = true;

    this.ovhContacts.getContacts()
      .then((contacts) => {
        this.contactList = this.sortContacts(contacts);
        return this.ovhContacts.findMatchingContactFromNic(null, contacts);
      })
      .then((contact) => {
        this.model.existingContact = contact;
        if (!contact.id) {
          this.addContact(contact);
        }

        // set shared model
        _.set(this.$state.current, 'sharedModel.billingAddress', this.model.existingContact);
      })
      .finally(() => {
        this.loading.init = false;
        this.$state.current.sharedSteps.billingAddress.isLoading = false;
      });
  }
}
