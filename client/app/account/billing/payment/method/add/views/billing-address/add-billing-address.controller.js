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
      contact: null,
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

  $onInit() {
    this.loading.init = true;

    this.ovhContacts.getContacts()
      .then((contacts) => {
        this.contactList = this.sortContacts(contacts);
        return this.ovhContacts.findMatchingContactFromNic(null, contacts);
      })
      .then((contact) => {
        console.log(contact);
        this.model.contact = contact;
        if (!contact.id) {
          this.addContact(contact);
        }

        // set shared model
        _.set(this.$state.current, 'sharedModel.billingAddress', this.model.contact);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

};
