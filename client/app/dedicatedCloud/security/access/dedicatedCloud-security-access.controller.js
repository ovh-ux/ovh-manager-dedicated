class DedicatedCloudSecurityPolicyAccessCtrl {
  constructor($scope, $stateParams, DedicatedCloud, $translate) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.DedicatedCloud = DedicatedCloud;
    this.$translate = $translate;

    this.selectedAccessPolicy = {
      policies: [],
      value: null,
    };

    this.initAvailablePolicies();

    $scope.modifyPolicyAccess = this.modifyPolicyAccess.bind(this);
  }

  initAvailablePolicies() {
    this.selectedAccessPolicy.policies = angular.copy(
      this.$scope.dedicatedCloud.userAccessPolicyEnum,
    );
    if (this.$scope.dedicatedCloud.capabilities.userAccessPolicyStatus !== 'ACTIVE') {
      this.selectedAccessPolicy.policies = _.difference(
        this.selectedAccessPolicy.policies,
        ['FILTERED'],
      );
    }
  }

  modifyPolicyAccess() {
    this.$scope.resetAction();
    this.DedicatedCloud
      .modifyPolicyAccess(this.$stateParams.productId, this.selectedAccessPolicy.value)
      .then((data) => {
        this.$scope.setMessage(
          this.$translate.instant('dedicatedCloud_configuration_SECURITY_policy_access_success'),
          _.assign(
            {
              type: 'success',
            },
            data,
          ),
        );
      })
      .catch((err) => {
        this.$scope.setMessage(this.$translate.instant('dedicatedCloud_configuration_SECURITY_policy_access_fail'), err.data);
      });
  }
}

angular.module('App').controller('DedicatedCloudSecurityPolicyAccessCtrl', DedicatedCloudSecurityPolicyAccessCtrl);
