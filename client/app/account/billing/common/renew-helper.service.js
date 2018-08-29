angular
  .module('Billing.services')
  .service('billingRenewHelper', class BillingrenewHelper {
    constructor($filter, $translate) {
      this.$filter = $filter;
      this.$translate = $translate;
    }

    getRenewDateFormated(service) {
      if (!service) {
        return '';
      } if (this.serviceHasAutomaticRenew(service)) {
        return _.capitalize(this.$filter('date')(service.expiration, 'MMMM yyyy'));
      }

      const translationId = moment().isAfter(moment(service.expiration)) ? 'autorenew_service_after_expiration_date' : 'autorenew_service_expiration_date';

      return this.$translate.instant(translationId, { t0: this.$filter('date')(service.expiration, 'mediumDate') });
    }

    getRenewLabel(service) {
      if (service === '0') {
        return this.$translate.instant('autorenew_service_renew_0');
      }

      if (angular.isString(service)) {
        if (service.indexOf('frequency_value_') > -1) {
          return this.$filter('renewFrequence')(+service.split('_')[2]);
        }
        return this.$translate.instant(`autorenew_service_renew_${service}`);
      }

      if (angular.isObject(service)) {
        if (service.serviceType === 'EMAIL_DOMAIN') {
          return this.$translate.instant('autorenew_service_renew_paid');
        }
        if (!_.isEmpty(service.subProducts)) {
          return '';
        }
        return this.getRenewLabel(this.getRenewKey(service));
      }

      return '';
    }

    /* eslint-disable class-methods-use-this */
    serviceHasAutomaticRenew(service) {
      return _.has(service, 'renew') && (service.renew.forced || service.renew.automatic) && !(service.renew.deleteAtExpiration || service.status === 'EXPIRED');
    }
    /* eslint-enable class-methods-use-this */

    getRenewKey(service) {
      let txt;
      if (!service || !_.isEmpty(service.subProducts)) {
        return '';
      }

      if (service.renew.manualPayment) {
        txt = 'manuel';
      } else if (service.renew.deleteAtExpiration) {
        txt = 'delete_at_expiration';
      } else if (service.status === 'EXPIRED') {
        txt = 'manuel';
      } else if (this.serviceHasAutomaticRenew(service)) {
        txt = 'auto';
        if (service.renew.period) {
          txt = `frequency_value_${service.renew.period}`;
        }
      } else {
        txt = 'manuel';
      }

      return txt;
    }
  });
