// --------------DELETE ACCESS------------------

angular.module("App").controller("HousingDeleteAccessFtpBackupCtrl", ($rootScope, $scope, $stateParams, Housing, Alerter) => {
    "use strict";

    const alert = "housing_tab_ftpbackup_alert";

    $scope.access = $scope.currentActionData.ipBlock;
    $scope.loading = false;

    $scope.deleteAccessFtpBackup = function () {
        $scope.loading = true;

        Housing.deleteFtpBackupIp($stateParams.productId, $scope.access)
            .then(
                () => {
                    Alerter.success($scope.tr("housing_configuration_ftpbackup_access_delete_success", $scope.access), alert);
                },
                (data) => {
                    Alerter.alertFromSWS($scope.tr("housing_configuration_ftpbackup_access_delete_failure", $scope.access), data, alert);
                }
            )
            .finally(() => {
                $scope.resetAction();
            });
    };
});
