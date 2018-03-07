angular.module("App").controller("FeedBackCtrl", [
    "$scope",
    "OvhHttp",
    "$stateParams",
    "$location",
    "constants",
    function ($scope, OvhHttp, $stateParams, $location, constants) {
        "use strict";

        $scope.feedback = null;

        $scope.initForm = function () {
            $scope.feedback = {
                subject: "",
                body: ""
            };
        };

        $scope.isSending = false;

        $scope.sendFeedBack = function () {
            if ($scope.feedBackForm.$valid) {
                $scope.isSending = true;

                $scope.feedback.body = [$scope.feedback.body, "------------------------------------------", `univers : ${constants.UNIVERS}`, `location : ${$location.path()}`, `userAgent : ${window.navigator.userAgent}`].join("\n");

                OvhHttp.post("/me/feedback", {
                    rootPath: "apiv6",
                    data: $scope.feedback
                }).finally(() => {
                    $scope.initForm();
                    $scope.isSending = false;
                    $scope.closeModal();
                });
            }
        };

        $scope.closeModal = function () {
            $("#feedback").modal("toggle");
        };

        $scope.initForm();
    }
]);
