angular.module('Module.license').controller('LicenseOrderDedicatedCtrl', (
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

  const getOrderableVersion = function () {
    $scope.loaders.orderableVersion = true;

    LicenseOrder.LicenseAgoraOrder.getDedicatedAddonLicenses(_.get($scope, 'selected.ipBlock')).then((data) => {
      $scope.types = _.chain(data)
        .filter((license) => {
          const type = license.family.toUpperCase();
          return _.has(LicenseOrder.LicenseAgoraOrder.licenseTypeToCatalog, type);
        })
        .groupBy(license => _.first(license.planCode.split('-')).toUpperCase())
        .value();
      $scope.nbLicence.value = _.values($scope.types).length || 0;
    }).catch(() => {
      $scope.selectedType = {
        value: null,
      };
      $scope.nbLicence.value = _.values($scope.types).length || 0;
    }).finally(() => {
      $scope.loaders.orderableVersion = false;
    });
  };

  function isDomainNumberMandatory() {
    return _.get($scope.selected, 'version.options', []).length > 0;
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
        && !$scope.loaders.prices) {
      $scope.selected.licenseType = type;
      $scope.selected.version = null;
      [$scope.selected.version] = type;
      $scope.selected.duration = null;
      $scope.selected.agoraUrl = '';
      $scope.loaders.bc = false;
      $scope.order = null;
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

  $scope.$watch(
    'selected.version',
    () => {
      $scope.selected.options = getResetedOptions();
      $scope.selected.duration = null;
      $scope.loaders.bc = false;
      $scope.order = null;
      $scope.durations = getResetedDurations();
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

  $scope.durations = getResetedDurations();

  $scope.contractsValidated = {
    value: null,
  };

  $scope.selectDuration = function () {
    $scope.contractsValidated = {
      value: null,
    };
  };

  $scope.getAgoraUrl = function () {
    $scope.loaders.agoraUrl = true;
    const expressParams = {
      productId: 'dedicated',
      serviceName: _.get($scope.selected, 'ipBlock.serviceName'),
      planCode: _.get($scope.selected, 'licenseType[0].planCode'),
      duration: _.get($scope.selected, 'duration.duration'),
      pricingMode: _.get($scope.selected, 'duration.pricingMode'),
      quantity: 1,
    };

    return User.getUrlOf('express_order_resume')
      .then((url) => {
        $scope.selected.agoraUrl = `${url}?products=${JSURL.stringify([expressParams])}`;
      })
      .catch(err => Alerter.alertFromSWS($translate.instant('license_order_loading_error'), err, $scope.alerts.order))
      .finally(() => {
        $scope.loaders.agoraUrl = false;
      });
  };

  $scope.getBlockDisplay = function (ip) {
    return ip.block + (ip.reverse ? ` (${ip.reverse})` : '');
  };

  $scope.filterBlocks = function () {
    $('#licenseOrderBlockFilters').click();
  };

  $scope.order = null;
  init();
});
