import _ from 'lodash';

export default class Ola {
  constructor(resource) {
    Object.assign(this, resource);

    this.configStep = !_.isUndefined(this.configStep)
      ? parseInt(this.configStep, 10)
      : 0;
  }

  getCurrentMode() {
    return this.isConfigured()
      ? 'vrack_aggregation'
      : 'default';
  }

  isActivated() {
    return !_.isEmpty(this.supportedModes) || this.isOlaActivated;
  }

  isAvailable() {
    return this.available;
  }

  isConfigured() {
    return this.isOlaConfigured;
  }
}
