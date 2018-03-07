angular.module("Module.ip.controllers").controller("IplbOrderSslCtrl", [
    "$scope",
    "$rootScope",
    "Iplb",
    "Alerter",
    "Validator",

    function ($scope, $rootScope, Iplb, Alerter, Validator) {
        "use strict";

        $scope.data = $scope.currentActionData; // service
        $scope.model = {};
        $scope.agree = {};
        $scope.order = {};

        $scope.loading = {
            init: true
        };

        Iplb.isOptionOrderable($scope.data.value, "ssl").then((isOrderable) => {
            $scope.isOrderable = !!isOrderable;
            $scope.loading.init = false;
        });

        $scope.$watch("model.domain", () => {
            $scope.helptext = $scope.tr("iplb_ssl_order_helptext", `postmaster@${$scope.isValid() ? $scope.model.domain : $scope.tr("iplb_ssl_order_helptext_domain")}`);
        });

        $scope.isValid = function () {
            return $scope.model.domain && Validator.isValidDomain($scope.model.domain);
        };

        $scope.backToContracts = function () {
            if (!$scope.order.contracts || !$scope.order.contracts.length) {
                $rootScope.$broadcast("wizard-goToStep", 1);
            }
        };

        $scope.getResumePrice = function (price) {
            return price.value === 0 ? $scope.tr("price_free") : $scope.tr("price_ht_label", [price.text]);
        };

        $scope.getOrder = function () {
            $scope.agree.value = false;
            $scope.loading.contracts = true;
            Iplb.getOrderSsl($scope.data.value, $scope.model.domain).then(
                (order) => {
                    $scope.order = order;
                    if (!$scope.order.contracts || !$scope.order.contracts.length) {
                        $rootScope.$broadcast("wizard-goToStep", 4);
                    }
                    $scope.loading.contracts = false;
                },
                (data) => {
                    Alerter.alertFromSWS($scope.tr("iplb_ssl_order_failure"), data);
                    $scope.resetAction();
                }
            );
        };

        $scope.confirmOrder = function () {
            $scope.loading.validation = true;
            Iplb.postOrderSsl($scope.data.value, $scope.model.domain)
                .then(
                    (order) => {
                        Alerter.success($scope.tr("iplb_ssl_order_success", [order.url, order.orderId]));
                        window.open(order.url, "_blank");
                    },
                    (data) => {
                        Alerter.alertFromSWS($scope.tr("iplb_ssl_order_failure"), data);
                    }
                )
                .finally(() => {
                    $scope.resetAction();
                });
        };
    }
]);
