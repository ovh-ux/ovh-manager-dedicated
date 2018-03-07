angular.module("Module.license.controllers").controller("Module.license.controllers.deleteAtExpirationCtrl", ($scope, $rootScope, License, Alerter) => {
    $scope.license = $scope.currentActionData.license;

    /**
     * Toggle delete at expiration serviceInfos.
     * @return {Promise}
     */
    $scope.toggleDeleteAtExpiration = () => License.deleteLicenseAtExpiration($scope.license)
        .then(() => {
            Alerter.alertFromSWS($scope.tr("license_details_update_success"));
            $rootScope.$broadcast("License.Details.Refresh");
        })
        .catch((err) => Alerter.alertFromSWS($scope.tr("license_details_update_fail"), err))
        .finally(() => {
            $scope.resetAction();
        });
});
