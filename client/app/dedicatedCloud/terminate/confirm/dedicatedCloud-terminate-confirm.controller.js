angular.module('App').controller('DedicatedCloudConfirmTerminateCtrl', class DedicatedCloudConfirmTerminateCtrl {
  constructor($state, $stateParams, OvhApiDedicatedCloud, Alerter, $translate) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.Alerter = Alerter;
    this.$translate = $translate;

    this.terminateConfirmForm = null;
    this.reasons = ['LACK_OF_PERFORMANCES', 'TOO_EXPENSIVE', 'TOO_HARD_TO_USE', 'NOT_RELIABLE', 'NOT_NEEDED_ANYMORE', 'MIGRATED_TO_COMPETITOR', 'MIGRATED_TO_ANOTHER_OVH_PRODUCT', 'OTHER'];

    this.loading = {
      confirm: false,
    };

    this.model = {
      reason: _.first(this.reasons),
      commentary: null,
    };
  }

  /* =============================
    =            EVENTS            =
    ============================== */

  onModalDismiss() {
    this.$state.go('^');
  }

  onModalSecondaryBtnClick() {
    this.$state.go('^');
  }

  onTerminateConfirmFormSubmit() {
    if (!this.terminateConfirmForm.$valid) {
      return false;
    }

    this.loading.confirm = true;

    return this.OvhApiDedicatedCloud.v6().confirmTermination({
      serviceName: this.$stateParams.productId,
    }, {
      commentary: this.model.commentary,
      reason: this.model.reason,
      token: this.$stateParams.token,
    }).$promise.then(() => {
      this.Alerter.success(this.$translate.instant('dedicatedCloud_confirm_close_success'), 'dedicatedCloud_alert');
    }).catch((error) => {
      this.Alerter.alertFromSWS(this.$translate.instant('dedicatedCloud_confirm_close_error'), {
        message: _.get(error, 'message'),
        type: 'ERROR',
      }, 'dedicatedCloud_alert');
    }).finally(() => {
      this.loading.confirm = false;
      this.$state.go('^');
    });
  }

  /* -----  End of EVENTS  ------ */
});
