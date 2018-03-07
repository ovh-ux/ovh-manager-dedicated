angular.module("App").controller("CdnDeleteSslCtrl", ($scope, $stateParams, Cdn) => {
    "use strict";

    $scope.ssl = $scope.currentActionData;

    $scope.deleteSsl = function () {
        $scope.resetAction();
        Cdn.deleteSsl($stateParams.productId).then(
            () => {
                $scope.setMessage($scope.tr("cdn_configuration_delete_ssl_success"), true);
            },
            (data) => {
                $scope.setMessage($scope.tr("cdn_configuration_delete_ssl_fail", [$scope.ssl.name]), data);
            }
        );
    };
});
