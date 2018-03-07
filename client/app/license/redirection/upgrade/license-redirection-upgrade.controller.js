angular.module("Module.license.controllers").controller("ConfirmUpgradeRedirectionCtrl", [
    "$location",
    "$scope",
    "$timeout",
    function ($location, $scope, $timeout) {
        "use strict";

        const licenseId = $scope.currentActionData.licenseId;

        $scope.redirectToUpgrade = function () {
            $scope.resetAction();
            $timeout(() => {
                $location.path(`/configuration/license/upgrade/${licenseId}`);
            }, 300);
        };
    }
]);
