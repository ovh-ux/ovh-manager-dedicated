import { ACTIVATION_TYPES } from './constants';

export default class {
  constructor(
    $injector,
    $translate,
    selectionService,
  ) {
    this.$injector = $injector;
    this.$translate = $translate;
    this.selectionService = selectionService;
  }

  buildSteps(activationType) {
    return ACTIVATION_TYPES[activationType]
      .map(step => this.$injector.get(step.serviceName).buildStep());
  }
}