angular.module('Module.license').controller('LicenseOrderCtrl', (
  $q,
  $filter,
  $scope,
  $timeout,
  $translate,
  Alerter,
  License,
  licenseFeatureAvailability,
  LicenseOrder,
  User,
) => {
  $scope.alerts = {
    order: 'license.alerts.order',
  };

  $scope.loaders = {
    ips: false,
    orderableVersion: true,
    durations: false,
    prices: false,
    bc: false,
    agoraUrl: false,
  };

  $scope.types = {};

  $scope.selected = {
    ipBlock: null,
    ip: null,
    licenseType: null,
    version: null,
    options: [],
    duration: null,
    agoraUrl: '',
  };

  $scope.filters = {
    block: {
      type: undefined,
      search: undefined,
    },
  };

  $scope.availableIpBlock = {};

  $scope.ipValid = {
    value: false,
  };

  const getOrderableVersion = function () {
    $scope.loaders.orderableVersion = true;
    if ($scope.ipValid.value) {
      if ($scope.selected.ipBlock.type === 'DEDICATED') {
        LicenseOrder.LicenseAgoraOrder.getDedicatedAddonLicenses(_.get($scope, 'selected.ipBlock')).then((data) => {
          $scope.orderType = data.length > 0 ? 'DEDICATED' : 'CLASSIC';
        }).catch(() => {
          $scope.orderType = 'CLASSIC';
        }).finally(() => {
          $scope.loaders.orderableVersion = false;
        });
      } else {
        $scope.orderType = 'CLASSIC';
      }
    } else {
      $scope.loaders.orderableVersion = false;
      $scope.selectedType = {
        value: null,
      };
      $scope.nbLicence.value = _.values($scope.types).length || 0;
    }
  };

  $scope.resetAction = function () {
    $scope.setAction(false);
  };

  $scope.setAction = function (action, data) {
    if (action) {
      $scope.currentAction = action;
      $scope.currentActionData = data;
      $scope.stepPath = `license/${$scope.currentAction}.html`;
      $('#currentAction').modal({
        keyboard: true,
        backdrop: 'static',
      });
    } else {
      $('#currentAction').modal('hide');
      $timeout(() => {
        $scope.currentActionData = null;
        $scope.stepPath = '';
      }, 300);
    }
  };

  function init() {
    $scope.agoraEnabled = licenseFeatureAvailability.allowLicenseAgoraOrder();
    $scope.powerpackModel = {
      value: false,
    };
    $scope.loaders.ips = true;

    if ($scope.agoraEnabled) {
      $scope.$watch(() => $scope.selected, (value) => {
        _.set(LicenseOrder, 'ip', value.ip);
      }, true);
    }

    return $q.all({
      ips: License.ips(),
      user: User.getUser(),
    }).then((results) => {
      $scope.availableIpBlock = results.ips;
      $scope.user = results.user;
    }).catch((err) => {
      $scope.availableIpBlock = {};
      Alerter.alertFromSWS($translate.instant('license_details_loading_error'), err, $scope.alerts.order);
    }).finally(() => {
      $scope.loaders.ips = false;
    });
  }

  $scope.ipIsValid = function () {
    const block = $scope.selected.ipBlock.block.split('/');
    const mask = block[1];
    const range = block[0];
    let ip = null;

    try {
      if (ipaddr.isValid($scope.selected.ip)) {
        ip = ipaddr.parse($scope.selected.ip);
        $scope.ipValid.value = ip.match(ipaddr.parse(range), mask);
      } else {
        $scope.ipValid.value = false;
      }
    } catch (e) {
      $scope.ipValid.value = false;
      throw e;
    }

    getOrderableVersion();
  };

  $scope.$watch('selected.ipBlock', (nv) => {
    $scope.selected.licenseType = null;
    $scope.selected.version = null;
    $scope.selected.ip = null;
    $scope.selected.options = [];
    $scope.selected.duration = null;
    $scope.selected.agoraUrl = '';
    $scope.loaders.bc = false;
    $scope.durations = [];
    $scope.order = null;
    $scope.ipValid.value = false;

    if (nv) {
      const block = nv.block.split('/');
      const mask = block[1];
      let range = block[0];

      try {
        range = ipaddr.parse(range);
        if (range.kind() === 'ipv4') {
          if (mask === '32') {
            $scope.oneIp = true;
          } else {
            $scope.oneIp = false;
          }

          $scope.selected.ip = range.toString();
          $scope.ipValid.value = true;
        } else {
          $scope.oneIp = false;
        }
      } catch (e) {
        $scope.oneIp = false;
        throw e;
      }

      getOrderableVersion();
    }
  });

  $scope.getBlockDisplay = function (ip) {
    return ip.block + (ip.reverse ? ` (${ip.reverse})` : '');
  };

  $scope.filterBlocks = function () {
    $('#licenseOrderBlockFilters').click();
  };

  $scope.order = null;

  init();
});
