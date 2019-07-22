import _ from 'lodash';
import { AUTO_TYPE, RENEWAL_TYPES } from './form.constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.AUTO_TYPE = AUTO_TYPE;
  }

  $onInit() {
    this.PERIODS = _.map(
      this.service.possibleRenewPeriod,
      period => ({
        period,
        label: this.$translate.instant('billing_autorenew_service_update_service_period_value', { month: period }),
      }),
    );
    this.RENEWAL_TYPES = _.map(
      RENEWAL_TYPES,
      type => ({ type, label: this.$translate.instant(`billing_autorenew_service_update_service_${type}`) }),
    );

    this.model = {
      renewalType: _.find(this.RENEWAL_TYPES, { type: this.service.getRenew() }),
      period: _.find(this.PERIODS, { period: this.service.renew.period }) || _.head(this.PERIODS),
    };
  }

  onRenewalTypeChange(renewalType) {
    if (renewalType.type === AUTO_TYPE) {
      this.service.setAutomaticRenew(this.model.period.period);
    } else {
      this.service.setManualRenew();
    }
  }

  onPeriodChange(period) {
    this.service.setRenewPeriod(period.period);
  }
}
