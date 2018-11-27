angular.module('App').controller('ServerTabsCtrl', ($scope, $stateParams, $location, featureAvailability) => {
  const defaultTab = 'dashboard';
  $scope.toKebabCase = _.kebabCase;
  const originalTabs = _.chain([
    'dashboard',
    'dns',
    'ftp_backup',
    'intervention',
    'firewall',
    'ipmi',
    'usb_storage',
    'task',
  ]).pull(featureAvailability.allowDedicatedServerFirewallCiscoAsa() ? null : 'firewall')
    .pull(featureAvailability.allowDedicatedServerUSBKeys() ? null : 'usb_storage')
    .value();

  $scope.setSelectedTab = function (tab) {
    if (tab !== undefined && tab !== null && tab !== '') {
      $scope.selectedTab = tab;
    } else {
      $scope.selectedTab = defaultTab;
    }
    $location.search('tab', $scope.selectedTab);
  };

  if ($stateParams.tab && ~$scope.tabs.indexOf(angular.uppercase($stateParams.tab))) {
    $scope.setSelectedTab(angular.uppercase($stateParams.tab));
  } else {
    $scope.setSelectedTab(defaultTab);
  }

  $scope.$on('dedicated.server.refreshTabs', () => {
    if (!$scope.loadingServerInformations) {
      $scope.tabs = originalTabs;

      if ($scope.server.commercialRange === 'housing') {
        $scope.tabs = ['dashboard', 'dns', 'ftp_backup', 'intervention', 'task'];
      }
    }
  });
});
