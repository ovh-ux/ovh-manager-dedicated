// --------------ENABLE BACKUP------------------

angular.module("App").controller("HousingActivateFtpBackupCtrl", ($scope, $stateParams, Housing, Alerter) => {
    const alert = "housing_tab_ftpbackup_alert";

    $scope.loading = false;

    $scope.activateFtpBackup = function () {
        $scope.loading = true;

        Housing.activateFtpBackup($stateParams.productId)
            .then(
                () => {
                    Alerter.success($scope.tr("housing_configuration_ftpbackup_activate_success"), alert);
                },
                (data) => {
                    Alerter.alertFromSWS($scope.tr("housing_configuration_ftpbackup_activate_failure"), data, alert);
                }
            )
            .finally(() => {
                $scope.resetAction();
            });
    };
});
