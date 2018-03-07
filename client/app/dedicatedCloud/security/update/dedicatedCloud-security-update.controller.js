angular.module("App").controller("DedicatedCloudSecurityPolicyModifyCtrl", ($scope, $stateParams, DedicatedCloud, translator, REGEX) => {
    "use strict";
    const tr = translator.tr;

    $scope.entryToModify = angular.copy($scope.currentActionData);
    $scope.regex = REGEX;

    $scope.modifyEntry = function () {
        $scope.resetAction();
        DedicatedCloud.modifySecurityPolicy($stateParams.productId, $scope.entryToModify).then(
            (data) => {
                $scope.setMessage(tr("dedicatedCloud_configuration_SECURITY_policy_modify_success"), data);
            },
            (data) => {
                $scope.setMessage(tr("dedicatedCloud_configuration_SECURITY_policy_modify_fail", [$scope.currentActionData.network]), data.data);
            }
        );
    };

    init();

    function init () {
        $scope.entryToModify.network = $scope.entryToModify.network.replace(/\/[0-9]+/, "");
    }
});
