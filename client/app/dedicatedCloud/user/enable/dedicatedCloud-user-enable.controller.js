angular
  .module('App')
  .controller('DedicatedCloudUserEnableCtrl', class {
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

      this.enableUser = () => this.enableUser();
    }

    enableUser() {
      this.DedicatedCloud.enableUser(this.$stateParams.productId, this.$scope.user.userId)
        .then(
          () => {
          // Start Polling
          },
          (err) => {
            this.$scope.setMessage(this.$translate.instant('dedicatedCloud_USER_enable_fail', { t0: this.$scope.user.name }), { message: err.data, type: 'ERROR' });
          },
        )
        .finally(() => {
          this.$scope.resetAction();
        });
    }
  });
