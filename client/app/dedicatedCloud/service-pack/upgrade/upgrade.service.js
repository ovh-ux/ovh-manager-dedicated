import { ACTIVATION_TYPES } from './upgrade.constants';

export const name = 'ovhManagerPccServicePackUpgradeService';

export const UpgradeService = class {
  /* @ngInject */
  constructor(
    $injector,
    $translate,
  ) {
    this.$injector = $injector;
    this.$translate = $translate;
  }

  buildSteps(activationType) {
    return ACTIVATION_TYPES[activationType]
      .map(step => this.$injector.get(step.serviceName).buildStep());
  }
};

export default {
  name,
  UpgradeService,
};
