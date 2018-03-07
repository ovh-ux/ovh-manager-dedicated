angular.module("UserAccount.controllers").controller("UserAccount.controllers.ipRestrictions.delete", [
    "$rootScope",
    "$scope",
    "UserAccount.services.ipRestrictions",
    "Alerter",
    function ($rootScope, $scope, Service, Alerter) {
        "use strict";

        $scope.data = $scope.currentActionData;

        $scope.deleteRestriction = function () {
            $scope.resetAction();
            Service.deleteRestriction($scope.data).then(
                () => {
                    $rootScope.$broadcast("ipRestriction.reload");
                },
                (data) => {
                    Alerter.alertFromSWS($scope.tr("user_ipRestrictions_delete_error", $scope.data.ip), data.data, "ipRestrictionAlert");
                }
            );
        };
    }
]);
