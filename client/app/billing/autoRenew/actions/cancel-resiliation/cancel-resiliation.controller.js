export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  confirmResiliationCancel() {
    return this.cancelResiliation(this.service)
      .then(() => this.goBack(
        this.$translate.instant('autorenew_service_cancel_resiliation_success'),
      ))
      .catch(error => this.goBack(
        this.$translate.instant('autorenew_service_cancel_resiliation_error', { message: _.get(error, 'data.message') }),
        'danger',
      ));
  }
}
