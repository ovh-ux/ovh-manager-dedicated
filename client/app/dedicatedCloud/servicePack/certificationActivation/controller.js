import {
  STEPS,
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
    this.steps = STEPS;
  }

  exit() {
    return this.$state.go(this.callerStateName);
  }
}
