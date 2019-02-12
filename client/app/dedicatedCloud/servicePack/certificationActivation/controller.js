/* @ngInject */
export default class DedicatedCloudServicePackCertificationActivation {
  constructor(
    $transitions,
  ) {
    this.$transitions = $transitions;
  }

  $onInit() {
    this.steps = [
      {
        stateName: 'app.dedicatedClouds.servicePackCertificationActivation.selection',
        displayName: 'Choix du type de certification',
        isActive: true,
      },
      {
        stateName: 'app.dedicatedClouds.servicePackCertificationActivation.requiredConfiguration',
        displayName: 'Configuration requise',
      },
      {
        stateName: 'app.dedicatedClouds.servicePackCertificationActivation.smsActivation',
        displayName: 'Activation par SMS',
      },
      {
        stateName: 'app.dedicatedClouds.servicePackCertificationActivation.validation',
        displayName: 'Validation de la certification',
      },
    ];

    this.$transitions.onStart(
      {},
      () => {
        this.transitionIsInProgress = true;
      },
    );

    this.$transitions.onSuccess(
      {},
      (transition) => {
        this.changeActiveStep(transition.to().name);
        this.transitionIsInProgress = false;
      },
    );
  }

  changeActiveStep(stepStateName) {
    let activeStepWasFound = false;

    this.steps = this.steps.map((step) => {
      const isActive = step.stateName === stepStateName;

      if (isActive) {
        activeStepWasFound = true;
      }

      const isComplete = !activeStepWasFound && step.stateName !== stepStateName;

      return {
        ...step,
        isActive,
        isComplete,
      };
    });
  }
}
