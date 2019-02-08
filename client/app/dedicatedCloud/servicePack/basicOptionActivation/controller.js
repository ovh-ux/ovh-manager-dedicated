/* @ngInject */
export default class DedicatedCloudServicePackBasicOptionActivationCtrl {
  constructor(
    $q,
    $translate,
    OvhApiOrder,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiOrder = OvhApiOrder;
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

    this.orderIsValid = true;
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

  placeOrder() {
    if (this.form.$invalid) {
      return this.$q.when();
    }

    this.orderIsInProgress = true;
    this.orderIsValid = true;

    return this.OvhApiOrder.Upgrade().PrivateCloud().V6()
      .upgrade({
        serviceName: `${this.currentService.serviceName}/servicepack`,
        planCode: `pcc-servicepack-${this.servicePackToOrder}`,
        quantity: 1,
      }).$promise
      .then(() => {
        this.orderIsSuccessful = true;
      })
      .catch((err) => {
        this.errorMessage = this.$translate.instant('dedicatedCloud_servicePack_basicOptionActivation_order_failure_message', { errorMessage: err.data.message });
        this.orderIsValid = false;
      })
      .finally(() => {
        this.orderIsInProgress = false;
      });
  }
}
