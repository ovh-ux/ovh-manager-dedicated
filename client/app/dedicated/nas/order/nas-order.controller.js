angular.module("App").controller("NasOrderCtrl", [
    "$scope",
    "Nas",
    "$timeout",
    "$filter",
    "Alerter",
    "constants",
    function ($scope, Nas, $timeout, $filter, Alerter, constants) {
        "use strict";

        $scope.nasOrder = {
            model: null,
            loading: false,
            nasSelectedIndex: null,
            nashaSelectedIndex: null,
            nasSelected: null,
            nashaSelected: null,
            duration: null,
            durationSelected: null,
            datacenterSelected: null
        };

        $scope.redirectToCloud = `${constants.nashaUrl}/new`;

        $scope.resetAction = function () {
            $scope.setAction(false);
        };

        $scope.setAction = function (action, data) {
            if (action) {
                $scope.currentAction = action;
                $scope.currentActionData = data;

                $scope.stepPath = $scope.currentAction;

                $("#currentAction").modal({
                    keyboard: true,
                    backdrop: "static"
                });
            } else {
                $("#currentAction").modal("hide");
                $scope.currentActionData = null;
                $timeout(() => {
                    $scope.stepPath = "";
                }, 300);
            }
        };

        $scope.load = function () {
            $scope.nasOrder.loading = true;
            Nas.getOrderList().then(
                (nasOrder) => {
                    $scope.nasOrder.model = nasOrder;
                    $scope.nasOrder.datacenterSelected = nasOrder.defaultZone;
                    $scope.nasOrder.model.nasOrderModel = $filter("orderBy")(nasOrder.nasOrderModel, "priceValue");
                    $scope.nasOrder.model.nashaOrderModel = $filter("orderBy")(nasOrder.nashaOrderModel, "priceValue");

                    $scope.nasOrder.loading = false;
                },
                (data) => {
                    $scope.nasOrder.loading = false;
                    Alerter.alertFromSWS($scope.tr("nas_order_loading_error"), data);
                }
            );
        };

        $scope.selectNas = function (nas, index) {
            $scope.nasOrder.nashaSelectedIndex = null;
            $scope.nasOrder.nashaSelected = null;
            if (index != null) {
                $scope.nasOrder.nasSelectedIndex = index;
            }
            if (nas != null) {
                $scope.nasOrder.duration = nas.durations;
                $scope.nasOrder.nasSelected = nas;

                if (!_.contains(nas.durations, $scope.nasOrder.durationSelected)) {
                    $scope.nasOrder.durationSelected = null;
                }
            } else {
                $scope.nasOrder.duration = null;
                $scope.nasOrder.nasSelected = null;
            }
            return true;
        };

        $scope.selectNasha = function (nas, index) {
            $scope.nasOrder.nasSelectedIndex = null;
            $scope.nasOrder.nasSelected = null;
            if (index != null) {
                $scope.nasOrder.nashaSelectedIndex = index;
            }

            if (nas != null) {
                $scope.nasOrder.duration = nas.durations;
                $scope.nasOrder.nashaSelected = nas;

                if (!_.contains(nas.durations, $scope.nasOrder.durationSelected)) {
                    $scope.nasOrder.durationSelected = null;
                }
            } else {
                $scope.nasOrder.duration = null;
                $scope.nasOrder.nashaSelected = null;
            }
            return true;
        };

        $scope.getInfoOrder = function () {
            if ($scope.nasOrder.nashaSelectedIndex != null) {
                return {
                    nasha: true,
                    model: $scope.nasOrder.nashaSelected.model,
                    datacenter: $scope.nasOrder.nashaSelected.datacenter,
                    duration: $scope.nasOrder.durationSelected
                };
            } else if ($scope.nasOrder.nasSelectedIndex != null) {
                return {
                    nasha: false,
                    model: $scope.nasOrder.nasSelected.model,
                    protocol: $scope.nasOrder.nasSelected.protocol,
                    duration: $scope.nasOrder.durationSelected
                };
            }
            return null;
        };

        $scope.$on("nas.order.init", () => {
            $scope.nasOrder.nasSelectedIndex = null;
            $scope.nasOrder.nashaSelectedIndex = null;
            $scope.nasOrder.durationSelected = null;
        });

        $scope.load();
    }
]);
