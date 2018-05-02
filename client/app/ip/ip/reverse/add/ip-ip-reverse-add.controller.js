angular.module("Module.ip.controllers").controller("IpAddIpv6Ctrl", ($scope, $rootScope, $translate, Ip, IpReverse, Alerter, Validator) => {
    "use strict";

    $scope.data = $scope.currentActionData;
    $scope.model = { ipv6: null, reverse: null };

    /* Action */

    $scope.addIpv6 = function () {
        if ($scope.model.reverse) {
            IpReverse.updateReverse($scope.data.ipBlock.service, $scope.data.ipBlock.ipBlock, $scope.model.ipv6, $scope.model.reverse).then(
                () => {
                    $rootScope.$broadcast("ips.table.refreshBlock", $scope.data.ipBlock);
                },
                (reason) => {
                    Alerter.alertFromSWS($translate.instant("ip_table_manage_add_ipv6block_failure"), reason);
                }
            );
        } else {
            $rootScope.$broadcast("ips.table.add", $scope.data.ipBlock, $scope.model.ipv6);
        }

        $scope.resetAction();
    };

    $scope.isValid = {
        ipv6 () {
            return Validator.isValidIpv6($scope.model.ipv6);
        },
        reverse () {
            if ($scope.model.reverse) {
                return Validator.isValidDomain($scope.model.reverse.replace(/\.$/, ""));
            }
            return true;
        },
        all () {
            return $scope.isValid.ipv6() && $scope.isValid.reverse();
        }
    };
});
