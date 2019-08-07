import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  activate() {
    this.isActivating = true;
    return this.activateAutorenew()
      .then(() => this.goBack(
        this.$translate.instant('billing_autorenew_service_activation_success'),
      ))
      .catch(error => this.goBack(
        this.$translate.instant('billing_autorenew_service_activation_error', { message: _.get(error, 'data.message') }),
        'danger',
      ));
  }
}
