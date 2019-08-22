import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  updateContacts() {
    this.isUpdating = true;

    return this.changeContact(this.service)
      .then(() => this.goBack(
        this.$translate.instant('account_contacts_service_edit_success'),
      ))
      .catch(error => this.goBack(
        this.$translate.instant('account_contacts_service_edit_error', _.get(error, 'data.message')),
        'danger',
      ));
  }
}
