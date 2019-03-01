import { ORDER_STATUSES } from './constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    OvhHttp,
    ovhUserPref,
    DEDICATED_CLOUD_ACTIVATION_STATUS,
    SERVICE_PACK_USER_PREFERENCES_KEY,
  ) {
    this.$q = $q;
    this.OvhHttp = OvhHttp;
    this.ovhUserPref = ovhUserPref;
    this.DEDICATED_CLOUD_ACTIVATION_STATUS = DEDICATED_CLOUD_ACTIVATION_STATUS;
    this.SERVICE_PACK_USER_PREFERENCES_KEY = SERVICE_PACK_USER_PREFERENCES_KEY;
  }

  mapOrderStatusToActivationStatus(orderStatusName) {
    if ([
      ORDER_STATUSES.cancelling,
      ORDER_STATUSES.checking,
      ORDER_STATUSES.documentsRequested,
      ORDER_STATUSES.notPaid,
    ].includes(orderStatusName)) {
      return this.DEDICATED_CLOUD_ACTIVATION_STATUS.pendingActivation;
    }

    if ([
      ORDER_STATUSES.delivering,
    ].includes(orderStatusName)) {
      return this.DEDICATED_CLOUD_ACTIVATION_STATUS.beingActivated;
    }

    return this.DEDICATED_CLOUD_ACTIVATION_STATUS.unknown;
  }

  fetchDoesPreferenceExist(preferenceName) {
    return this.ovhUserPref
      .getKeys()
      .then(keys => keys.includes(preferenceName));
  }

  fetchPreferences() {
    return this.ovhUserPref
      .getValue(this.SERVICE_PACK_USER_PREFERENCES_KEY);
  }

  fetchOrderStatus(orderId) {
    return this.OvhHttp
      .get(`/me/order/${orderId}/status`, {
        rootPath: 'apiv6',
      });
  }

  fetchIsOrderStillPending(orderId) {
    return this.fetchOrderStatus(orderId)
      .then(orderStatus => orderStatus === 'notPaid')
      .catch(error => (error.code === 404 ? false : this.$q.reject(error)));
  }

  fetchIsOrderDelivered(orderId) {
    return this.fetchOrderStatus(orderId)
      .then(orderStatus => orderStatus === 'delivered')
      .catch(error => (error.code === 404 ? false : this.$q.reject(error)));
  }

  removeServicePackOrderPreferences() {
    return this.ovhUserPref.remove(this.SERVICE_PACK_USER_PREFERENCES_KEY);
  }

  removeServicePackOrderPreferencesIfNeeded() {
    return this
      .fetchDoesPreferenceExist(this.SERVICE_PACK_USER_PREFERENCES_KEY)
      .then(preferenceStillExists => (preferenceStillExists
        ? this
          .fetchPreferences()
          .then(preferences => this.fetchOrderStatus(preferences.order.id))
          .then(orderStatus => (orderStatus === 'delivered'
            ? this.removeServicePackOrderPreferences()
            : undefined))
        : undefined));
  }

  fetchPreferencesWithOrderStatus() {
    return this
      .fetchPreferences()
      .then(preferences => this
        .fetchOrderStatus(preferences.order.id)
        .then(orderStatus => Object.assign(
          {},
          preferences,
          {
            order: {
              status: orderStatus,
            },
          },
        )));
  }

  fetchPendingServicePackOrder() {
    return this.fetchDoesPreferenceExist(this.SERVICE_PACK_USER_PREFERENCES_KEY)
      .then(preferenceStillExists => (preferenceStillExists
        ? this.fetchPreferencesWithOrderStatus()
        : undefined));
  }
}
