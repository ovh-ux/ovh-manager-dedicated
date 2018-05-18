angular.module("App").controller("DedicatedCloudSecurityPolicyModifyCtrl", ($scope, $stateParams, DedicatedCloud, $translate, REGEX) => {
    "use strict";

    $scope.entryToModify = angular.copy($scope.currentActionData);
    $scope.regex = REGEX;

    $scope.modifyEntry = function () {
        $scope.resetAction();
        DedicatedCloud.modifySecurityPolicy($stateParams.productId, $scope.entryToModify).then(
            (data) => {
                $scope.setMessage($translate.instant("dedicatedCloud_configuration_SECURITY_policy_modify_success"), data);
            },
            (data) => {
                $scope.setMessage($translate.instant("dedicatedCloud_configuration_SECURITY_policy_modify_fail", {
                    t0: $scope.currentActionData.network
                }), data);
            }
        );
    };

    init();

    function init () {
        $scope.entryToModify.network = $scope.entryToModify.network.replace(/\/[0-9]+/, "");
    }
});
