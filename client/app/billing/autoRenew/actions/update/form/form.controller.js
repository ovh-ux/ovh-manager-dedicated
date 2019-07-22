import _ from 'lodash';
import { RENEWAL_TYPES } from './form.constants';

export default class {
  /* @ngInject */
  constructor($translate, BillingAutorenewUpdateForm) {
    this.$translate = $translate;
    this.BillingAutorenewUpdateForm = BillingAutorenewUpdateForm;
  }

  $onInit() {
    this.PERIODS = this.BillingAutorenewUpdateForm.getAvailableRenewPeriods(this.service);
    this.RENEWAL_TYPES = this.BillingAutorenewUpdateForm.getRenewalTypes();

    this.model = {
      renewalType: _.find(this.RENEWAL_TYPES, { type: this.service.getRenew() }),
      period: _.find(this.PERIODS, { period: this.service.renew.period }) || _.head(this.PERIODS),
    };
  }

  onRenewalTypeChange(renewalType) {
    if (renewalType.type === RENEWAL_TYPES.AUTOMATIC) {
      this.service.setAutomaticRenew(this.model.period.period);
    } else {
      this.service.setManualRenew();
    }
  }

  onPeriodChange(period) {
    this.service.setRenewPeriod(period.period);
  }
}
