angular.module("App").controller("DedicatedCloudTabsCtrl", [
    "$scope",
    "$stateParams",
    "$location",

    function ($scope, $stateParams, $location) {
        "use strict";

        const defaultTab = "dashboard";
        $scope.toKebabCase = _.kebabCase;
        $scope.dedicatedCloudTab = {
            tabs: ["dashboard", "datacenter", "user", "security", "operation"]
        };

        $scope.setSelectedTab = function (tab) {
            if (tab !== undefined && tab !== null && tab !== "") {
                $scope.selectedTab = tab;
            } else {
                $scope.selectedTab = defaultTab;
            }
            $location.search("tab", $scope.selectedTab);
        };

        if ($stateParams.tab && ~$scope.dedicatedCloudTab.tabs.indexOf($stateParams.tab)) {
            $scope.setSelectedTab(angular.uppercase($stateParams.tab));
        } else {
            $scope.setSelectedTab(defaultTab);
        }
    }
]);
