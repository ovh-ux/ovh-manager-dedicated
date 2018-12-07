export default class BillingPaymentMethodEditCtrl {
  constructor($injector, $q, $uibModalInstance, payementMethodToEdit, ovhPaymentMethod) {
    /* @ngInject */

    // dependencies injections
    this.$injector = $injector;
    this.$q = $q;
    this.$uibModalInstance = $uibModalInstance;
    this.payementMehtodInEdition = payementMethodToEdit;
    this.ovhPaymentMethod = ovhPaymentMethod;

    // other attribute used in view
    this.loading = {
      translations: false,
      save: false,
    };

    this.model = {
      description: this.payementMehtodInEdition.description,
    };
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onPaymentMehtodEditFormSubmit() {
    this.loading.save = true;

    let editPromise = this.$q.when(true);

    // is it an old payment mean
    if (this.payementMehtodInEdition.original) {
      const editedPaymentMethod = angular.copy(this.payementMehtodInEdition.original);
      _.set(editedPaymentMethod, 'description', this.model.description);
      editPromise = this.ovhPaymentMethod.editPayementMethod(editedPaymentMethod);
    }

    return editPromise.then(() => this.$uibModalInstance.close({
      description: this.model.description,
    })).catch(error => this.$uibModalInstance.dismiss(error)).finally(() => {
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
