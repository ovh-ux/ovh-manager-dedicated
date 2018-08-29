angular.module('Module.ip.controllers').controller('IpOrganisationAddCtrl', ($scope, $translate, Ip, IpOrganisation, Alerter, $q, User, featureAvailability) => {
  $scope.alert = 'ip_organisation_addedit_alerter';
  $scope.load = {
    loading: false,
    request: false,
  };

  $scope.newOrganisation = {
    registry: null,
    lastname: null,
    firstname: null,
    abuse_mailbox: null,
    address: null,
    zip: null,
    city: null,
    state: null,
    country: null,
    phone: null,
  };

  $scope.list = {
    country: [],
    registry: [],
  };

  $scope.formOrganisation = {
    formValid: false,
    edit: false,
  };

  $scope.orderByCountryAlias = function (a) {
    const result = $translate.instant(`country_${a}`);
    return result === 'country_' ? a : result;
  };

  $scope.load = function () {
    const queue = [];
    $scope.load.loading = true;

    queue.push(
      Ip.getNichandleIpRegistryEnum().then((data) => {
        $scope.list.registry = data;
      }),
    );

    queue.push(
      Ip.getNichandleCountryEnum().then((data) => {
        $scope.list.country = data;
      }),
    );

    queue.push(
      User.getUser().then((data) => {
        $scope.newOrganisation.country = data.billingCountry;
      }),
    );

    $q.all(queue).then(
      () => {
        if ($scope.currentActionData) {
          $scope.formOrganisation.edit = true;
          $scope.newOrganisation = angular.copy($scope.currentActionData);
        }
        $scope.load.loading = false;
      },
      () => {
        $scope.resetAction();
        Alerter.alertFromSWS($translate.instant('ip_organisation_add_load_error'), false, $scope.alert);
        $scope.load.loading = false;
      },
    );
  };

  $scope.resetAlertOranisation = function () {
    Alerter.resetMessage($scope.alert);
  };

  $scope.showState = function () {
    return featureAvailability.showState();
  };

  $scope.addOrganisation = function () {
    $scope.load.loading = true;
    $scope.resetAlertOranisation();
    if ($scope.formOrganisation.edit) {
      IpOrganisation.putOrganisation($scope.newOrganisation).then(
        () => {
          Alerter.alertFromSWS($translate.instant('ip_organisation_edit_success'), true, $scope.alert);
          $scope.load.loading = false;
          $scope.resetAction();
        },
        (reason) => {
          Alerter.alertFromSWS($translate.instant('ip_organisation_edit_error'), reason, $scope.alert);
          $scope.load.loading = false;
        },
      );
    } else {
      IpOrganisation.postOrganisation($scope.newOrganisation).then(
        () => {
          Alerter.alertFromSWS($translate.instant('ip_organisation_add_success'), true, $scope.alert);
          $scope.load.loading = false;
          $scope.resetAction();
        },
        (reason) => {
          Alerter.alertFromSWS($translate.instant('ip_organisation_add_error'), reason, $scope.alert);
          $scope.load.loading = false;
        },
      );
    }
  };
});

angular.module('Module.ip.controllers').controller('IpOrganisationAddFormCtrl', ($scope, featureAvailability) => {
  $scope.organisationForm = null;

  $scope.$watch('organisationForm.$valid', () => {
    $scope.formOrganisation.formValid = $scope.organisationForm.$valid;
  });

  $scope.showState = function () {
    return featureAvailability.showState();
  };

  $scope.getClassLabel = function (label, noDirty) {
    if (label && (noDirty || label.$dirty)) {
      return (label.$invalid && 'error') || 'success';
    }
    return '';
  };

  $scope.hasError = function (label) {
    return label.$invalid && label.$dirty;
  };
});
