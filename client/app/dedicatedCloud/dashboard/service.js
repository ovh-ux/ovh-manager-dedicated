export default class {
  constructor(
    ovhUserPref,
    SERVICE_PACK_USER_PREFERENCES_KEY,
  ) {
    this.ovhUserPref = ovhUserPref;
    this.SERVICE_PACK_USER_PREFERENCES_KEY = SERVICE_PACK_USER_PREFERENCES_KEY;
  }

  fetchPendingServicePackOrder() {
    return this.ovhUserPref
      .getKeys()
      .then(keys => (keys.includes(this.SERVICE_PACK_USER_PREFERENCES_KEY)
        ? this.ovhUserPref.getValue(this.SERVICE_PACK_USER_PREFERENCES_KEY)
        : null));
  }
}
