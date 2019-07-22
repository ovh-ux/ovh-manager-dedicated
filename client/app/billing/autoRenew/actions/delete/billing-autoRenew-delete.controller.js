export default class BillingAutoRenewDeleteCtrl {
  constructor($translate) {
    this.$translate = $translate;
  }

  deleteRenew() {
    this.isDeleting = true;
    if (this.engagement) {
      return this.goBack();
    }

    this.service.setForResiliation();
    return this.updateService(this.service)
      .then(() => this.goBack(
        this.$translate.instant('autorenew_service_delete_success'),
      ))
      .catch(error => this.goBack(
        this.$translate.instant('autorenew_service_delete_error', { message: _.get(error, 'data.message') }),
        'danger',
      ));
  }
}
