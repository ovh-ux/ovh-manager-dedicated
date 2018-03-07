angular.module("App").controller("DedicatedCloudSecurityPolicyDeleteCtrl", ($scope, $stateParams, DedicatedCloud, translator, Alerter) => {
    const trpl = translator.trpl;
    const policies = $scope.currentActionData.policies;

    $scope.entriesToDelete = $scope.currentActionData.selectedPolicies;

    $scope.deleteEntries = function () {
        $scope.resetAction();
        DedicatedCloud[$scope.entriesToDelete.length > 1 ? "deleteSecurityPolicies" : "deleteSecurityPolicy"]($stateParams.productId, $scope.entriesToDelete)
            .then(() => Alerter.success(trpl("dedicatedCloud_configuration_SECURITY_policy_delete_success", $scope.entriesToDelete.length), "dedicatedCloud"))
            .catch((err) => Alerter.alertFromSWS(trpl("dedicatedCloud_configuration_SECURITY_policy_delete_fail", $scope.entriesToDelete.length), err, "dedicatedCloud"));
    };

    $scope.getPolicyIP = function (id) {
        return _.find(policies, { id }).network;
    };
});
