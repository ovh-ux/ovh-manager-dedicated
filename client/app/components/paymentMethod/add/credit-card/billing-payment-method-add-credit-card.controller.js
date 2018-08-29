angular.module('directives').controller(
  'BillingPaymentMethodAddCreditCardCtrl',
  class BillingPaymentMethodAddCreditCardCtrl {
    constructor($rootScope, $scope, $q, $translate, Alerter, BillingVantivInstance,
      BillingPaymentMethodService, OvhHttp, constants) {
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$q = $q;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.BillingVantivInstance = BillingVantivInstance;
      this.BillingPaymentMethod = BillingPaymentMethodService;
      this.OvhHttp = OvhHttp;
      this.constants = constants;
    }

    $onInit() {
      this.$scope.i18n = this.$rootScope.i18n;
      this.isDefault = false;

      this.isLoading = false;
      this.isEditing = false;

      this.enums = null;
      this.contacts = null;
      this.contactSelected = null;

      this.selectionMode = 'reuse';

      this.contactForm = {
        address: {
          city: null,
          country: 'US',
          line1: null,
          province: null,
          zip: null,
        },
        email: null,
        firstName: null,
        language: null,
        lastName: null,
        legalForm: 'individual',
        phone: null,
      };

      this.BillingVantivInstance.instanciate({
        height: '75px',
      });

      this.isLoading = true;
      this.$q
        .all({
          enums: this.fetchEnums(),
          user: this.fetchUser(),
          contacts: this.fetchContacts(),
        })
        .then((results) => {
          this.enums = results.enums;
          _.assign(this.contactForm, _.pick(results.user, ['email', 'language']));
          this.contacts = _.map(results.contacts, contact => ({
            label: this.constructor.buildContactLabel(contact),
            value: contact,
          }));
          this.contactSelected = _.first(this.contacts);
          if (!this.contactSelected) {
            this.isEditing = true;
            this.selectionMode = 'create';
          }
        })
        .catch(err => this.$q.reject(err))
        .finally(() => {
          this.isLoading = false;
        });
    }

    $onDestroy() {
      this.BillingVantivInstance.clear();
    }

    /**
         * Fetch enums.
         * @return {Promise}
         */
    fetchEnums() {
      return this.OvhHttp.get('/me.json', {
        rootPath: 'apiv6',
      }).then(schema => ({
        country: _.map(schema.models['nichandle.CountryEnum'].enum, countryCode => ({
          code: countryCode,
          label: this.$translate.instant(`payment_mean_contact_creation_country_${countryCode}`),
        })).sort((countryA, countryB) => {
          // check if we are in US (even if for the moment it's not available for other targets)
          if (this.constants.target === 'US') {
            if (countryA.code === 'US') {
              return -1;
            } if (countryB.code === 'US') {
              return 1;
            }
          }
          return countryA.label.localeCompare(countryB.label);
        }),
      }));
    }

    /**
         * Fetch user.
         * @return {Promise}
         */
    fetchUser() {
      return this.OvhHttp.get('/me', {
        rootPath: 'apiv6',
      });
    }

    /**
         * Fetch contacts.
         * @return {Promise}
         */
    fetchContacts() {
      return this.OvhHttp.get('/me/contact', {
        rootPath: 'apiv6',
      }).then(contactIds => this.$q.all(_.map(contactIds, contactId => this.OvhHttp.get(`/me/contact/${contactId}`, {
        rootPath: 'apiv6',
      }))));
    }

    /**
         * Build a contact label based on firstName, lastName, email, and address.
         * @param  {Object} contact
         * @return {String}
         */
    static buildContactLabel(contact) {
      return `${_.get(contact, 'firstName', '')} ${_.get(contact, 'lastName', '')} - ${_.get(contact, 'email', '')} - ${_.get(contact, 'address.line1', '')} ${_.get(contact, 'address.city', '')}`;
    }

    /**
         * Get translated area label.
         * @return {String}
         */
    getTranslatedArea() {
      if (this.contactForm.address.country === 'US' || this.contactForm.address.country === 'WE') {
        return this.$translate.instant('payment_mean_contact_creation_label_address_state');
      }
      if (this.contactForm.address.country === 'CA') {
        return this.$translate.instant('payment_mean_contact_creation_label_address_province');
      }
      return this.$translate.instant('payment_mean_contact_creation_label_address_area');
    }

    toggleChangeContact() {
      this.isEditing = !this.isEditing;
    }

    cancelContactForm() {
      this.selectionMode = 'reuse';
      this.toggleChangeContact();
    }

    /**
         * Create contact.
         * @return {Promise|Void}
         */
    createContact() {
      if (this.selectionMode === 'reuse') {
        return this.toggleChangeContact();
      }

      this.isCreating = true;
      this.hasError = null;
      return this.OvhHttp.post('/me/contact', {
        rootPath: 'apiv6',
        data: this.contactForm,
      }).then((contact) => {
        const newContact = {
          label: this.constructor.buildContactLabel(contact),
          value: contact,
        };
        this.contactSelected = newContact;
        this.contacts.push(newContact);
        this.toggleChangeContact();
      }).catch((err) => {
        this.hasError = _.get(err, 'message');
        return this.$q.reject(err);
      }).finally(() => {
        this.isCreating = false;
      });
    }

    onAddClick() {
      this.isLoading = true;
      return this.BillingPaymentMethod.add({
        paymentType: 'CREDIT_CARD',
        default: this.isDefault,
        billingContactId: _.get(this.contactSelected, 'value.id'),
      })
        .then((newPaymentMethod) => {
          this.Alerter.success(this.$translate.instant('billing_payment_method_credit_card_valid'));
          this.onChange({
            newPaymentMethod,
          });
        })
        .catch((error) => {
          if (this.BillingPaymentMethod.isCreditCardVantivError(error)) {
            this.Alerter.error(this.$translate.instant('billing_payment_method_credit_card_recoverable_credit_card_error'));
            return this.$q.reject(error);
          } if (this.BillingPaymentMethod.isCardValidationNumberVantivError(error)) {
            this.Alerter.error(this.$translate.instant('billing_payment_method_credit_card_recoverable_card_validation_number_error'));
            return this.$q.reject(error);
          }

          this.Alerter.error(this.$translate.instant('billing_payment_method_credit_card_generic_error'));
          return this.$q.reject(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
);
