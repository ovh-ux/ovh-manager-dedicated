export default class BillingPaymentMethodEditCtrl {
  /* @ngInject */
  constructor(redirectTo) {
    console.log('coucou !', redirectTo);
  }
}


// constructor($injector, $q, $uibModalInstance, paymentMethodToEdit, ovhPaymentMethod, redirectTo) {
  //   console.log('BillingPaymentMethodEditCtrl');
  //   // dependencies injections
  //   this.$injector = $injector;
  //   this.$q = $q;
  //   this.$uibModalInstance = $uibModalInstance;
  //   this.paymentMethodInEdition = paymentMethodToEdit;
  //   this.ovhPaymentMethod = ovhPaymentMethod;

  //   // other attribute used in view
  //   this.loading = {
  //     translations: false,
  //     save: false,
  //   };

  //   this.model = {
  //     description: this.paymentMethodInEdition.description,
  //   };
  // }

  // /* =============================
  // =            EVENTS            =
  // ============================== */

  // onPaymentMethodEditFormSubmit() {
  //   this.loading.save = true;

  //   return this.ovhPaymentMethod.editPaymentMethod(this.paymentMethodInEdition, {
  //     description: this.model.description,
  //   }).then(() => this.$uibModalInstance.close({
  //     description: this.model.description,
  //   }))
  //     .catch(error => this.$uibModalInstance.dismiss(error))
  //     .finally(() => {
  //       this.loading.save = false;
  //     });
  // }

  // /* -----  End of EVENTS  ------ */

  // /* =====================================
  // =            INITIALIZATION            =
  // ====================================== */

  // $onInit() {
  //   this.loading.translations = true;

  //   return this.$injector.invoke(
  //     /* @ngTranslationsInject:json ./translations */
  //   ).finally(() => {
  //     this.loading.translations = false;
  //   });
  // }

  // /* -----  End of INITIALIZATION  ------ */
