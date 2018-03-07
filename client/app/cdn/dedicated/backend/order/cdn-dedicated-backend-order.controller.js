angular.module("App").controller("BackendsAddCtrl", ($scope, $stateParams, Cdn) => {
    "use strict";

    $scope.price = null;
    $scope.choices = {
        count: null,
        duration: null,
        order: null
    };
    $scope.contractsValidated = {};

    $scope.loadBackendPrice = () => {
        if (!$scope.price) {
            Cdn.getSelected()
                .then((cdn) => Cdn.getBackendPrice(cdn.serviceName))
                .then((price) => {
                    $scope.price = price;
                });
        }
    };

    $scope.loadBackendOrders = function () {
        Cdn.getBackendOrders($stateParams.productId, $scope.choices.count).then(
            (orders) => {
                let i = 0;
                for (i; i < orders.results.length; i++) {
                    orders.results[i].duration.formattedDuration = parseInt(orders.results[i].duration.duration, 10);
                }
                $scope.orders = orders.results;
            },
            (data) => {
                $scope.resetAction();
                $scope.setMessage($scope.tr("cdn_configuration_backend_upgrade_fail"), data);
            }
        );
    };

    $scope.updateOrder = function () {
        const choosenOrder = $.grep($scope.orders, (e) => e.duration.duration === $scope.choices.duration);
        if (choosenOrder.length > 0) {
            $scope.choices.order = choosenOrder[0];
        }
    };

    $scope.orderBackends = function () {
        $scope.url = null;
        Cdn.orderBackends($stateParams.productId, $scope.choices.count, $scope.choices.order.duration.duration).then(
            (order) => {
                $scope.url = order.url;
            },
            (data) => {
                $scope.resetAction();
                $scope.setMessage($scope.tr("cdn_configuration_backend_upgrade_fail"), data);
            }
        );
    };

    $scope.displayBC = function () {
        $scope.resetAction();
        window.open($scope.url, "_blank");
    };
});
