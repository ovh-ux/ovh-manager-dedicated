import _ from 'lodash';
import BillingService from '../../../../models/BillingService.class';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.editedService = new BillingService(this.service);
  }

  updateContacts() {
    this.isUpdating = true;

    return this.changeContact(this.editedService)
      .then(() => this.goBack(
        this.$translate.instant('account_contacts_service_edit_success'),
      ))
      .catch(error => this.goBack(
        this.$translate.instant('account_contacts_service_edit_error', _.get(error, 'data.message')),
        'danger',
      ));
  }
}
