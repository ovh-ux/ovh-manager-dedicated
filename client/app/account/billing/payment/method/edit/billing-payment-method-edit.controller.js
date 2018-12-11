export default class BillingPaymentMethodEditCtrl {
  constructor($injector, $q, $uibModalInstance, paymentMethodToEdit, ovhPaymentMethod) {
    /* @ngInject */

    // dependencies injections
    this.$injector = $injector;
    this.$q = $q;
    this.$uibModalInstance = $uibModalInstance;
    this.paymentMehtodInEdition = paymentMethodToEdit;
    this.ovhPaymentMethod = ovhPaymentMethod;

    // other attribute used in view
    this.loading = {
      translations: false,
      save: false,
    };

    this.model = {
      description: this.paymentMehtodInEdition.description,
    };
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onPaymentMehtodEditFormSubmit() {
    this.loading.save = true;

    return this.ovhPaymentMethod.editPaymentMethod(this.paymentMehtodInEdition, {
      description: this.model.description,
    }).then(() => this.$uibModalInstance.close({
      description: this.model.description,
    }))
      .catch(error => this.$uibModalInstance.dismiss(error))
      .finally(() => {
        this.loading.save = false;
      });
  }

  /* -----  End of EVENTS  ------ */

  /* =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
    this.loading.translations = true;

    return this.$injector.invoke(
      /* @ngTranslationsInject ./translations */
    ).finally(() => {
      this.loading.translations = false;
    });
  }

  /* -----  End of INITIALIZATION  ------ */
}
