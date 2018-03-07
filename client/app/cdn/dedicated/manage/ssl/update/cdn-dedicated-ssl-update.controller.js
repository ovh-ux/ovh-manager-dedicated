angular.module("App").controller("CdnUpdateSslCtrl", [
    "$scope",
    "Cdn",
    "$stateParams",
    function ($scope, Cdn, $stateParams) {
        "use strict";

        $scope.entry = {};

        $scope.updateSsl = function () {
            $scope.resetAction();
            Cdn.updateSsl($stateParams.productId, $scope.entry).then(
                () => {
                    $scope.setMessage($scope.tr("cdn_configuration_update_ssl_success"), true);
                },
                (data) => {
                    $scope.setMessage($scope.tr("cdn_configuration_update_ssl_fail"), data);
                }
            );
        };
    }
]);
