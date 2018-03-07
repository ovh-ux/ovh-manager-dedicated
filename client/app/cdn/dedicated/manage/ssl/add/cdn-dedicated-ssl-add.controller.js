angular.module("App").controller("CdnAddSslCtrl", ($scope, $stateParams, Cdn) => {
    "use strict";

    $scope.entry = {};

    $scope.addSsl = function () {
        $scope.resetAction();
        Cdn.addSsl($stateParams.productId, $scope.entry).then(
            () => {
                $scope.setMessage($scope.tr("cdn_configuration_add_ssl_success"), true);
            },
            (data) => {
                $scope.setMessage($scope.tr("cdn_configuration_add_ssl_fail"), data);
            }
        );
    };
});
