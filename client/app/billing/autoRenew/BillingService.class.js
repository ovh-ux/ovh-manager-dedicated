import _ from 'lodash';

export default class BillingService {
  constructor(service) {
    Object.assign(this, service);

    this.expirationDate = moment(this.expiration);
  }

  getRenew() {
    if (this.hasManualRenew()) {
      return 'manualPayment';
    }

    if (this.shouldDeleteAtExpiration()) {
      return 'delete_at_expiration';
    }

    if (this.isResiliated()) {
      return 'expired';
    }

    if (this.hasAutomaticRenew()) {
      return 'automatic';
    }

    return 'manualPayment';
  }

  hasAutomaticRenew() {
    return this.renew.automatic;
  }

  hasForcedRenew() {
    return this.renew.forced;
  }

  isExpired() {
    return this.status.toLowerCase() === 'expired';
  }

  shouldDeleteAtExpiration() {
    return this.renew.deleteAtExpiration;
  }

  hasAutomaticRenewal() {
    return (this.hasForcedRenew() || this.hasAutomaticRenew())
            && (this.shouldDeleteAtExpiration() || this.isExpired());
  }

  hasManualRenew() {
    return this.renew.manualPayment;
  }

  isResiliated() {
    return this.isExpired()
            || (
              moment().isAfter(this.expirationDate)
                && !this.hasAutomaticRenew()
                && !this.hasForcedRenew()
            );
  }

  hasDebt() {
    const renew = _.get(this, 'serviceInfos.renew');
    return _.includes(['PENDING_DEBT', 'UN_PAID'], renew.status);
  }

  setRenewPeriod(period) {
    this.renew.period = period;
  }

  setAutomaticRenew(period) {
    _.assign(this.renew, {
      manualPayment: false,
      automatic: true,
      deleteAtExpiration: false,
      period,
    });
  }

  setManualRenew() {
    _.assign(this.renew, {
      manualPayment: true,
      automatic: false,
      deleteAtExpiration: false,
    });
  }

  getExpirationDate() {
    return this.expirationDate.format('LL');
  }

  cancelResiliation() {
    this.renew.deleteAtExpiration = false;
  }

  canHaveEngagement() {
    return ['DEDICATED_SERVER'].includes(this.serviceType);
  }

  setForResiliation() {
    if (this.hasAutomaticRenew() && !this.isAutomaticallyRenewed()) {
      this.setManualRenew();
    }

    this.renew.deleteAtExpiration = true;
  }

  isAutomaticallyRenewed() {
    return ['automaticV2014', 'automaticV2016', 'automaticForcedProduct'].includes(this.renewalType);
  }
}
