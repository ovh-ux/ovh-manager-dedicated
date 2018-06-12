angular.module("UserAccount").controller("UserAccount.controllers.ssh.cloud.add", [
    "$scope",
    "UserAccount.services.ssh",
    "$window",
    function ($scope, UseraccountSshService, $window) {
        "use strict";

        $scope.model = {};
        $scope.data = {
            projects: [],
            selectedProject: null,
            loader: true
        };

        UseraccountSshService.getCloudProjects()
            .then((projects) => {
                $scope.data.projects = projects;
            })
            .finally(() => {
                $scope.data.loader = false;
            });

        $scope.addCloudSshKey = function () {
            $scope.resetAction();
            $window.location.href = UseraccountSshService.getSshCloudUrl($scope.data.selectedProject.id);
        };

        $scope.formIsValid = function () {
            return _.isObject($scope.data.selectedProject);
        };
    }
]);
