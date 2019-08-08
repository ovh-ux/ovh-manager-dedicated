import _ from 'lodash';

export default class BillingAutoRenewDeleteCtrl {
  /* @ngInject */
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
        `${this.$translate.instant('autorenew_service_delete_success')}
        <a data-href="${this.cancelResiliationUrl}" data-translate="autorenew_service_delete_cancel"></a>`,
      ))
      .catch(error => this.goBack(
        this.$translate.instant('autorenew_service_delete_error', { message: _.get(error, 'data.message') }),
        'danger',
      ));
  }
}
