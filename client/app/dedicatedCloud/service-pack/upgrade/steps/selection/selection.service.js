import step from './selection.step';
import Step from '../../../../../components/stepper/stepper.step';

export const SelectionService = class {
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

export const name = 'ovhManagerPccServicePackUpgradeSelectionService';

export default {
  name,
  SelectionService,
};
