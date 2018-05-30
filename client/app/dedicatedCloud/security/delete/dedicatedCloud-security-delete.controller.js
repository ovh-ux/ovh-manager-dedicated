angular.module("App").controller("DedicatedCloudSecurityPolicyDeleteCtrl", ($scope, $stateParams, DedicatedCloud, $translate, Alerter) => {

    $scope.entriesToDelete = $scope.currentActionData.selectedPolicies;

    $scope.deleteEntries = function () {
        $scope.resetAction();
        DedicatedCloud[$scope.entriesToDelete.length > 1 ? "deleteSecurityPolicies" : "deleteSecurityPolicy"](
            $stateParams.productId,
            _.pluck($scope.entriesToDelete, "id")
        ).then(() => Alerter.success(
            $scope.entriesToDelete.length > 1 ?
                $translate.instant("dedicatedCloud_configuration_SECURITY_policy_delete_success_other") :
                $translate.instant("dedicatedCloud_configuration_SECURITY_policy_delete_success_one")
            , "dedicatedCloud")
        ).catch((err) => Alerter.alertFromSWS(
            $scope.entriesToDelete.length > 1 ?
                $translate.instant("dedicatedCloud_configuration_SECURITY_policy_delete_fail_other") :
                $translate.instant("dedicatedCloud_configuration_SECURITY_policy_delete_fail_one")
            , err, "dedicatedCloud")
        );
    };
});
