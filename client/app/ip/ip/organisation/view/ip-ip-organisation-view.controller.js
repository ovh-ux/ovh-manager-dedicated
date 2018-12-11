angular.module('Module.ip.controllers').controller('IpOrganisationViewCtrl', (
  $scope,
  Ip,
  ipFeatureAvailability,
  IpOrganisation,
) => {
  $scope.data = $scope.currentActionData;
  $scope.loading = true;

  $scope.showState = function () {
    return ipFeatureAvailability.showState();
  };

  IpOrganisation.getIpOrganisationDetails($scope.data.ipBlock.organizationId).then(
    (details) => {
      $scope.orga = details;
      $scope.loading = false;
    },
    () => {
      $scope.loading = false;
    },
  );
});
