import _ from 'lodash';

export default class {
  constructor(
    $state,
    $stateRegistry,
  ) {
    // Each step is a child of the stepper
    // This is the root state of the stepper itself,
    // parent of the state of the first step
    this.$state = $state;
    this.rootState = $state.$current;
    this.$stateRegistry = $stateRegistry;
  }

  registerStatesFromSteps(steps) {
    let currentStateName = this.rootState.name;

    _.forEach(
      steps,
      (step) => {
        currentStateName = `${currentStateName}.${step.name}`;
        _.set(step, 'state.name', currentStateName);

        if (!this.$state.href(currentStateName)) {
          this.registerState(step.state);
        }
      },
    );
  }

  registerState(state) {
    this.$stateRegistry.register({
      ...state,
      component: undefined,
      views: {
        [`content@${this.rootState.name}`]: state.component,
      },
    });
  }

  goToState(stateName, parameters) {
    return this.$state.go(stateName, parameters);
  }

  close(transitionOptions) {
    return this.$state.go(this.rootState.parent.parent.name, {}, transitionOptions);
  }
}
