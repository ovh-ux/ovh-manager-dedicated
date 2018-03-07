angular.module("Module.ip.controllers").controller("IpOrganisationChangeCtrl", ($scope, Ip, IpOrganisation, Alerter) => {
    const currentOrganisationId = $scope.currentActionData.ipBlock.organizationId;
    $scope.alert = "polling_action";
    $scope.loader = false;
    $scope.ipBlock = $scope.currentActionData.ipBlock.ipBlock;
    $scope.organisationSelected = {
        value: {}
    };

    $scope.load = function () {
        $scope.loader = true;

        IpOrganisation.getIpOrganisation()
            .then((organisations) => {
                $scope.organisationList = _.reject(organisations, { organisationId: currentOrganisationId });
                $scope.organisationSelected.value = $scope.organisationList[0];
            })
            .finally(() => {
                $scope.loader = false;
            });
    };

    $scope.changeOrganisation = function () {
        $scope.loader = true;

        IpOrganisation.changeOrganisation({
            ipBlock: $scope.ipBlock,
            organisationId: $scope.organisationSelected.value.organisationId
        })
            .then(
                () => {
                    Alerter.alertFromSWS($scope.tr("ip_organisation_change_organisations_success"));
                },
                (err) => {
                    Alerter.alertFromSWS($scope.tr("ip_organisation_change_organisations_fail", [err.message]));
                }
            )
            .finally(() => {
                $scope.loader = false;
                $scope.resetAction();
            });
    };
});
