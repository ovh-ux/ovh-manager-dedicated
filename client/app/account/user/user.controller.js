angular.module("UserAccount.controllers").controller("UserAccount.controllers.main", [
    "$scope",
    "$window",
    "$location",
    "$timeout",
    "$state",
    "UserAccount.conf.BASE_URL",
    function ($scope, $window, $location, $timeout, $state, USERACCOUNT_BASE_URL) {
        "use strict";

        $scope.USERACCOUNT_BASE_URL = USERACCOUNT_BASE_URL;

        $scope.originUrl = $location.search().redirectTo || $location.search().redirectto;

        $scope.redirectToOrigin = function () {
            if ($scope.originUrl) {
                $window.location.href = $scope.originUrl;
            } else {
                $state.go("app.configuration");
            }
        };

        $scope.stepPath = "";
        $scope.currentAction = null;
        $scope.currentActionData = null;

        $scope.resetAction = function () {
            $scope.setAction(false);
        };

        $scope.setAction = function (action, data) {
            $scope.currentAction = action;
            $scope.currentActionData = data;
            if (action) {
                $scope.stepPath = `${USERACCOUNT_BASE_URL}${$scope.currentAction}.html`;
                $("#currentAction").modal({
                    keyboard: true,
                    backdrop: "static"
                });
            } else {
                $("#currentAction").modal("hide");
                $scope.currentActionData = null;
                $timeout(() => {
                    $scope.stepPath = "";
                }, 300);
            }
        };
    }
]);
