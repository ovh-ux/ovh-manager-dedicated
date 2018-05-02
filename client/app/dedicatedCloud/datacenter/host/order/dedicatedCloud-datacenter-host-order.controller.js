angular.module("App").controller("DedicatedCloudDatacentersOrderHostsCtrl", ($scope, $stateParams, DedicatedCloud, $translate) => {
    "use strict";

    $scope.orderHosts = {
        datacenter: null,
        model: null,
        selected: null,
        selectedModel: null,
        quantityToOrder: 1,
        orderResult: null,
        agreeContract: null,
        loading: false
    };
    $scope.showDiscount = false;
    $scope.dedicatedCloud = null;

    $scope.loadHostsProfiles = function () {
        $scope.orderHosts.loading = true;
        $scope.orderHosts.datacenter = $scope.currentActionData;

        DedicatedCloud.getSelected($stateParams.productId, false)
            .then(
                (dedicatedCloud) => {
                    $scope.dedicatedCloud = dedicatedCloud;
                    return DedicatedCloud.getOrderableHostsProfiles($stateParams.productId, $scope.dedicatedCloud.location, $scope.orderHosts.datacenter.id).then(
                        (data) => {
                            $scope.orderHosts.model = data;
                        },
                        (data) => {
                            $scope.resetAction();
                            $scope.setMessage($translate.instant("dedicatedCloud_configuration_order_hosts_finish_fail", {
                                t0: $scope.orderHosts.datacenter.name
                            }), angular.extend(data, { type: "ERROR" }));
                        }
                    );
                },
                (data) => {
                    $scope.setMessage($translate.instant("dedicatedCloud_configuration_order_hosts_finish_fail"), angular.extend(data, { type: "ERROR" }));
                }
            )
            .finally(() => {
                $scope.orderHosts.loading = false;
            });
    };

    $scope.hasDiscount = function (/* profile*/) {
        /* if (profile &&
                DedicatedCloud.hasDiscount($scope.orderHosts.datacenter) &&
            //(profile.name === "XL" || profile.name === "XL+")) {
            //$scope.showDiscount = true;
            //return "-85%";
        }*/
        return false;
    };

    $scope.$watch("orderHosts.quantityToOrder", () => {
        if ($scope.orderHosts.quantityToOrder && !isNaN($scope.orderHosts.quantityToOrder)) {
            if ($scope.orderHosts.quantityToOrder < 1) {
                $scope.orderHosts.quantityToOrder = 1;
            } else if ($scope.orderHosts.quantityToOrder > 20) {
                $scope.orderHosts.quantityToOrder = 20;
            }
        } else {
            $scope.orderHosts.quantityToOrder = 1;
        }
    });

    $scope.getHostSelected = function () {
        $scope.orderHosts.loading = true;
        $scope.orderHosts.selectedModel = $scope.orderHosts.model[$scope.orderHosts.selected];

        DedicatedCloud.getMonthlyHostOrder($stateParams.productId, $scope.orderHosts.datacenter.id, $scope.orderHosts.selectedModel.name, $scope.orderHosts.quantityToOrder)
            .then(
                (data) => {
                    $scope.orderHosts.orderResult = data;
                },
                (data) => {
                    $scope.resetAction();
                    $scope.setMessage($translate.instant("dedicatedCloud_configuration_order_hosts_finish_fail", {
                        t0: $scope.orderHosts.datacenter.name
                    }), angular.extend(data, { type: "ERROR" }));
                }
            )
            .finally(() => {
                $scope.orderHosts.loading = false;
            });
    };

    $scope.displayBC = function () {
        $scope.orderHosts.loading = true;

        DedicatedCloud.orderHosts($stateParams.productId, $scope.orderHosts.datacenter.id, $scope.orderHosts.selectedModel.name, $scope.orderHosts.quantityToOrder)
            .then(
                (data) => {
                    window.open(data.url, "_blank");
                    $scope.setMessage($translate.instant("dedicatedCloud_configuration_order_hosts_finish_success", {
                        t0: data.url,
                        t1: data.orderId
                    }), "true");
                },
                (data) => {
                    $scope.setMessage($translate.instant("dedicatedCloud_configuration_order_hosts_finish_fail", {
                        t0: $scope.orderHosts.datacenter.name
                    }), angular.extend(data, { type: "ERROR" }));
                }
            )
            .finally(() => {
                $scope.resetAction();
                $scope.orderHosts.loading = false;
            });
    };
});

angular.module("App").controller("DedicatedCloudHostToMonthlyCtrl", ($stateParams, $rootScope, $scope, $q, $window, $translate, DedicatedCloud, Alerter, User) => {
    "use strict";

    const resourceId = $scope.currentActionData ? $scope.currentActionData.id : null;
    const resourceType = $scope.currentActionData ? $scope.currentActionData.type : null;
    const upgradeType = $scope.currentActionData ? $scope.currentActionData.upgradeType : null;

    $scope.ovhSubsidiary = User.getUser().then((user) => user.ovhSubsidiary);

    $scope.model = {
        capacity: null,
        duration: null
    };
    $scope.loading = {
        durations: null
    };

    $scope.agree = {
        value: false
    };

    /*= =============================
        =            STEP 1            =
        ==============================*/

    $scope.getDurations = function () {
        $scope.durations = {
            available: null,
            details: {}
        };
        $scope.loading.durations = true;

        DedicatedCloud.getUpgradeResourceDurations($stateParams.productId, upgradeType, resourceType, resourceId).then((durations) => {
            $scope.loading.durations = false;
            $scope.durations.available = durations;
            loadPrices(durations);
        });
    };

    function loadPrices (durations) {
        const queue = [];
        $scope.loading.prices = true;

        angular.forEach(durations, (duration) => {
            queue.push(
                DedicatedCloud.getUpgradeResourceOrder($stateParams.productId, upgradeType, duration, resourceType, resourceId).then((details) => {
                    $scope.durations.details[duration] = details;
                })
            );
        });

        $q.all(queue).then(
            () => {
                if (durations && durations.length === 1) {
                    $scope.model.duration = durations[0];
                }
                $scope.loading.prices = false;
            },
            (data) => {
                Alerter.alertFromSWS($translate.instant("dedicatedCloud_order_loading_error"), data.data);
                $scope.loading.durations = false;
            }
        );
    }

    /*= =============================
        =            STEP 2            =
        ==============================*/

    $scope.loadContracts = function () {
        $scope.agree.value = false;
        if (!$scope.durations.details[$scope.model.duration].contracts || !$scope.durations.details[$scope.model.duration].contracts.length) {
            $rootScope.$broadcast("wizard-goToStep", 5);
        }
    };

    $scope.backToContracts = function () {
        if (!$scope.durations.details[$scope.model.duration].contracts || !$scope.durations.details[$scope.model.duration].contracts.length) {
            $rootScope.$broadcast("wizard-goToStep", 2);
        }
    };

    /*= =============================
        =            STEP 3            =
        ==============================*/

    $scope.getResumePrice = function (price) {
        return price.value === 0 ? $translate.instant("price_free") : $translate.instant("price_ht_label", { t0: price.text });
    };

    $scope.upgradedResource = function () {
        $scope.loading.validation = true;
        let orderUrl = "";

        // Safari quirk, you cannot call window.open in an async call in safari (like the follow promise)
        // so hold a ref to a new window and set the url once it get it.
        const windowRef = $window.open();
        DedicatedCloud.upgradedResource($stateParams.productId, upgradeType, $scope.model.duration, resourceType, resourceId)
            .then((order) => {
                const message = $translate.instant("dedicatedCloud_order_finish_success", {
                    t0: order.url,
                    t1: order.orderId
                });
                $scope.setMessage(message, true);
                Alerter.alertFromSWS(message, { idTask: order.orderId, state: "OK" });
                orderUrl = order.url;
                $scope.resetAction();
            })
            .catch((data) => {
                const message = $translate.instant("dedicatedCloud_order_finish_error");
                $scope.setMessage(message, angular.extend(data, { type: "ERROR" }));
                Alerter.alertFromSWS(message, data.data);
            })
            .finally(() => {
                $scope.loading.validation = false;
                if (_.isEmpty(orderUrl)) {
                    windowRef.close();
                } else {
                    windowRef.location = orderUrl;
                }
            });
    };
});
