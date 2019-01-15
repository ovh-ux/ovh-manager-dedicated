import _ from 'lodash';

export default class BillingPaymentMethodAddCtrl {
  /* @ngInject */

  constructor($q, $state, $stateParams, $translate, $window, Alerter, billingPaymentMethodSection,
    BillingPaymentMethodService, BillingVantivInstance, constants, currentUser,
    ovhContacts, ovhPaymentMethod) {
    // dependencies injections
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
    this.billingPaymentMethodSection = billingPaymentMethodSection;
    this.BillingPaymentMethodService = BillingPaymentMethodService;
    this.BillingVantivInstance = BillingVantivInstance;
    this.constants = constants;
    this.currentUser = currentUser; // from app route resolve
    this.ovhContacts = ovhContacts;
    this.ovhPaymentMethod = ovhPaymentMethod;

    // other attributes used in view
    this.loading = {
      init: false,
      add: false,
    };

    this.addSteps = {
      paymentMethodType: {
        name: 'paymentMethodType',
        isVisible: () => true,
        isLastStep: () => {
          const isLegacy = _.has(this.model.selectedPaymentMethodType, 'original');
          const isLegacyBankAccount = _.get(
            this.model.selectedPaymentMethodType,
            'original.value',
          ) === 'bankAccount';

          return isLegacy && !isLegacyBankAccount && this.constants.target !== 'US';
        },
      },
      legacyBankAccount: {
        name: 'legacyBankAccount',
        position: 2,
        isVisible: () => _.get(
          this.model.selectedPaymentMethodType,
          'original.value',
        ) === 'bankAccount',
        isLastStep: () => false,
      },
      legacyBankAccountOwner: {
        name: 'legacyBankAccountOwner',
        position: 3,
        isVisible: () => _.get(
          this.model.selectedPaymentMethodType,
          'original.value',
        ) === 'bankAccount',
        isLastStep: () => true,
      },
      billingAddress: {
        name: 'billingAddress',
        position: 2,
        isLoading: false,
        isVisible: () => !this.model.selectedPaymentMethodType.original || this.constants.target === 'US',
        isLastStep: () => this.constants.target !== 'US',
      },
      paymentMethod: {
        name: 'paymentMethod',
        position: 3,
        isVisible: () => this.constants.target === 'US',
        isLastStep: () => true,
        onFocus: () => {
          this.BillingVantivInstance.instanciate({
            height: '75px',
          });
        },
      },
    };

    this.model = null;
    this.chunkedPaymentMethodTypes = null;
    this.chunkSize = 3;
    this.addAlertMessage = {
      message: null,
      type: null,
    };
  }

  /* ----------  Helpers  ---------- */

  getLegacyAddParams() {
    if (_.get(this.model.selectedPaymentMethodType, 'original.value') === 'bankAccount') {
      return {
        iban: _.get(this.$state.current, 'sharedModel.legacyBankAccount.iban'),
        bic: _.get(this.$state.current, 'sharedModel.legacyBankAccount.bic'),
        ownerName: _.get(this.$state.current, 'sharedModel.legacyBillingAddress.ownerName'),
        ownerAddress: _.get(this.$state.current, 'sharedModel.legacyBillingAddress.ownerAddress'),
      };
    }

    return {};
  }

  manageLegacyResponse(result) {
    if (_.get(this.model.selectedPaymentMethodType, 'original.value') !== 'bankAccount') {
      if (this.constants.target !== 'US') {
        // display a message to tell that a new tab have been opened
        this.addAlertMessage.type = 'info';
        this.addAlertMessage.message = this.$translate.instant('billing_payment_method_add_info', {
          paymentUrl: result.url,
        });
      } else {
        // display a success message
        this.Alerter.success(
          this.$translate.instant('billing_payment_method_add_status_success'),
          'billing_payment_method_add_alert',
        );
      }
    } else {
      // refresh the payment method list so that when returning on parent state,
      // the list is up to date
      this.billingPaymentMethodSection.getPaymentMehtods();

      // display a success message
      this.Alerter.success(
        this.$translate.instant('billing_payment_method_add_bank_account_success', {
          t0: result.url,
        }),
        'billing_payment_method_add_alert',
      );
    }
  }

  /* ----------  Events  ---------- */

  onPaymentMethodAddStepperFinish() {
    let contactPromise = this.$q.when(true);

    this.loading.add = true;

    // set default param
    const hasPaymentMethod = this.billingPaymentMethodSection.sharedPaymentMethods.length > 0;
    let addParams = {
      default: !hasPaymentMethod || this.model.setAsDefault,
    };

    if (this.model.selectedPaymentMethodType.original) {
      addParams = _.merge(addParams, this.getLegacyAddParams());
    }
    if (!this.model.selectedPaymentMethodType.original || this.constants.target === 'US') {
      const paymentMethodContact = _.get(this.$state.current, 'sharedModel.billingAddress');

      // if no id to contact, we need to create it first before adding payment method
      if (!_.get(paymentMethodContact, 'id')) {
        // force non needed value for contact creation
        // this should be done in component
        if (!paymentMethodContact.legalForm) {
          paymentMethodContact.legalForm = 'individual';
        }
        if (!paymentMethodContact.language) {
          paymentMethodContact.language = this.currentUser.language;
        }
        contactPromise = this.ovhContacts.createContact(paymentMethodContact)
          .then((contact) => {
            _.set(addParams, 'billingContactId', contact.id);
            return contact;
          });
      } else {
        _.set(addParams, 'billingContactId', paymentMethodContact.id);
      }

      if (!this.model.selectedPaymentMethodType.original) {
        const isQueryParamsInHash = this.$window.location.hash.indexOf('?') > 0;
        addParams = _.merge(addParams, {
          register: true,
          callbackUrl: {
            cancel: [this.$window.location.href, 'status=cancel'].join(isQueryParamsInHash ? '&' : '?'),
            error: [this.$window.location.href, 'status=error'].join(isQueryParamsInHash ? '&' : '?'),
            failure: [this.$window.location.href, 'status=failure'].join(isQueryParamsInHash ? '&' : '?'),
            pending: [this.$window.location.href, 'status=pending'].join(isQueryParamsInHash ? '&' : '?'),
            success: [this.$window.location.href, 'status=success'].join(isQueryParamsInHash ? '&' : '?'),
          },
        });
      }
    }

    this.Alerter.resetMessage('billing_payment_method_add_alert');

    return contactPromise
      .then(() => this.ovhPaymentMethod
        .addPaymentMethod(this.model.selectedPaymentMethodType, addParams))
      .then((result) => {
        if (this.constants.target === 'US') {
          return this.BillingPaymentMethodService.submitVantiv(result);
        }

        return this.$q.when(result);
      })
      .then((result) => {
        if (this.model.selectedPaymentMethodType.original) {
          this.manageLegacyResponse(result);
        }
      })
      .catch((error) => {
        if (this.BillingPaymentMethodService.isCreditCardVantivError(error)) {
          this.Alerter.error(
            this.$translate.instant('billing_payment_method_add_vantiv_recoverable_credit_card_error'),
            'billing_payment_method_add_alert',
          );
        } else if (this.BillingPaymentMethodService.isCardValidationNumberVantivError(error)) {
          this.Alerter.error(
            this.$translate.instant('billing_payment_method_add_vantiv_recoverable_card_validation_number_error'),
            'billing_payment_method_add_alert',
          );
        } else {
          this.Alerter.error([
            this.$translate.instant('billing_payment_method_add_status_error'),
            _.get(error, 'data.message', ''),
          ].join(' '), 'billing_payment_method_add_alert');
        }
      })
      .finally(() => {
        this.loading.add = false;
        if (this.constants.target === 'US') {
          this.BillingVantivInstance.clear();
        }
        this.$onInit();
      });
  }

  /* ----------  Initialization  ---------- */

  resetModel() {
    this.model = {
      selectedPaymentMethodType: _.first(this.paymentMethodTypes),
      setAsDefault: false,
    };
  }

  manageHiPayStatus() {
    if (!this.$stateParams.status) {
      // do nothing if no status in state params
      return;
    }

    const hiPayStatus = this.$stateParams.status;

    if (['cancel', 'pending'].indexOf(hiPayStatus) > -1) {
      this.addAlertMessage.type = 'warning';
    } else if (['error', 'failure'].indexOf(hiPayStatus) > -1) {
      this.addAlertMessage.type = 'error';
    } else {
      this.addAlertMessage.type = 'success';
    }

    this.addAlertMessage.message = this.$translate.instant(`billing_payment_method_add_status_${hiPayStatus}`);
  }

  $onInit() {
    this.loading.init = true;

    this.manageHiPayStatus();

    return this.$q.all({
      paymentMethods: this.billingPaymentMethodSection.getPaymentMehtods(),
      paymentMethodTypes: this.ovhPaymentMethod.getAllAvailablePaymentMethodTypes(),
    })
      .then(({ paymentMethodTypes }) => {
        this.paymentMethodTypes = _.sortBy(paymentMethodTypes, 'paymentType.text');
        this.chunkedPaymentMethodTypes = _.chunk(this.paymentMethodTypes, this.chunkSize);
        this.resetModel();
        this.$state.current.sharedModel = {};
        this.$state.current.sharedSteps = this.addSteps;
      })
      .catch((error) => {
        this.Alerter.error([
          this.$translate.instant('billing_payment_method_add_load_error'),
          _.get(error, 'data.message', ''),
        ].join(' '), 'billing_payment_method_add_alert');
      })
      .finally(() => {
        this.loading.init = false;
      });
  }
}
