angular.module("App").controller("CdnUpdateSslCtrl", ($scope, $translate, Cdn, $stateParams) => {
    $scope.entry = {};

    $scope.updateSsl = function () {
        $scope.resetAction();
        Cdn.updateSsl($stateParams.productId, $scope.entry).then(
            () => {
                $scope.setMessage($translate.instant("cdn_configuration_update_ssl_success"), true);
            },
            (data) => {
                $scope.setMessage($translate.instant("cdn_configuration_update_ssl_fail"), data);
            }
        );
    };
});
