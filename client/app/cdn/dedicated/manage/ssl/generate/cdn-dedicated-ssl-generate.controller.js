angular.module("App").controller("CdnGenerateSslCtrl", ($scope, $stateParams, $translate, Cdn, Alerter) => {
    "use strict";

    $scope.ssl = null;

    $scope.loadSsl = function () {
        $scope.loading = true;
        Cdn.getSsl($stateParams.productId)
            .then((ssl) => {
                $scope.ssl = ssl.status === null ? null : ssl;
            })
            .catch((error) => {
                error.message = error.message.replace(" : null", "");
                $scope.setMessage($translate.instant("cdn_configuration_add_ssl_get_error"), { type: "ERROR", message: error.message });
            })
            .finally(() => {
                $scope.loading = false;
            });
    };

    $scope.entry = {};

    $scope.addSsl = function () {
        $scope.resetAction();
        Cdn.addSsl($stateParams.productId, $scope.entry)
            .then(() => Alerter.success($translate.instant("cdn_configuration_generate_ssl_success"), "cdn_dedicated"))
            .catch((err) => Alerter.alertFromSWS($translate.instant("cdn_configuration_generate_ssl_fail"), err, "cdn_dedicated"));
    };

    $scope.loadSsl();
});
