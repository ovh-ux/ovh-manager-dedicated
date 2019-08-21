import _ from 'lodash';
import BillingService from '../../BillingService.class';

export default class {
  /* @ngInject */
  constructor($translate, atInternet, Alerter) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.billingService = new BillingService(this.service);

    this.model = {
      agreements: this.autorenewAgreements.length === 0,
    };
  }

  switchStep() {
    this.displayConfirmation = !this.displayConfirmation;
  }

  update() {
    this.isUpdating = true;
    return this.updateRenew(this.billingService, this.autorenewAgreements)
      .then(() => this.goBack(
        this.$translate.instant('billing_autorenew_service_update_success'),
      ))
      .catch(error => this.Alerter.set(
        'alert-danger',
        this.$translate.instant('billing_autorenew_service_update_error', { message: _.get(error, 'data.message') }),
      ))
      .finally(() => {
        this.isUpdating = false;
      });
  }

  onFocus(event) {
    this.atInternet.trackEvent({
      event,
      page: `dedicated::billing::${event}`,
    });
  }

  onFinish() {
    this.atInternet.trackClick({
      name: 'autorenew::validate-config',
      type: 'action',
    });
  }
}
