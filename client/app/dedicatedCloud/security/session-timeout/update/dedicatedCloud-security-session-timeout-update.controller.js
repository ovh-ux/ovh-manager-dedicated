class DedicatedCloudSecurityUpdateSessionTimeoutCtrl {
  constructor($scope, $stateParams, DedicatedCloud, $translate) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.DedicatedCloud = DedicatedCloud;
    this.$translate = $translate;

    this.sessionTimeout = {
      value: null,
      current: $scope.currentActionData,
      never: false,
    };

    $scope.updateSessionTimeout = this.updateSessionTimeout.bind(this);
  }

  updateSessionTimeout() {
    this.$scope.resetAction();
    this.DedicatedCloud.updateSessionExpiration(this.$stateParams.productId, (this.sessionTimeout.never && '0') || this.sessionTimeout.value)
      .then((data) => {
        this.$scope.setMessage(
          this.$translate.instant('dedicatedCloud_configuration_SECURITY_update_session_timeout_success'),
          _.assign(
            {
              type: 'success',
            },
            data,
          ),
        );
      })
      .catch((err) => {
        this.$scope.setMessage(this.$translate.instant('dedicatedCloud_configuration_SECURITY_update_session_timeout_fail'), err.data);
      });
  }
}

angular.module('App').controller('DedicatedCloudSecurityUpdateSessionTimeoutCtrl', DedicatedCloudSecurityUpdateSessionTimeoutCtrl);
