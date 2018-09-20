angular.module('Module.ip.controllers').controller('IpOrganisationViewCtrl', ($scope, Ip, IpOrganisation, featureAvailability) => {
  $scope.data = $scope.currentActionData;
  $scope.loading = true;

  $scope.showState = function () {
    return featureAvailability.showState();
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
