angular.module("App").controller("NasOrderValidationCtrl", [
    "$scope",
    "Nas",
    "$rootScope",
    "Alerter",

    function ($scope, Nas, $rootScope, Alerter) {
        "use strict";

        $scope.choice = $scope.currentActionData;
        $scope.bc = {
            model: null,
            loading: false,
            agreeContract: false
        };

        $scope.load = function () {
            $scope.bc.loading = true;
            if ($scope.choice.nasha) {
                Nas.getBCNasha($scope.choice.model, $scope.choice.datacenter, $scope.choice.duration).then(getNasSuccess, getNasFail);
            } else {
                Nas.getBCNas($scope.choice.model, $scope.choice.protocol, $scope.choice.duration).then(getNasSuccess, getNasFail);
            }
        };

        function getNasSuccess (bc) {
            $scope.bc.loading = false;
            $scope.bc.model = bc;
        }

        function getNasFail (data) {
            $scope.bc.loading = false;
            $scope.resetAction();
            Alerter.alertFromSWS($scope.tr("nas_order_bc_loading_error"), data);
        }

        $scope.orderNas = function () {
            $scope.bc.loading = true;
            if ($scope.choice.nasha) {
                Nas.postBCNasha($scope.choice.model, $scope.choice.datacenter, $scope.choice.duration).then(postNasSuccess, postNasFail);
            } else {
                Nas.postBCNas($scope.choice.model, $scope.choice.protocol, $scope.choice.duration).then(postNasSuccess, postNasFail);
            }
        };

        function postNasSuccess (bc) {
            $scope.bc.loading = false;
            window.open(bc.url, "_blank");
            $rootScope.$broadcast("nas.order.init");
            $scope.resetAction();
            Alerter.success($scope.tr("nas_order_bc_finish_success", [bc.url, bc.orderId]));
        }

        function postNasFail (data) {
            $scope.bc.loading = false;
            $scope.resetAction();
            Alerter.alertFromSWS($scope.tr("nas_order_bc_finish_fail"), data);
        }
    }
]);
