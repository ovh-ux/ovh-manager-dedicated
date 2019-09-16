import _ from 'lodash';

export default class Ola {
  constructor(resource) {
    Object.assign(this, resource);

    this.configStep = !_.isUndefined(this.configStep)
      ? parseInt(this.configStep, 10)
      : 0;
  }

  isActivated() {
    return !_.isEmpty(this.supportedModes) || this.isOlaActivated;
  }

  isAvailable() {
    return this.available || true; // For mockup purpose
  }

  isConfigured() {
    return this.isOlaConfigured; // TODO: Need to update when API is prodded
  }
}
