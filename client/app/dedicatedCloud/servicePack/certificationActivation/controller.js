import { STEPS } from './constants';

/* @ngInject */
export default class DedicatedCloudServicePackCertificationActivation {
  constructor(
    $state,
    $transitions,
  ) {
    this.$state = $state;
    this.$transitions = $transitions;
  }

  $onInit() {
    this.steps = STEPS;
  }

  /*
  $onInit() {
    this.steps = [
      {
        stateName: 'selection',
        displayName: 'Choix du type de certification',
        isActive: true,
      },
      {
        stateName: 'requiredConfiguration',
        displayName: 'Configuration requise',
      },
      {
        stateName: 'smsActivation',
        displayName: 'Activation par SMS',
      },
      {
        stateName: 'confirmation',
        displayName: 'Confirmation',
      },
      {
        stateName: 'validation',
        displayName: 'Validation de la certification',
      },
    ];

    return this.goToStep(this.steps[0].stateName);
  }
    */

  exit() {
    return this.$state.go('^');
  }
}
