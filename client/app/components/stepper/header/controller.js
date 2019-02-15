import _ from 'lodash';

/* @ngInject */
export default class DedicatedCloudStepperHeader {
  constructor(
    $q,
    $state,
  ) {
    this.$q = $q;
    this.$state = $state;
  }

  doesStepExist({ name }) {
    return _.find(
      this.steps,
      { name },
    ) != null;
  }

  checkActivateStepArguments({ name }) {
    if (!_.isString(name)) {
      throw new TypeError('stepper-header.checkActivateStepArguments: "step" parameter is not valid');
    }

    if (!this.doesStepExist({ name })) {
      throw new RangeError(`stepper-header.checkActivateStepArguments: "${name}" step was not found`);
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
          DedicatedCloudStepperHeader.updateStepValues(
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

          DedicatedCloudStepperHeader.updateStepValues(
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

          DedicatedCloudStepperHeader.updateStepValues(
            step,
            {
              isActive: false,
              isComplete: false,
            },
          ),
        ],
      );
    }

    this.checkActivateStepArguments({ name: stepName });

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

  $onChanges({ activeStep }) {
    if (!_.isEmpty(activeStep)) {
      return this.activateStep(activeStep.currentValue);
    }

    return this.$q.when();
  }
}
