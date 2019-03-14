import { ORDER_STATUS } from './constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    OvhApiMe,
    ovhUserPref,
    ACTIVATION_STATUS,
    ORDER_PREFERENCE_NAME,
  ) {
    this.$q = $q;
    this.OvhApiMe = OvhApiMe;
    this.ovhUserPref = ovhUserPref;
    this.ACTIVATION_STATUS = ACTIVATION_STATUS;
    this.ORDER_PREFERENCE_NAME = ORDER_PREFERENCE_NAME;
  }

  removeServicePackOrderPreferencesIfNeeded() {
    return this
      .fetchDoesOrderPreferenceExist()
      .then(preferenceExists => (preferenceExists
        ? this
          .fetchOrderPreference()
          .then(preferences => this.fetchOrderStatus(preferences.order.id))
          .then(orderStatus => (orderStatus === ORDER_STATUS.delivered
            ? this.removeServicePackOrderPreferences()
            : null))
        : null));
  }

  fetchOrderPreferenceWithOrderStatus() {
    return this
      .fetchOrderPreference()
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
    return this.fetchDoesOrderPreferenceExist()
      .then(preferenceExists => (preferenceExists
        ? this.fetchOrderPreferenceWithOrderStatus()
        : null));
  }
}
