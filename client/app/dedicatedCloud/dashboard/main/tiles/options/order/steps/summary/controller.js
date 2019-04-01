import { PACK_ACTIVATION_PREFERENCE_KEY } from './constants';

export default class DedicatedCloudservicePackSmsActivation {
  /* @ngInject */
  constructor(
    $q,
    $state,
    OvhApiOrder,
    ACTIVATION_STATUS,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.OvhApiOrder = OvhApiOrder;
    this.ACTIVATION_STATUS = ACTIVATION_STATUS;
  }

  $onInit() {
    this.currentService = this.stepper.memorizedStateParams.currentService;
    this.servicePackToOrder = this.stepper.memorizedStateParams.servicePackToOrder;

    if (this.servicePackToOrder == null) {
      return this.stepper.exit();
    }

    return this.placeOrder();
  }

  placeOrder() {
    this.orderIsInProgress = true;

    return this.OvhApiOrder.Upgrade().PrivateCloud().v6()
      .post({
        serviceName: `${this.currentService.name}/servicepack`,
        planCode: `pcc-servicepack-${this.servicePackToOrder.name}`,
        quantity: 1,
        autoPayWithPreferredPaymentMethod: this.hasDefaultMeansOfPayment,
      }).$promise
      .then(({ order }) => {
        this.orderURL = order.url;

        return this.servicePackService
          .savePendingOrder(this.currentService.name, {
            activationType: this.activationType,
            id: order.orderId,
            url: order.url,
            orderedServicePackName: this.servicePackToOrder.name,
          })
          .then(() => this.ovhUserPref.assign(PACK_ACTIVATION_PREFERENCE_KEY, {
            certification: {
              orderUrl: order.url,
              status: this.ACTIVATION_STATUS.pendingActivation,
            },
          }));
      })
      .catch(error => this.stepper
        .exit()
        .then(() => this.Alerter.alertFromSWS(this.$translate.instant('dedicatedCloud_servicePack_summary_stepper_order_failed'), {
          message: error.data.message,
          type: 'ERROR',
        }, 'dedicatedCloud_alert')))
      .finally(() => {
        this.orderIsInProgress = false;
      });
  }
}
