angular
  .module('App')
  .controller('DedicatedCloudUserDisableCtrl', class {
    constructor(
      $scope,
      $stateParams,
      $translate,
      DedicatedCloud,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.DedicatedCloud = DedicatedCloud;
    }

    $onInit() {
      this.$scope.user = this.$scope.currentActionData;

      this.$scope.disableUser = () => this.disableUser();
    }

    disableUser() {
      this.$scope.resetAction();

      this.DedicatedCloud.disableUser(this.$stateParams.productId, this.$scope.user.userId).then(
        () => {
          this.$scope.setMessage(this.$translate.instant('dedicatedCloud_USER_disable_success', { t0: this.$scope.user.name }));
        },
        (err) => {
          this.$scope.setMessage(this.$translate.instant('dedicatedCloud_USER_disable_fail', { t0: this.$scope.user.name }), err.data);
        },
      );
    }
  });
