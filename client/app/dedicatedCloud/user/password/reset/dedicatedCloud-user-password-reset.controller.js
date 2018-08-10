angular.module("App").controller("DedicatedCloudUserResetPasswordCtrl", ($stateParams, $scope, $translate, DedicatedCloud, Alerter) => {
    "use strict";

    $scope.canBeResetHere = false;
    $scope.resetUrl = "";

    $scope.user = $scope.currentActionData ? $scope.currentActionData.user : null;
    $scope.passwordPolicy = $scope.currentActionData ? $scope.currentActionData.passwordPolicy : null;
    $scope.password = "";
    $scope.user.confirmPassword = $scope.user.confirmPassword ? $scope.user.confirmPassword : "";

    $scope.showError = {
        checkPassword: false
    };
    $scope.loading = false;
    $scope.alerts = {
        users: "dedicatedCloud.alerts.dashboardUsers"
    };

    $scope.resetPassword = function () {
        $scope.isReseting = true;
        return DedicatedCloud
            .resetUserPassword($stateParams.productId, $scope.user, $scope.user.password)
            .catch((err) => {
                Alerter.alertFromSWS($translate.instant("dedicatedCloud_users_password_loading_error"), err, $scope.alerts.users);
            })
            .finally(() => {
                $scope.isReseting = false;
                $scope.resetAction();
            });
    };

    $scope.checkPassword = function (data) {
        $scope.user.password = data;
        $scope.showError.checkPassword = false;

        return DedicatedCloud.checkPassword($scope.passwordPolicy, $scope.user);
    };

    $scope.checkOptionsStates = function () {
        $scope.loading = true;
        return DedicatedCloud.hasSecurityOption($stateParams.productId)
            .then((hasSecurityOption) => {
                $scope.canBeResetHere = !hasSecurityOption;
                if (hasSecurityOption) {
                    return getSelectedProduct();
                }
                return null;
            })
            .catch((err) => {
                Alerter.alertFromSWS($translate.instant("dedicatedCloud_users_password_reset_check_error"), err, $scope.alerts.users);
            })
            .finally(() => {
                $scope.loading = false;
            });
    };

    function getSelectedProduct () {
        return DedicatedCloud.getDescription($stateParams.productId).then((productDescription) => {
            $scope.resetUrl = productDescription.vScopeUrl.replace("vScope", "secure");
        });
    }
});
