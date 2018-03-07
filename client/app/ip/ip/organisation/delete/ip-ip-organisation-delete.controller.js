angular.module("Module.ip.controllers").controller("IpOrganisationDeleteCtrl", ($scope, Ip, IpOrganisation, Alerter) => {
    $scope.alert = "ip_organisation_alerter";
    $scope.load = false;

    $scope.deleteOrganisation = function () {
        $scope.load = true;
        IpOrganisation.deleteOrganisation($scope.currentActionData).then(
            () => {
                Alerter.alertFromSWS($scope.i18n.ip_organisation_delete_success, true, $scope.alert);
                $scope.resetAction();
                $scope.load = false;
            },
            (reason) => {
                Alerter.alertFromSWS($scope.i18n.ip_organisation_delete_error, reason, $scope.alert);
                $scope.resetAction();
                $scope.load = false;
            }
        );
    };
});
