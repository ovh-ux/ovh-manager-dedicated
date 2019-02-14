angular.module('Module.license').controller('LicenseOrderClassicCtrl', (
  $q,
  $filter,
  $scope,
  $timeout,
  $translate,
  Alerter,
  License,
  licenseFeatureAvailability,
  LicenseOrder,
) => {
  $scope.nbLicence = {
    value: 0,
  };

  $scope.availableTypes = License.types;

  $scope.loaders = {
    ips: false,
    orderableVersion: true,
    durations: false,
    prices: false,
    bc: false,
    agoraUrl: false,
  };

  $scope.availableIpBlock = {};

  function getFilteredIps() {
    const typesFiltered = $filter('filter')($scope.availableIpBlock.ips,
      $scope.filters.block.type);
    const searchFiltered = $filter('filter')(typesFiltered,
      $scope.filters.block.search);

    return searchFiltered;
  }

  function loadPrices(licenseInfo, durations) {
    $scope.loaders.prices = true;

    LicenseOrder.getLicensePrices(licenseInfo, durations)
      .then((prices) => {
        if (durations && durations.length === 1) {
          $scope.selected.duration = _.first(durations);
        }

        $scope.durations.details = prices;
      })
      .finally(() => {
        $scope.loaders.prices = false;
      });
  }

  function getExistingServiceName(licenseType) {
    return $scope.types[licenseType].existingServiceName;
  }

  const getOrderableVersion = function () {
    $scope.loaders.orderableVersion = true;
    if ($scope.ipValid.value) {
      License.orderableVersion($scope.selected.ip)
        .then((data) => {
          $scope.types = data;
          $scope.nbLicence.value = 0;
          angular.forEach(_.values($scope.types), (value) => {
            $scope.nbLicence.value += value.options.length;
          });
        })
        .then(() => {
          $scope.getDuration();
        })
        .catch((err) => {
          Alerter.alertFromSWS($translate.instant('license_order_loading_error'), err, $scope.alerts.order);
        })
        .finally(() => {
          $scope.loaders.orderableVersion = false;
        });
    } else {
      $scope.loaders.orderableVersion = false;
      $scope.selectedType = {
        value: null,
      };
      $scope.nbLicence.value = _.values($scope.types).length || 0;
    }
  };

  function isDomainNumberMandatory() {
    return $scope.selected
      && $scope.selected.version
      && $scope.selected.version.options !== null
      && $scope.selected.version.options.length > 0;
  }

  function getResetedOptions() {
    return {
      PLESK: {
        domainNumber: {
          mandatory: isDomainNumberMandatory(),
          value: null,
        },
        antivirus: null,
        languagePackNumber: null,
        powerpack: null,
      },
      VIRTUOZZO: {
        containerNumber: {
          mandatory: true,
          value: null,
        },
      },
      WINDOWS: {
        sqlVersion: null,
      },
      WORKLIGHT: {
        lessThan1000Users: {
          mandatory: true,
          value: null,
          shouldBeEqualsTo: true,
        },
      },
    };
  }

  function getResetedDurations() {
    return {
      available: null,
      details: {},
    };
  }

  $scope.hasMoreOptions = function () {
    return $scope.selected.options[$scope.selected.licenseType] !== null;
  };

  $scope.isSelectionValid = function () {
    let valid = $scope.selected.licenseType !== null
      && $scope.selected.version !== null
      && $scope.selected.ip !== null;
    let moreOptions;
    if ($scope.selected.licenseType && $scope.selected.options[$scope.selected.licenseType]) {
      moreOptions = $scope.selected.options[$scope.selected.licenseType];
      angular.forEach(moreOptions, (value) => {
        valid = valid && (value === null || !value.mandatory || (value.mandatory
          && value.value !== null
          && (value.shouldBeEqualsTo === undefined || value.shouldBeEqualsTo === value.value)));
      });
    }

    return valid;
  };

  $scope.selectType = function (type) {
    if (type
        && type !== $scope.selected.licenseType
        && $scope.isAvailable(type)
        && !$scope.loaders.prices) {
      // In case of license upgrade, show an information popup and redirect to upgrade screen.
      const existingServiceName = getExistingServiceName(type);
      if (existingServiceName) {
        $scope.setAction('redirection/upgrade/license-redirection-upgrade', {
          licenseId: existingServiceName,
          licenseType: type,
        });
        return;
      }

      $scope.selected.licenseType = type;
      $scope.selected.version = null;
      if (
        $scope.types[$scope.selected.licenseType].options
              && $scope.types[$scope.selected.licenseType].options.length > 0
              && $scope.types[$scope.selected.licenseType].options[0].options
              && $scope.types[$scope.selected.licenseType].options[0].options.length === 1
      ) {
        $scope.selected.version = $scope.types[$scope.selected.licenseType].options[0].options[0]; // eslint-disable-line
      }

      $scope.selected.options = getResetedOptions();
      $scope.selected.duration = null;
      $scope.selected.agoraUrl = '';
      $scope.loaders.bc = false;
      $scope.durations = getResetedDurations();
      $scope.order = null;
    }
  };

  $scope.isAvailable = function (type) {
    if ($scope.types) {
      return !!$scope.types[type]
        && $scope.types[type].options
        && $scope.types[type].options.length > 0
        && (!licenseFeatureAvailability.allowLicenseAgoraOrder()
          || licenseFeatureAvailability.allowLicenseTypeAgoraOrder(type));
    }

    return false;
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
    getOrderableVersion();
  }

  init();

  $scope.$watch(
    'selected.version',
    () => {
      $scope.selected.options = getResetedOptions();
      $scope.selected.duration = null;
      $scope.loaders.bc = false;
      $scope.order = null;
      $scope.durations = getResetedDurations();
      $scope.getDuration();
    },
    true,
  );

  $scope.$watch(
    'selected.options',
    () => {
      $scope.selected.duration = null;
      $scope.loaders.bc = false;
      $scope.order = null;
      $scope.durations = getResetedDurations();
      $scope.getDuration();
    },
    true,
  );

  /**
   *  For plesk powerpack option only (and only for agora order)
   */
  $scope.onPowerpackOptionChange = function () {
    $scope.selected.options.PLESK.powerpack = $scope.powerpackModel.value
      ? { value: $scope.selected.version.more.powerPackPlanCode }
      : null;
  };

  $scope.$watch(
    'selected.duration',
    () => {
      $scope.loaders.bc = false;
      $scope.order = null;
      $(document).scrollTop($(document).height());
      if ($scope.agoraEnabled && $scope.selected.duration) {
        $scope.getAgoraUrl();
      }
    },
    true,
  );

  $scope.recheckIpBlockContained = function () {
    if (!_.contains(getFilteredIps(), $scope.selected.ipBlock)) {
      $scope.selected.ipBlock = null;
      $scope.selected.ip = null;
      $scope.ipValid.value = false;
      $scope.oneIp = false;
      $scope.selected.licenseType = null;
      $scope.selected.version = null;
      $scope.selected.options = getResetedOptions();
      $scope.selected.duration = null;
      $scope.loaders.bc = false;
      $scope.durations = getResetedDurations();
      $scope.order = null;
    }
  };

  $scope.durations = getResetedDurations();

  function getWhatToSendFromSelected() {
    if (!$scope.selected.version || !$scope.selected.licenseType) {
      return null;
    }

    return {
      licenseType: $scope.selected.licenseType,
      ip: $scope.selected.ip,
      version: $scope.selected.version.value,
      options: $scope.selected.options[$scope.selected.licenseType],
    };
  }

  $scope.getDuration = function () {
    if (!$scope.loaders.durations && $scope.isSelectionValid()) {
      $scope.loaders.durations = true;
      const asking = getWhatToSendFromSelected();

      return LicenseOrder.getLicenseDurations(asking).then(
        (durations) => {
          if (angular.equals(asking, getWhatToSendFromSelected())) {
            $scope.durations.available = durations;
            loadPrices(asking, durations);
          }

          $scope.loaders.durations = false;
        },
        (data) => {
          $scope.loaders.durations = false;
          Alerter.alertFromSWS($translate.instant('license_order_loading_error'), data.data, $scope.alerts.order);
        },
      );
    }
    return null;
  };

  $scope.contractsValidated = {
    value: null,
  };

  $scope.selectDuration = function () {
    $scope.contractsValidated = {
      value: null,
    };
  };

  $scope.generateBc = function () {
    $scope.loaders.bc = true;
    License.orderLicenseOrderForDuration({
      licenseType: $scope.selected.licenseType,
      ip: $scope.selected.ip,
      version: $scope.selected.version.value,
      options: $scope.selected.options[$scope.selected.licenseType],
      duration: $scope.selected.duration,
    }).then((details) => {
      $scope.order = details;
      $scope.loaders.bc = false;
    });
  };

  $scope.getAgoraUrl = function () {
    const asking = _.assign({ duration: $scope.selected.duration }, getWhatToSendFromSelected());
    $scope.selected.agoraUrl = '';

    $scope.loaders.agoraUrl = true;
    return LicenseOrder.getFinalizeOrderUrl(asking)
      .then((url) => {
        $scope.selected.agoraUrl = url;
      })
      .finally(() => {
        $scope.loaders.agoraUrl = false;
      });
  };

  $scope.openBc = function () {
    window.open($scope.order.url);
  };

  $scope.getBlockDisplay = function (ip) {
    return ip.block + (ip.reverse ? ` (${ip.reverse})` : '');
  };

  $scope.filterBlocks = function () {
    $('#licenseOrderBlockFilters').click();
  };

  $scope.order = null;
});
