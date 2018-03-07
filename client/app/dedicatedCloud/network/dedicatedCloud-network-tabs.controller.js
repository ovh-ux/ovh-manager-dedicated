angular.module("App").controller("DedicatedCloudSubNetworkTabsCtrl", [
    "$scope",

    function ($scope) {
        "use strict";

        const defaultTab = "vpn";
        $scope.dedicatedCloud = {
            tabs: ["vpn", "ace", "nasha", "blocip"]
        };

        $scope.isActive = function (tab) {
            return $scope.selectedTab === tab ? "active" : "";
        };

        $scope.setSelectedTab = function (tab) {
            if (tab !== undefined && tab !== null && tab !== "") {
                $scope.selectedTab = tab;
            } else {
                $scope.selectedTab = defaultTab;
            }
        };

        $scope.setSelectedTab(defaultTab);
    }
]);
