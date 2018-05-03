angular.module("App").controller("DedicatedCloudSecurityPolicyAddCtrl", ($scope, $stateParams, DedicatedCloud, $translate, REGEX) => {
    "use strict";

    $scope.regex = REGEX;
    $scope.newNetwork = {
        value: null
    };

    $scope.addEntry = function () {
        $scope.resetAction();
        DedicatedCloud.addSecurityPolicy($stateParams.productId, $scope.newNetwork).then(
            (data) => {
                $scope.setMessage($translate.instant("dedicatedCloud_configuration_SECURITY_policy_add_success"), data);
            },
            (data) => {
                $scope.setMessage($translate.instant("dedicatedCloud_configuration_SECURITY_policy_add_fail", [$scope.newNetwork.value]), data.data);
            }
        );
    };
});
