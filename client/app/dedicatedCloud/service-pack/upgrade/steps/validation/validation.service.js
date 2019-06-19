import step from './validation.step';
import Step from '../../../../../components/stepper/stepper.step';

export const ValidationService = class {
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

export const name = 'ovhManagerPccServicePackUpgradeValidationService';

export default {
  name,
  ValidationService,
};
