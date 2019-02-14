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
    this.baseStateName = 'app.dedicatedClouds.servicePackCertificationActivation';

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

    this.$transitions.onBefore(
      {
        from: 'app.dedicatedClouds.servicePackCertificationActivation.**',
        to: 'app.dedicatedClouds.servicePackCertificationActivation.**',
      },
      (transition) => {
        console.log('before');
        console.log(transition.$id);
        console.log(transition.$to());
        console.log(transition.entering());
        console.log(transition.error());
      },
    );

    this.$transitions.onStart(
      {
      },
      (transition) => {
        console.log('start');
        console.log(transition.$id);
        console.log(transition.$to());
        console.log(transition.entering());
        console.log(transition.error());
        this.transitionIsInProgress = true;
      },
    );

    this.$transitions.onExit(
      {
        from: 'app.dedicatedClouds.servicePackCertificationActivation.**',
        to: 'app.dedicatedClouds.servicePackCertificationActivation.**',
      },
      (transition) => {
        console.log('exit');
        console.log(transition.$id);
        console.log(transition.$to());
        console.log(transition.entering());
        console.log(transition.error());
      },
    );

    this.$transitions.onRetain(
      {
        from: 'app.dedicatedClouds.servicePackCertificationActivation.**',
        to: 'app.dedicatedClouds.servicePackCertificationActivation.**',
      },
      (transition) => {
        console.log('retain');
        console.log(transition.$id);
        console.log(transition.$to());
        console.log(transition.entering());
        console.log(transition.error());
      },
    );

    this.$transitions.onEnter(
      {
        from: 'app.dedicatedClouds.servicePackCertificationActivation.**',
        to: 'app.dedicatedClouds.servicePackCertificationActivation.**',
      },
      (transition) => {
        console.log('enter');
        console.log(transition.$id);
        console.log(transition.$to());
        console.log(transition.entering());
        console.log(transition.error());
      },
    );

    this.$transitions.onFinish(
      {
        from: 'app.dedicatedClouds.servicePackCertificationActivation.**',
        to: 'app.dedicatedClouds.servicePackCertificationActivation.**',
      },
      (transition) => {
        console.log('finish');
        console.log(transition.$id);
        console.log(transition.$to());
        console.log(transition.entering());
        console.log(transition.error());
      },
    );

    this.$transitions.onSuccess(
      {
        from: 'app.dedicatedClouds.servicePackCertificationActivation.**',
        to: 'app.dedicatedClouds.servicePackCertificationActivation.**',
      },
      (transition) => {
        console.log('success');
        console.log(transition.$id);
        console.log(transition.$to());
        console.log(transition.entering());
        console.log(transition.error());
        this.transitionIsInProgress = false;
      },
    );

    this.$transitions.onError(
      {
        from: 'app.dedicatedClouds.servicePackCertificationActivation.**',
        to: 'app.dedicatedClouds.servicePackCertificationActivation.**',
      },
      (transition) => {
        console.log('error');
        console.log(transition.error());
      },
    );

    return this.goToStep(this.steps[0].stateName);
  }

  changeActiveStep(stepStateName) {
    this.steps = this.steps.reduce(
      (previousValue, currentValue) => {
        const isActive = currentValue.stateName === stepStateName;

        if (isActive) {
          return {
            stepToActivateWasFound: true,
            steps: [
              ...previousValue.steps,
              {
                ...currentValue,
                isActive: true,
                isComplete: false,
              },
            ],
          };
        }

        return {
          ...previousValue,
          steps: [
            ...previousValue.steps,
            {
              ...currentValue,
              isActive: false,
              isComplete: !previousValue.stepToActivateWasFound,
            },
          ],
        };
      }, {
        stepToActivateWasFound: false,
        steps: [],
      },
    ).steps;
  }

  goToNextStep() {
    const activeStepIndex = _.findIndex(
      this.steps,
      { isActive: true },
    );

    this.changeActiveStep(this.steps[activeStepIndex + 1].stateName);
    return this.goToStep(this.steps[activeStepIndex + 1].stateName);
  }

  goToPreviousStep() {
    const lastCompleteStepIndex = _.findLastIndex(
      this.steps,
      { isComplete: true },
    );

    this.changeActiveStep(this.steps[lastCompleteStepIndex].stateName);
    return this.goToStep(this.steps[lastCompleteStepIndex].stateName);
  }

  goToStep(stepStateName) {
    const { subStates } = this.steps.reduce(
      (previousValue, currentValue) => {
        if (previousValue.destinationStepWasFound) {
          return previousValue;
        }

        previousValue.subStates.push(currentValue.stateName);

        if (currentValue.stateName === stepStateName) {
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

    const stateName = [this.baseStateName, ...subStates].join('.');
    return this.$state.go(stateName);
  }
}
