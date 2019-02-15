export default class DedicatedCloudStepper {
  constructor(
    $state,
    $stateRegistry,
    $transitions,
  ) {
    this.$state = $state;
    this.$stateRegistry = $stateRegistry;
    this.$transitions = $transitions;
  }

  $onInit() {
    this.callerStateName = this.$state.current.name;

    const transitionCriteria = {
      from: `${this.callerStateName}.**`,
      to: `${this.callerStateName}.**`,
    };

    this.$transitions.onStart(
      transitionCriteria,
      () => {
        this.activateLoader(true);
      },
    );
    this.$transitions.onSuccess(
      transitionCriteria,
      () => {
        this.activateLoader(false);
      },
    );

    this.registerStepStates();

    this.goToStep(this.steps[0]);
  }

  activateLoader(loaderIsActivated) {
    this.isLoading = loaderIsActivated;
  }

  goToNextStep() {
    const activeStepIndex = _.findIndex(
      this.steps,
      { isActive: true },
    );

    return this.goToStep(this.steps[activeStepIndex + 1]);
  }

  goToPreviousStep() {
    const lastCompleteStepIndex = _.findLastIndex(
      this.steps,
      { isComplete: true },
    );

    return this.goToStep(this.steps[lastCompleteStepIndex]);
  }

  goToStep(step) {
    this.activeStep = step;

    const { subStates } = this.steps.reduce(
      (previousValue, currentValue) => {
        if (previousValue.destinationStepWasFound) {
          return previousValue;
        }

        previousValue.subStates.push(currentValue.name);

        if (currentValue.name === step.name) {
          return {
            destinationStepWasFound: true,
            subStates: previousValue.subStates,
          };
        }

        return previousValue;
      },
      {
        subStates: [],
        destinationStepWasFound: false,
      },
    );

    const stateName = [this.callerStateName, ...subStates].join('.');
    return this.$state.go(stateName);
  }

  registerStepStates() {
    let currentStepName = this.callerStateName;

    this.steps.forEach((step) => {
      currentStepName = `${currentStepName}.${step.name}`;
      const baseStep = _.get(step, 'state', {});

      this.$stateRegistry.register({
        ...baseStep,
        name: currentStepName,
        views: {
          [`content@${this.callerStateName}`]: step.moduleName,
        },
      });
    });
  }
}
