angular.module('Module.license').controller('LicenseRedirectionUpgradeCtrl', class LicenseRedirectionUpgradeCtrl {
  constructor($scope, $state, $timeout) {
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
  }

  $onInit() {
    this.licenseId = this.$scope.currentActionData.licenseId;
    this.$scope.redirectToUpgrade = this.redirectToUpgrade.bind(this);
  }

  redirectToUpgrade() {
    this.$scope.resetAction();
    this.$timeout(() => {
      this.$state.go('app.license.upgrade', {
        licenseId: this.licenseId,
      });
    }, 300);
  }
});
