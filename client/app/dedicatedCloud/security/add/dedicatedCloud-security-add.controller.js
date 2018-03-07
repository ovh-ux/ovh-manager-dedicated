angular.module("App").controller("DedicatedCloudSecurityPolicyAddCtrl", ($scope, $stateParams, DedicatedCloud, translator, REGEX) => {
    "use strict";
    const tr = translator.tr;

    $scope.regex = REGEX;
    $scope.newNetwork = {
        value: null
    };

    $scope.addEntry = function () {
        $scope.resetAction();
        DedicatedCloud.addSecurityPolicy($stateParams.productId, $scope.newNetwork).then(
            (data) => {
                $scope.setMessage(tr("dedicatedCloud_configuration_SECURITY_policy_add_success"), data);
            },
            (data) => {
                $scope.setMessage(tr("dedicatedCloud_configuration_SECURITY_policy_add_fail", [$scope.newNetwork.value]), data.data);
            }
        );
    };
});
