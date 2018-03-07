angular.module("Module.ip.controllers").controller("IpMoveIpBlockCtrl", [
    "$scope",
    "$rootScope",
    "$q",
    "Ip",
    "Alerter",

    function ($scope, $rootScope, $q, Ip, Alerter) {
        "use strict";

        $scope.data = $scope.currentActionData;
        $scope.model = { serviceName: null, nexthop: null };
        $scope.noTasksPending = false;
        $scope.ipCanBeMovedTo = false;
        $scope.ipCanBeMovedToError = "";

        $scope.loading = {
            init: true,
            ipCanBeMovedTo: true,
            save: false
        };

        function init () {
            const queue = [];
            queue.push(
                Ip.checkTaskUnique($scope.data.ipBlock.ipBlock, "genericMoveFloatingIp").then((tasks) => {
                    $scope.noTasksPending = !(tasks && tasks.length);
                })
            );
            queue.push(
                Ip.getIpMove($scope.data.ipBlock.ipBlock).then((result) => {
                    $scope.ipDestinations = result;
                    $scope.ipDestinations.push({ service: $scope.tr("ip_servicetype__PARK"), serviceType: "_PARK", nexthop: [] });
                })
            );
            return $q.all(queue).finally(() => {
                $scope.loading.init = false;
            });
        }

        $scope.checkIfIpCanBeMovedTo = function () {
            if ($scope.model.serviceName !== "_PARK") {
                $scope.ipCanBeMovedToError = "";
                $scope.loading.ipCanBeMovedTo = true;
                Ip.checkIfIpCanBeMovedTo($scope.model.serviceName, $scope.data.ipBlock.ipBlock)
                    .then(
                        () => {
                            $scope.ipCanBeMovedTo = true;
                        },
                        (data) => {
                            if (data && data.message) {
                                $scope.ipCanBeMovedToError = data.message;
                            }
                            $scope.ipCanBeMovedTo = false;
                        }
                    )
                    .finally(() => {
                        $scope.loading.ipCanBeMovedTo = false;
                    });
            } else {
                $scope.ipCanBeMovedTo = true;
                $scope.loading.ipCanBeMovedTo = false;
            }
        };

        $scope.moveIpBlock = function () {
            $scope.loading.save = true;
            if ($scope.model.serviceName.serviceType === "_PARK") {
                Ip.moveIpBlockToPark($scope.data.ipBlock.ipBlock)
                    .then(
                        () => {
                            Alerter.success($scope.tr("ip_table_manage_move_ipblock_success", [$scope.data.ipBlock.ipBlock, $scope.i18n[`ip_service${$scope.model.serviceName.service}`] || $scope.model.serviceName.service]));
                        },
                        (reason) => {
                            Alerter.alertFromSWS($scope.tr("ip_table_manage_move_ipblock_failure", [$scope.data.ipBlock.ipBlock, $scope.i18n[`ip_service${$scope.model.serviceName.service}`] || $scope.model.serviceName.service]), reason);
                        }
                    )
                    .finally(() => {
                        $scope.resetAction();
                    });
            } else {
                Ip.moveIpBlock($scope.model.serviceName.service, $scope.data.ipBlock.ipBlock, $scope.model.nexthop)
                    .then(
                        () => {
                            Alerter.success($scope.tr("ip_table_manage_move_ipblock_success", [$scope.data.ipBlock.ipBlock, $scope.model.serviceName.service]));
                        },
                        (reason) => {
                            Alerter.alertFromSWS($scope.tr("ip_table_manage_move_ipblock_failure", [$scope.data.ipBlock.ipBlock, $scope.model.serviceName.service]), reason);
                        }
                    )
                    .finally(() => {
                        $scope.resetAction();
                    });
            }
        };

        $scope.canMove = () => {
            const serviceNameChoosed = $scope.model.serviceName && $scope.model.serviceName.service && $scope.noTasksPending;
            const nextHopSelectedPCC = () => $scope.model.serviceName.serviceType === "dedicatedCloud" && $scope.model.nexthop;
            const nextHopSelectedOther = () => $scope.model.serviceName.serviceType !== "dedicatedCloud";

            return serviceNameChoosed && (nextHopSelectedPCC() || nextHopSelectedOther()); // ((!$scope.model.serviceName.nexthop.length && !$scope.model.nexthop && $scope.model.serviceName.serviceType !== 'dedicatedCloud'));
        };

        init();
    }
]);
