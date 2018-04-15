angular.module("Module.license").controller("LicenseSplaAddCtrl", ($scope, $translate, License, Alerter) => {
    "use strict";

    $scope.model = {
        options: {
            availableServers: null,
            availableTypes: null
        },
        selected: {
            serial: null,
            type: null,
            server: null
        }
    };

    $scope.load = () => {
        License.splaAddAvailableServers().then(
            (data) => {
                $scope.model.options = data;
            },
            (data) => {
                $scope.resetAction();
                Alerter.alertFromSWS($translate.instant("license_spla_add_step1_loading_error"), data.data);
            }
        );
    };

    $scope.addSpla = () => {
        $scope.resetAction();
        License.splaAdd($scope.model.selected.server, { serialNumber: $scope.model.selected.serial, type: $scope.model.selected.type }).then(
            () => {
                Alerter.alertFromSWS($translate.instant("license_spla_add_success"), true);
            },
            (data) => {
                Alerter.alertFromSWS($translate.instant("license_spla_add_fail"), data.data);
            }
        );
    };

    $scope.loadTypes = () => {
        $scope.model.options.availableTypes = null;
        $scope.model.selected.type = null;
        License.splaAddAvailableTypes($scope.model.selected.server).then(
            (data) => {
                angular.extend($scope.model.options, data);
            },
            (data) => {
                $scope.resetAction();
                Alerter.alertFromSWS($translate.instant("license_spla_add_step1_loading_error"), data.data);
            }
        );
    };
});
