angular
  .module('App')
  .controller('DedicatedCloudSecurityPolicyAddCtrl', class {
    constructor(
      $scope,
      $stateParams,
      DedicatedCloud,
      $translate,
      REGEX,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.DedicatedCloud = DedicatedCloud;
      this.$translate = $translate;
      this.REGEX = REGEX;
    }

    $onInit() {
      this.$scope.regex = this.REGEX;
      this.$scope.newNetwork = {
        value: null,
      };
      this.$scope.addEntry = () => this.addEntry();
    }

    addEntry() {
      this.$scope.resetAction();

      this.DedicatedCloud.addSecurityPolicy(this.$stateParams.productId, this.$scope.newNetwork)
        .then(
          (data) => {
            this.$scope.setMessage(this.$translate.instant('dedicatedCloud_configuration_SECURITY_policy_add_success'), data);
          },
          (data) => {
            this.$scope.setMessage(this.$translate.instant('dedicatedCloud_configuration_SECURITY_policy_add_fail', [this.$scope.newNetwork.value]), data.data);
          },
        );
    }
  });
