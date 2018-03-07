angular.module("Module.ip.controllers").controller("IpReverseUpdateCtrl", ($scope, $rootScope, Ip, IpReverse, Alerter, Validator, $location, $q) => {
    function init (data) {
        $scope.data = data || $scope.currentActionData;
        $scope.model = { reverse: angular.copy($scope.data.ip.reverse ? punycode.toUnicode($scope.data.ip.reverse) : "") };
    }

    $scope.updateReverse = function () {
        $scope.loading = true;

        // If not modified, return
        if ($scope.model.reverse && punycode.toASCII($scope.model.reverse) === $scope.data.ip.reverse) {
            return $scope.resetAction();
        }

        return IpReverse.updateReverse($scope.data.ipBlock.service, $scope.data.ipBlock.ipBlock, $scope.data.ip.ip, $scope.model.reverse)
            .then(
                () => {
                    $rootScope.$broadcast("ips.table.refreshBlock", $scope.data.ipBlock);
                    Alerter.success($scope.tr("ip_table_manage_reverse_success"));
                },
                (data) => {
                    Alerter.alertFromSWS($scope.tr("ip_table_manage_reverse_failure"), data);
                }
            )
            .finally(() => {
                $scope.cancelAction();
            });
    };

    $scope.isValid = function () {
        return $scope.model.reverse && Validator.isValidDomain($scope.model.reverse.replace(/\.$/, ""));
    };

    // Come from URL
    if ($location.search().action === "reverse" && $location.search().ip) {
        $scope.loading = true;
        $q
            .all([Ip.getIpDetails($location.search().ipBlock), Ip.getServicesList()])
            .then(
                (result) => {
                    const ipDetails = result[0];
                    const serviceList = result[1];
                    const serviceForIp = _.find(serviceList, (service) => ipDetails.routedTo.serviceName === service.serviceName);
                    if (serviceForIp) {
                        init({ ip: { ip: $location.search().ip }, ipBlock: { ipBlock: $location.search().ipBlock, service: serviceForIp || null } });
                    }
                },
                (data) => {
                    Alerter.alertFromSWS($scope.tr("ip_dashboard_error"), data);
                }
            )
            .then(
                () =>
                    IpReverse.getReverse($location.search().ipBlock, $location.search().ip).then((reverseData) => {
                        $scope.model = { reverse: angular.copy(reverseData.reverse) };
                    }) // if error > reverse is init to '' > nothing more to do
            )
            .finally(() => {
                $scope.loading = false;
            });
    } else {
        init();
    }

    $scope.cancelAction = function () {
        Ip.cancelActionParam("reverse");
        $scope.resetAction();
    };
});
