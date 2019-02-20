import {
  ACTIVATION_TYPES,
} from './constants';

/* @ngInject */
export default class {
  constructor(
    $state,
  ) {
    this.$state = $state;
  }

  $onInit() {
    this.callerStateName = this.$state.$current.parent.name;
    this.steps = ACTIVATION_TYPES[this.$transition$.params().activationType];
  }

  exit() {
    return this.$state.go(this.callerStateName);
  }
}
