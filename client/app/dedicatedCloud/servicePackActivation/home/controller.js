import {
  ACTIVATION_TYPES,
} from './constants';

/* @ngInject */
export default class {
  constructor(
    $state,
    $transitions,
    Alerter,
  ) {
    this.$state = $state;
    this.$transitions = $transitions;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.activationType = this.$transition$.params().activationType;
    this.callerStateName = this.$state.$current.parent.name;
    this.steps = ACTIVATION_TYPES[this.activationType];

    this.$transitions.onError(
      {
        to: `${this.callerStateName}.**`,
      },
      (transition) => {
        this
          .exit()
          .then(() => {
            this.Alerter.alertFromSWS(
              this.$translate.instant('dedicatedCloud_servicePackActivation_confirmation_order_failure'),
              {
                message: transition.error().message,
                type: 'ERROR',
              },
            );
          });
      },
    );
  }

  exit() {
    return this.$state.go(this.callerStateName);
  }
}
