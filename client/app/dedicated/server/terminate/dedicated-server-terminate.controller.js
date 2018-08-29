angular.module('App').controller('ServerTerminateCtrl', class ServerTerminateCtrl {
  constructor($scope, $stateParams, constants, $q, Server, featureAvailability, Alerter) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.constants = constants;
    this.$q = $q;
    this.Server = Server;
    this.featureAvailability = featureAvailability;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.$scope.loading = false;
    this.$scope.server = this.$scope.currentActionData;
    this.manualRefund = this.featureAvailability.hasDedicatedServerManualRefund();
    this.serviceInfos = _.get(this.$scope, 'currentActionData.serviceInfos', null);
    this.cancelSubscriptionForm = {
      cancelMethod: null,
      isSubmiting: false,
    };
    this.$scope.submitCancelSubscription = this.submitCancelSubscription.bind(this);
  }

  /**
     * Submit cancel subscription form.
     * @return {Promise}
     */
  submitCancelSubscription() {
    const serviceInfosRenew = _.pick(this.serviceInfos, 'renew');

    let promise = this.$q.when(true);
    switch (this.cancelSubscriptionForm.cancelMethod) {
      case 'terminate':
        promise = this.Server.terminate(this.$stateParams.productId)
          .then(() => this.Alerter.success(this.$translate.instant('server_close_service_success'), 'server_dashboard_alert'))
          .catch((err) => {
            this.Alerter.alertFromSWS(this.$translate.instant('server_close_service_error'), err, 'server_dashboard_alert');
            return this.$q.reject(err);
          });
        break;
      case 'deleteAtExpiration':
        _.set(serviceInfosRenew, 'renew.automatic', false);
        _.set(serviceInfosRenew, 'renew.deleteAtExpiration', true);

        promise = this.Server.updateServiceInfos(this.$stateParams.productId, serviceInfosRenew)
          .then(() => this.Alerter.success(this.$translate.instant('server_close_service_delete_at_expiration_activate_success'), 'server_dashboard_alert'))
          .catch((err) => {
            this.Alerter.alertFromSWS(this.$translate.instant('server_close_service_delete_at_expiration_activate_error'), err, 'server_dashboard_alert');
            return this.$q.reject(err);
          });
        break;
      case 'cancel':
        _.set(serviceInfosRenew, 'renew.automatic', true);
        _.set(serviceInfosRenew, 'renew.deleteAtExpiration', false);

        promise = this.Server.updateServiceInfos(this.$stateParams.productId, serviceInfosRenew)
          .then(() => this.Alerter.success(this.$translate.instant('server_close_service_cancel_success'), 'server_dashboard_alert'))
          .catch((err) => {
            this.Alerter.alertFromSWS(this.$translate.instant('server_close_service_cancel_error'), err, 'server_dashboard_alert');
            return this.$q.reject(err);
          });
        break;
      default:
        break;
    }

    this.cancelSubscriptionForm.isSubmiting = true;
    return promise.finally(() => {
      this.cancelSubscriptionForm.isSubmiting = false;
      this.resetAction();
    });
  }

  resetAction() {
    this.$scope.resetAction();
  }
});
