import step from './configure-users.step';
import Step from '../../../../../components/stepper/stepper.step';

export const ConfigureUsersService = class {
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

export const name = 'ovhManagerPccServicePackUpgradeConfigureUsersService';

export default {
  ConfigureUsersService,
  name,
};
