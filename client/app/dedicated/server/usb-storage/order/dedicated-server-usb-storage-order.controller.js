angular.module("App").controller("UsbStorageOrderCtrl", ($rootScope, $scope, $q, $stateParams, Server, User, Alerter) => {
    "use strict";

    User.getUser().then((user) => {
        $scope.ovhSubsidiary = user.ovhSubsidiary;
    });

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
    $scope.informations = $scope.currentActionData;

    /*= =============================
        =            STEP 2            =
        ==============================*/
    $scope.getDurations = function () {
        $scope.durations = {
            available: null,
            details: {}
        };
        $scope.loading.durations = true;

        Server.getUsbStorageDurations($stateParams.productId, $scope.model.capacity).then((durations) => {
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
                Server.getUsbStorageOrder($stateParams.productId, $scope.model.capacity, duration).then((details) => {
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
                Alerter.alertFromSWS($scope.tr("server_tab_USB_STORAGE_order_loading_error"), data.data);
                $scope.loading.durations = false;
            }
        );
    }

    /*= =============================
        =            STEP 3            =
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
        =            STEP 4            =
        ==============================*/

    $scope.getResumePrice = function (price) {
        return price.value === 0 ? $scope.tr("price_free") : $scope.tr("price_ht_label", [price.text]);
    };

    $scope.orderUsbDisk = function () {
        $scope.loading.validation = true;
        Server.orderUsbStorage($stateParams.productId, $scope.model.capacity, $scope.model.duration).then(
            (order) => {
                $scope.loading.validation = false;
                Alerter.alertFromSWS($scope.tr("server_tab_USB_STORAGE_order_finish_success", [order.url, order.orderId]), { idTask: order.orderId, state: "OK" });
                window.open(order.url, "_blank");
                $scope.resetAction();
            },
            (data) => {
                $scope.loading.validation = false;
                Alerter.alertFromSWS($scope.tr("server_tab_USB_STORAGE_order_finish_error"), data.data);
            }
        );
    };
});
