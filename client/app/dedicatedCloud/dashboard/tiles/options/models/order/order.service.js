import { PREFERENCE_NAME } from './order.constants';

export const name = 'ovhManagerPccDashboardOptionsOrder';

export const OptionsService = class {
  /* @ngInject */
  constructor(
    $q,
    OvhApiMe,
    ovhUserPref,
  ) {
    this.$q = $q;
    this.OvhApiMe = OvhApiMe;
    this.ovhUserPref = ovhUserPref;
  }

  async doesPreferenceExists(serviceName) {
    const preferenceKeys = await this.ovhUserPref.getKeys();

    try {
      const preferenceKeyExists = preferenceKeys.includes(PREFERENCE_NAME);

      if (!preferenceKeyExists) {
        return false;
      }

      return await this.getPreferenceForService(serviceName);
    } catch (error) {
      return error.status === 404;
    }
  }

  getPreferenceForService(serviceName) {
    return this
      .ovhUserPref
      .getValue(PREFERENCE_NAME)
      .then(preference => (_.isObject(preference[serviceName])
        ? preference[serviceName]
        : this.$q.reject({ status: 404 })));
  }

  removePreference(serviceName) {
    return this
      .getPreferenceForService(serviceName)
      .then(preference => this.updatePreference(_.omit(preference, serviceName)));
  }

  updatePreference(preference) {
    return this
      .ovhUserPref
      .remove(PREFERENCE_NAME)
      .then(() => this.ovhUserPref.assign(preference));
  }

  getOrderWithStatus(orderId) {
    const mergeOrderAndItsStatus = array => _.reduce(
      array,
      (accumulator, current) => ({ ...accumulator, ...current }),
      {},
    );

    return this.$q
      .all([
        this.OvhApiMe.Order().v6().get({ orderId }).$promise,
        this.OvhApiMe.Order().v6().getStatus({ orderId }).$promise,
      ])
      .then(mergeOrderAndItsStatus);
  }

  // This uses async/await as it's way easier to understand this way
  async getServicePackOrder(serviceName) {
    const preferenceExists = await this.doesPreferenceExists(serviceName);

    if (!preferenceExists) {
      return { exists: false };
    }

    const preference = await this.getPreferenceForService(serviceName);
    const order = await this.getOrderWithStatus(preference.id);

    return {
      exists: true,
      ...preference,
      ...order,
    };
  }

  savePendingOrder(serviceName, {
    activationType, id, needsConfiguration, orderedServicePackName, url,
  }) {
    return this.ovhUserPref
      .assign(PREFERENCE_NAME, {
        [serviceName]: {
          activationType,
          id,
          needsConfiguration,
          orderedServicePackName,
          url,
        },
      });
  }
};

export default {
  name,
  OptionsService,
};
