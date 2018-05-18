angular.module("App").controller("CdnDeleteSslCtrl", ($scope, $stateParams, $translate, Cdn) => {
    "use strict";

    $scope.ssl = $scope.currentActionData;

    $scope.deleteSsl = function () {
        $scope.resetAction();
        Cdn.deleteSsl($stateParams.productId).then(
            () => {
                $scope.setMessage($translate.instant("cdn_configuration_delete_ssl_success"), true);
            },
            (data) => {
                $scope.setMessage($translate.instant("cdn_configuration_delete_ssl_fail", { t0: $scope.ssl.name }), data);
            }
        );
    };
});
