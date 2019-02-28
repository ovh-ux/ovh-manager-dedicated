import {
  ACTIVATION_TYPES,
} from './constants';

/* @ngInject */
export default class {
  constructor(
    $q,
    $state,
    $transitions,
    $translate,
    Alerter,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$transitions = $transitions;
    this.$translate = $translate;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.activationType = this.$transition$.params().activationType;
    this.title = this.$translate.instant(`dedicatedCloud_servicePack_${this.activationType}_header`);
    this.callerStateName = this.$state.$current.parent.name;
    this.steps = ACTIVATION_TYPES[this.activationType];

    this.$transitions.onError(
      {
        to: `${this.callerStateName}.**`,
      },
      transition => (transition.error().type !== 6
        ? this.$q.when()
        : this
          .exit()
          .then(() => {
            this.Alerter.alertFromSWS(
              this.$translate.instant('dedicatedCloud_servicePack_confirmation_order_failure'),
              {
                message: _.get(transition.error(), 'detail', transition.error()).message,
                type: 'ERROR',
              },
            );
          })),
    );
  }

  exit() {
    return this.$state.go(this.callerStateName);
  }
}
