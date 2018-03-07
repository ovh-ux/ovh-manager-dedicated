angular.module("UserAccount.controllers").controller("UserAccount.controllers.ipRestrictions.add", [
    "$rootScope",
    "$scope",
    "UserAccount.services.ipRestrictions",
    "Alerter",
    "UserValidator",
    function ($rootScope, $scope, Service, Alerter, Validator) {
        "use strict";

        $scope.isValid = false;
        $scope.restriction = {
            ip: null,
            warning: false,
            rule: "ACCEPT"
        };

        $scope.$watch(
            "restriction.ip",
            _.debounce((target) => {
                $scope.$apply(() => {
                    $scope.isValid = target != null && (Validator.isValidIpv4(target) || Validator.isValidIpv6(target) || Validator.isValidIpv4Block(target) || Validator.isValidIpv6Block(target));
                });
            }, 100)
        );

        $scope.addRestriction = function () {
            $scope.resetAction();
            Service.addRestriction($scope.restriction).then(
                () => {
                    $rootScope.$broadcast("ipRestriction.reload");
                },
                (data) => {
                    Alerter.alertFromSWS($scope.tr("user_ipRestrictions_add_error", $scope.restriction.ip), data.data, "ipRestrictionAlert");
                }
            );
        };
    }
]);
