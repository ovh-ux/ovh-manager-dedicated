angular.module("Module.ip.controllers").controller("IpOrganisationCtrl", ($scope, Ip, IpOrganisation, Alerter) => {
    $scope.alert = "ip_organisation_alerter";
    $scope.loadingOrganisation = false;
    $scope.organisations = null;

    $scope.$on("ips.organisation.display", () => {
        $scope.organisations = null;
        loadOrganisations();
    });

    function loadOrganisations () {
        $scope.organisations = null;
        $scope.loadingOrganisation = true;
        IpOrganisation.getIpOrganisation()
            .then(
                (organisations) => {
                    $scope.organisations = organisations;
                },
                (data) => {
                    Alerter.alertFromSWS($scope.i18n.ip_organisation_load_error, data.data, $scope.alert);
                }
            )
            .finally(() => {
                $scope.loadingOrganisation = false;
            });
    }

    $scope.hideOrganisation = function () {
        $scope.$emit("ips.display", "table");
    };
});
