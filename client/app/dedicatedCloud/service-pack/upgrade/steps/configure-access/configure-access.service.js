import step from './configure-access.step';
import Step from '../../../../../components/stepper/stepper.step';

export const ConfigureAccessService = class {
  /* @ngInject */
  constructor(
    $translate,
  ) {
    this.$translate = $translate;
  }

  buildStep() {
    return new Step(
      step.componentName,
      this.$translate.instant(step.translationId),
      step.name,
      step.state,
    );
  }
};

export const name = 'ovhManagerPccServicePackUpgradeConfigureAccessService';

export default {
  ConfigureAccessService,
  name,
};
