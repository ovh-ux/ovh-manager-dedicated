import { CREDITCARD_FOOTPRINT_AMOUNT } from './constants';

export default class BillingPaymentMethodAddCtrl {
  /* @ngInject */
  constructor($translate, Alerter, ovhContacts, ovhPaymentMethod,
    OVH_PAYMENT_METHOD_TYPE, OVH_PAYMENT_METHOD_INTEGRATION_TYPE) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.ovhContacts = ovhContacts;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.OVH_PAYMENT_METHOD_TYPE = OVH_PAYMENT_METHOD_TYPE;
    this.OVH_PAYMENT_METHOD_INTEGRATION_TYPE = OVH_PAYMENT_METHOD_INTEGRATION_TYPE;

    // other attributes used in view
    this.creditCardFootprintAmount = CREDITCARD_FOOTPRINT_AMOUNT;
    this.integrationSubmitFunction = null;

    this.loading = {
      redirecting: false,
    };
  }

  /* ================================
  =            Callbacks            =
  ================================= */

  /* ----------  Integration callbacks  ---------- */

  onPaymentMethodIntegrationInitialized(submitFn) {
    // set integration submit function to give the possibility to submit
    // some integration types (e.g.: redirect, vantivIframe).
    this.integrationSubmitFunction = submitFn;

    // return specific options for integration rendering
    // depending on the payment method type integration value.
    return {};
  }

  onPaymentMethodIntegrationSubmit() {
    const postParams = {
      default: this.model.setAsDefault,
    };

    if (this.model.selectedPaymentMethodType.isRequiringContactId()) {
      const { billingContact } = this.model;

      // if no id to contact, we need to create it first before adding payment method
      if (!_.get(billingContact, 'id')) {
        // force non needed value for contact creation
        // this should be done in component
        if (!billingContact.legalForm) {
          billingContact.legalForm = 'individual';
        }
        if (!billingContact.language) {
          billingContact.language = this.currentUser.language;
        }

        // create a new contact
        return this.ovhContacts.createContact(billingContact)
          .then((contact) => {
            _.set(postParams, 'billingContactId', contact.id);
            return postParams;
          });
      }

      _.set(postParams, 'billingContactId', billingContact.id);
    }

    return postParams;
  }

  onPaymentMethodIntegrationSubmitError(error) {
    this.Alerter.error(this.$translate.instant('billing_payment_method_add_error', {
      errorMessage: _.get(error, 'data.message'),
    }), 'billing_payment_method_add_alert');
  }

  onPaymentMethodIntegrationSuccess(paymentMethod) {
    this.loading.redirecting = true;
    this.onPaymentMethodAdded(paymentMethod);
  }

  /* ----------  OuiStepper callbacks  ---------- */

  onPaymentMethodAddStepperFinish() {
    // call integrationSubmitFunction if provided
    if (_.isFunction(this.integrationSubmitFunction)) {
      return this.integrationSubmitFunction();
    }

    if (this.addSteps.legacyBankAccount.isVisible()) {
      return this.ovhPaymentMethod.addPaymentMethod(this.model.selectedPaymentMethodType, {
        bic: this.model.bankAccount.bic,
        iban: this.model.bankAccount.iban,
        ownerAddress: this.model.billingAddress.ownerAddress,
        ownerName: this.model.billingAddress.ownerName,
        default: this.model.setAsDefault,
      })
        .then(paymentMethod => this.onPaymentMethodIntegrationSuccess(paymentMethod))
        .catch(error => this.onPaymentMethodIntegrationSubmitError(error));
    }

    return true;
  }

  /* -----  End of Callbacks  ------ */
}
