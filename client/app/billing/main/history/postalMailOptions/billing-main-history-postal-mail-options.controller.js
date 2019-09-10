angular.module('Billing').controller('BillingHistoryPostalMailOptionsCtrl', class {
  constructor($state, $stateParams, $translate, $uibModalInstance, Alerter, OvhApiMe,
    postalMailOptionsActivated) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.Alerter = Alerter;
    this.OvhApiMe = OvhApiMe;
    this.postalMailOptionsActivated = postalMailOptionsActivated;

    this.loading = {
      update: false,
    };
  }

  confirmChoice() {
    this.loading.update = true;

    this.OvhApiMe.Billing().InvoicesByPostalMail().v6().post({
      enable: this.postalMailOptionsActivated,
    }).$promise.then(() => {
      this.Alerter.success(this.$translate.instant(this.$stateParams.activate === 'true' ? 'billing_main_history_postal_mail_options_activate_success' : 'billing_main_history_postal_mail_options_desactivate_success'), 'billing_main_alert');
      this.$uibModalInstance.close();
    }).catch((error) => {
      this.Alerter.error([this.$translate.instant('billing_main_history_postal_mail_options_update_error'), _.get(error, 'data.message')].join(' '), 'billing_main_alert');
      this.$uibModalInstance.dismiss();
    }).finally(() => {
      this.loading.update = false;
    });
  }
});
