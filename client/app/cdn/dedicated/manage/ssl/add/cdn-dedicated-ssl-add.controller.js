angular.module("App").controller("CdnAddSslCtrl", ($scope, $stateParams, $translate, Cdn) => {
    "use strict";

    $scope.entry = {};

    $scope.addSsl = function () {
        $scope.resetAction();
        Cdn.addSsl($stateParams.productId, $scope.entry).then(
            () => {
                $scope.setMessage($translate.instant("cdn_configuration_add_ssl_success"), true);
            },
            (data) => {
                $scope.setMessage($translate.instant("cdn_configuration_add_ssl_fail"), data);
            }
        );
    };
});
