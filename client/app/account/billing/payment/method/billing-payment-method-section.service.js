import _ from 'lodash';

let _sharedPaymentMethods = null;

export default class BillingPaymentMethodSection {
  /* @ngInject */

  constructor($q, ovhPaymentMethod) {
    this.$q = $q;
    this.ovhPaymentMethod = ovhPaymentMethod;

    this.loadDeferred = null;
    this.loadDeferredResolved = false;
  }

  get sharedPaymentMethods() {
    return _sharedPaymentMethods;
  }

  removePaymentMehtod({ paymentMethodId }) {
    _.remove(_sharedPaymentMethods, {
      paymentMethodId,
    });

    return _sharedPaymentMethods;
  }

  getPaymentMehtods() {
    if (!this.loadDeferred || this.loadDeferredResolved) {
      this.loadDeferred = this.$q.defer();
      this.loadDeferredResolved = false;
    } else if (!this.loadDeferredResolved) {
      return this.loadDeferred.promise;
    }

    this.ovhPaymentMethod
      .getAllPaymentMethods({
        transform: true,
      })
      .then(paymentMethodsParams => {
        _sharedPaymentMethods = _.filter(paymentMethodsParams, ({ paymentType, status }) => {
          if (paymentType.value !== 'BANK_ACCOUNT') {
            return true;
          }
          return status.value !== 'BLOCKED_FOR_INCIDENTS';
        });

        this.loadDeferred.resolve(_sharedPaymentMethods);

        return _sharedPaymentMethods;
      })
      .catch((error) => {
        return this.loadDeferred.reject(error);
      })
      .finally(() => {
        this.loadDeferredResolved = true;
      });

    return this.loadDeferred.promise;
  }

};

angular
  .module('Billing')
  .service('billingPaymentMethodSection', BillingPaymentMethodSection);
