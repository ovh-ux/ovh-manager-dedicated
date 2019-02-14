/* @ngInject */
export default class DedicatedCloudServicePackBasicOptionActivationCtrl {
  constructor(
    $q,
    $transitions,
    $translate,
    OvhApiOrder,
  ) {
    this.$q = $q;
    this.$transitions = $transitions;
    this.$translate = $translate;
    this.OvhApiOrder = OvhApiOrder;
  }

  $onInit() {
    this.steps = [
      {
        stateName: 'app.dedicatedClouds.servicePackBasicOptionActivation.selection',
        displayName: 'Choix du type d\'options',
        isActive: true,
      },
      {
        stateName: 'app.dedicatedClouds.servicePackBasicOptionActivation.confirmation',
        displayName: 'Confirmation',
      },
      {
        stateName: 'app.dedicatedClouds.servicePackBasicOptionActivation.summary',
        displayName: 'Résumé',
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
        console.log(transition.$id);
        console.log(transition.$to());
        console.log(transition.entering());
        console.log(transition.error());
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
