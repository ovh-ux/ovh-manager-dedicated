import _ from 'lodash';

/* @ngInject */
export default class DedicatedCloudServicePackCertificationActivationSmsActivation {
  constructor(
    $q,
    $state,
  ) {
    this.$q = $q;
    this.$state = $state;
  }

  $onInit() {
    this.usersWhoCanReceiveSMS = _
      .filter(
        this.usersWhoCanReceiveSMS,
        { isTokenValidator: true },
      )
      .map(user => ({
        userName: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.email,
        phoneNumber: user.phoneNumber,
      }));
  }

  mapUsersWhoCanReceiveSMS() {
    return this.$q.when({
      data: this.usersWhoCanReceiveSMS,
      meta: {
        totalCount: this.usersWhoCanReceiveSMS.length,
      },
    });
  }

  placeOrder() {
    this.orderIsInProgress = true;

    return this.OvhApiOrder.Upgrade().PrivateCloud().V6()
      .upgrade({
        serviceName: `${this.currentService.serviceName}/servicepack`,
        planCode: `pcc-servicepack-${this.servicePackToOrder.name}`,
        quantity: 1,
        autoPayWithPreferredPaymentMethod: this.hasDefaultMeansOfPayment,
      }).$promise
      .then(({ order }) => this.$state.go(
        'app.dedicatedClouds.servicePackCertificationActivation.summary',
        {
          orderURL: order.url,
        },
      ))
      .catch(error => this.$state.go('app.dedicatedClouds')
        .then(() => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('dedicatedCloud_servicePack_certificationActivation_order_error_message'),
            {
              message: error.data.message,
              type: 'ERROR',
            },
          );
        }));
  }
}
