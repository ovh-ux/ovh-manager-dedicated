angular.module("App").controller("FtpBackupOrdercontroller", ($scope, $stateParams, Server, Alerter) => {
    $scope.alert = "server_tab_ftpbackup_alert";
    $scope.loading = false;
    $scope.order = {
        model: null,
        choiceIndex: null,
        bc: null,
        agreeContract: false
    };

    $scope.load = function () {
        $scope.loading = true;
        Server.getFtpBackupOrder($stateParams.productId).then(
            (data) => {
                $scope.order.model = data;
                $scope.loading = false;
            },
            (reason) => {
                $scope.loading = false;
                Alerter.alertFromSWS($scope.tr("server_configuration_ftpbackup_order_load_failure", $scope.access), reason, $scope.alert);
                $scope.resetAction();
            }
        );
    };

    $scope.getDetail = function () {
        $scope.loading = true;
        Server.getFtpBackupOrderDetail($stateParams.productId, $scope.order.model[$scope.order.choiceIndex].capacity).then(
            (data) => {
                $scope.order.bc = data;
                $scope.order.bc.details[0].explanation = {
                    price: $scope.order.model[$scope.order.choiceIndex].price
                };
                $scope.loading = false;
            },
            (reason) => {
                $scope.loading = false;
                Alerter.alertFromSWS($scope.tr("server_configuration_ftpbackup_order_load_detail_failure", $scope.access), reason, $scope.alert);
                $scope.resetAction();
            }
        );
    };

    $scope.orderCapacity = function () {
        $scope.loading = true;
        Server.postFtpBackupOrderDetail($stateParams.productId, $scope.order.bc.duration, $scope.order.model[$scope.order.choiceIndex].capacity).then(
            (data) => {
                window.open(data.url, "_blank");
                Alerter.alertFromSWS($scope.tr("server_configuration_ftpbackup_order_load_order_success", [data.url, data.orderId]), true, $scope.alert);
                $scope.loading = false;
                $scope.resetAction();
            },
            (reason) => {
                $scope.loading = false;
                Alerter.alertFromSWS($scope.tr("server_configuration_ftpbackup_order_load_order_failure", $scope.access), reason, $scope.alert);
                $scope.resetAction();
            }
        );
    };
});
