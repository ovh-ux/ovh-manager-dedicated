

export default class DedicatedCloudStepper {
  constructor(
    $q,
    $state,
    $stateRegistry,
    $transitions,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateRegistry = $stateRegistry;
    this.$transitions = $transitions;
  }

  $onInit() {
    this.callerStateName = this.$state.$current.name;
    this.baseStateName = this.$state.$current.parent.name;

    const transitionCriteria = {
      from: `${this.callerStateName}.**`,
      to: `${this.callerStateName}.**`,
    };

    const unregistrateHook = this.$transitions.onStart(
      {
        to: this.baseStateName,
      },
      () => {
        this.$stateRegistry.deregister(`${this.callerStateName}.${this.steps[0].name}`);
        unregistrateHook();
      },
    );

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

    this.memoizedParams = {};

    this.registerStepStates();
    this.goToStep(this.steps[0]);
  }

  activateLoader(loaderIsActivated) {
    this.isLoading = loaderIsActivated;
  }

  exit() {
    return this.$state.go(this.baseStateName, {}, { reload: true });
  }

  doesStepExist({ name }) {
    return _.find(
      this.steps,
      { name },
    ) != null;
  }

  validateActivateStepArguments({ name }) {
    if (!_.isString(name)) {
      throw new TypeError('stepper-header.validateActivateStepArguments: "step" parameter is not valid');
    }

    if (!this.doesStepExist({ name })) {
      throw new RangeError(`stepper-header.validateActivateStepArguments: "${name}" step was not found`);
    }
  }

  static updateStepValues(step, values) {
    return {
      ...step,
      ...values,
    };
  }

  activateStep({ name: stepName }) {
    function buildAccumulator(stepToActivateWasFound, updatedSteps) {
      return {
        stepToActivateWasFound,
        updatedSteps,
      };
    }

    function updateAccumulatorWithActiveStep(accumulator, activeStep) {
      return buildAccumulator(
        true,
        [
          ...accumulator.updatedSteps,
          DedicatedCloudStepper.updateStepValues(
            activeStep,
            {
              isActive: true,
              isComplete: false,
            },
          ),
        ],
      );
    }

    function updateAccumulatorBeforeActiveStep(accumulator, step) {
      return buildAccumulator(
        accumulator.stepToActivateWasFound,
        [
          ...accumulator.updatedSteps,

          DedicatedCloudStepper.updateStepValues(
            step,
            {
              isActive: false,
              isComplete: true,
            },
          ),
        ],
      );
    }

    function updateAccumulatorAfterActiveStep(accumulator, step) {
      return buildAccumulator(
        accumulator.stepToActivateWasFound,
        [
          ...accumulator.updatedSteps,

          DedicatedCloudStepper.updateStepValues(
            step,
            {
              isActive: false,
              isComplete: false,
            },
          ),
        ],
      );
    }

    this.validateActivateStepArguments({ name: stepName });

    const { updatedSteps } = this.steps.reduce(
      (accumulator, currentStep) => {
        const stepToActivateWasFound = currentStep.name === stepName;

        if (stepToActivateWasFound) {
          return updateAccumulatorWithActiveStep(accumulator, currentStep);
        }

        return !accumulator.stepToActivateWasFound
          ? updateAccumulatorBeforeActiveStep(accumulator, currentStep)
          : updateAccumulatorAfterActiveStep(accumulator, currentStep);
      },
      buildAccumulator(false, []),
    );

    this.steps = updatedSteps;
  }

  $onChanges({ steps }) {
    if (!_.isEmpty(steps)) {
      this.steps = steps.currentValue;
    }
  }

  goToNextStep(params) {
    const activeStepIndex = _.findIndex(
      this.steps,
      { isActive: true },
    );

    return this.goToStep(this.steps[activeStepIndex + 1], params);
  }

  goToPreviousStep(params) {
    const lastCompleteStepIndex = _.findLastIndex(
      this.steps,
      { isComplete: true },
    );

    return this.goToStep(this.steps[lastCompleteStepIndex], params);
  }

  goToStep({ name: stepName }, params) {
    this.activateStep({ name: stepName });

    const { subStates } = this.steps.reduce(
      (previousValue, currentValue) => {
        if (previousValue.destinationStepWasFound) {
          return previousValue;
        }

        previousValue.subStates.push(currentValue.name);

        if (currentValue.name === stepName) {
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

    const destinationStateName = [this.callerStateName, ...subStates].join('.');
    this.memoizedParams = { ...params, ...this.memoizedParams };
    return this.$state.go(destinationStateName, this.memoizedParams);
  }

  registerStepStates() {
    let currentStepName = this.callerStateName;

    this.steps.forEach((step) => {
      currentStepName = `${currentStepName}.${step.name}`;
      const stepBaseState = _.get(step, 'state', {});

      this.$stateRegistry.register({
        ...stepBaseState,
        name: currentStepName,
        views: {
          [`content@${this.callerStateName}`]: step.componentName,
        },
      });
    });
  }
}
