angular.module("App").controller("ServerTabsCtrl", ($scope, $stateParams, $location) => {
    "use strict";

    const defaultTab = "dashboard";
    $scope.toKebabCase = _.kebabCase;
    $scope.tabs = ["dashboard", "dns", "ftp_backup", "intervention", "firewall", "ipmi", "usb_storage", "task"];

    $scope.setSelectedTab = function (tab) {
        if (tab !== undefined && tab !== null && tab !== "") {
            $scope.selectedTab = tab;
        } else {
            $scope.selectedTab = defaultTab;
        }
        $location.search("tab", $scope.selectedTab);
    };

    if ($stateParams.tab && ~$scope.tabs.indexOf(angular.uppercase($stateParams.tab))) {
        $scope.setSelectedTab(angular.uppercase($stateParams.tab));
    } else {
        $scope.setSelectedTab(defaultTab);
    }

    $scope.$on("dedicated.server.refreshTabs", () => {
        $scope.tabs = ["dashboard", "dns", "ftp_backup", "intervention", "firewall", "ipmi", "usb_storage", "task"];

        if ($scope.server.commercialRange === "housing") {
            $scope.tabs = ["dashboard", "dns", "ftp_backup", "intervention", "task"];
        }
    });
});
