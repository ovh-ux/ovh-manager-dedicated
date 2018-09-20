angular.module('Module.ip.controllers').controller('IpOrderCtrl', ($scope, $rootScope, $q, $translate, Ip, IpOrder, IpOrganisation, User, Alerter, constants) => {
  const alertId = 'ip_order_alert';

  $scope.model = {};
  $scope.user = {};
  $scope.agree = {
    value: false,
  };

  $scope.loading = {};

  /*= =============================
=            STEP 1            =
============================== */

  $scope.getServices = function () {
    $scope.loading.services = true;
    $q.all({
      servicesList: IpOrder.getServicesByType(),
      user: User.getUser(),
    }).then((results) => {
      $scope.servicesList = results.servicesList;
      $scope.user = results.user;
    }).catch((err) => {
      Alerter.alertFromSWS($translate.instant('ip_order_loading_error'), err);
    }).finally(() => {
      $scope.loading.services = false;
    });
  };

  $scope.serviceCanBeOrdered = function () {
    $scope.loading.serviceCanBeOrdered = true;
    $scope.orderableIp = null;
    $scope.orderableIpError = null;

    // First, check if option can be ordered
    IpOrder.checkIfAllowed($scope.model.service, 'ip')
      .then((serviceAllowed) => {
        if (!serviceAllowed) {
          $scope.orderableIpError = 'OPTION_NOT_ALLOWED';
          $scope.loading.serviceCanBeOrdered = false;
          return null;
        }
        return IpOrder.getServiceOrderableIp($scope.model.service);
      })
      .then((infos) => {
        if (!infos) {
          $scope.orderableIpError = 'OUT';
          return;
        }

        if ($scope.model.service.serviceType === 'DEDICATED' && !((infos.ipv4 && infos.ipv4.length) || (infos.ipv6 && infos.ipv6.length))) {
          $scope.orderableIpError = 'OPTION_NOT_ALLOWED';
          return;
        }

        $scope.orderableIp = infos;
      })
      .catch((data) => {
        if (data.status === 460) {
          $scope.orderableIpError = 'EXPIRED';
        } else {
          $scope.loading.serviceCanBeOrdered = false;
          Alerter.alertFromSWS($translate.instant('ip_order_loading_error'), data.data);
        }
      })
      .finally(() => {
        $scope.loading.serviceCanBeOrdered = false;
      });
  };

  /* ==============================
    =            STEP 2            =
    ============================== */

  $scope.loadOrderForm = function () {
    const queue = [];
    $scope.loading.form = true;

    // Reset model params!
    $scope.model.params = {};

    if ($scope.model.service.serviceType === 'DEDICATED') {
      $scope.model.params.type = 'failover';
    }

    queue.push(
      IpOrder.getAvailableCountries($scope.model.service).then((countries) => {
        $scope.orderableIp.countries = countries;
        $scope.isCanadianService = _.findIndex(countries, 'CA') !== -1 || countries.indexOf('us') !== -1;
        if (!$scope.isCanadianService) {
          $scope.ipShortageWarnUrl = $translate.use() === 'fr_FR' ? constants.urls.FR.ipShortageWarnUrl : constants.urls.GB.ipShortageWarnUrl;
        }
      }),
    );

    if ($scope.model.service.serviceType === 'PCC') {
      queue.push(
        Ip.getOrderModels().then((models) => {
          $scope.orderableIp.size = models['dedicatedCloud.OrderableIpBlockRangeEnum'].enum;
        }),
      );
    } else if ($scope.model.service.serviceType === 'DEDICATED') {
      // Check if it is a BHS server
      queue.push(
        IpOrder.checkIfCanadianServer($scope.model.service.serviceName).then((isCanadianServer) => {
          $scope.orderableIp.isCanadianServer = isCanadianServer;
        }),
      );

      queue.push(
        IpOrganisation.getIpOrganisation().then((organisations) => {
          $scope.orderableIp.ipOrganisation = organisations;
        }),
      );
    }

    $q.all(queue).then(
      () => {
        $scope.loading.form = false;
      },
      (data) => {
        Alerter.alertFromSWS($translate.instant('ip_order_loading_error'), data.data ? data.data : data);
        $scope.loading.form = false;
      },
    );
  };

  $scope.isMonthlyVps = function () {
    return $scope.model.service.serviceType === 'VPS' ? $scope.orderableIp && $scope.orderableIp.vpsInfos.model && $scope.orderableIp.vpsInfos.model.version !== '2015v1' : false;
  };

  $scope.orderFormValid = function () {
    if (!$scope.orderableIp
      || !$scope.model.service
      || !$scope.model.service.serviceType
      || !$scope.model.params) {
      return false;
    }
    switch ($scope.model.service.serviceType) {
      case 'DEDICATED':
        if (!$scope.model.params.blockSize
          || ($scope.orderableIp.isCanadianServer
            ? $scope.model.params.blockSize === 1 && !$scope.model.params.country
            : !$scope.model.params.country)) {
          return false;
        } if ($scope.model.params.blockSize > 1 && !$scope.orderableIp.isCanadianServer) {
          // No orga in CA
          return !!$scope.model.params.organisationId;
        }
        return true;
      case 'PCC':
        return (
          $scope.model.params.size
            && $scope.model.params.country
            && $scope.model.params.networkName
            && /^[a-zA-Z]+\w+$/.test($scope.model.params.networkName)
            && $scope.model.params.estimatedClientsNumber
            && $scope.model.params.description
            && $scope.model.params.usage
        );
      case 'VPS':
        return $scope.model.params.country && $scope.model.params.number;
      default:
        return null;
    }
  };

  $scope.checkDedicatedBlockSize = function () {
    if ($scope.model.params && $scope.model.params.blockSize === 1) {
      delete $scope.model.params.organisationId;
    }
  };

  $scope.orderOrganisation = function () {
    $rootScope.$broadcast('ips.display', 'organisation');
    $scope.resetAction();
  };

  /*= =============================
=            STEP 3            =
============================== */

  function loadPrices(durations) {
    const queue = [];
    $scope.loading.prices = true;

    angular.forEach(durations, (duration) => {
      queue.push(
        IpOrder
          .getOrderForDuration($scope.model.service, $scope.model.params, duration)
          .then((details) => {
            $scope.durations.details[duration] = details;
          }),
      );
    });

    $q.all(queue).then(() => {
      if (durations && durations.length === 1) {
        $scope.model.duration = _.first(durations);
      }
      $scope.loading.prices = false;
    });
  }


  $scope.getDurations = function () {
    const queue = [];
    let needProfessionalUse = false;
    Alerter.resetMessage(alertId);

    $scope.durations = {
      available: null,
      details: {},
    };
    $scope.model.duration = null;
    $scope.orderableIp.professionalUsePrice = null;
    $scope.loading.durations = true;

    if ($scope.orderableIp.isCanadianServer && $scope.model.params.blockSize > 1) {
      $scope.model.params.country = _.first($scope.orderableIp.countries) || 'ca'; // Forced :'( ...
    }

    queue.push(
      IpOrder.getOrder($scope.model.service, $scope.model.params).then((durations) => {
        $scope.durations.available = durations;
        loadPrices(durations);
      }),
    );

    if ($scope.model.service.serviceType === 'DEDICATED') {
      angular.forEach($scope.orderableIp.ipv4, (ip) => {
        if (ip.blockSizes && ip.blockSizes.length && ~ip.blockSizes.indexOf($scope.model.params.blockSize) && ip.optionRequired === 'professionalUse') {
          needProfessionalUse = true;
        }
      });
      if (needProfessionalUse) {
        queue.push(
          IpOrder.getProfessionalUsePrice($scope.model.service.serviceName).then((price) => {
            $scope.orderableIp.professionalUsePrice = price;
          }),
        );
      }
    }

    $q.all(queue).then(
      () => {
        $scope.loading.durations = false;
      },
      (err) => {
        Alerter.error($translate.instant('ip_order_loading_error2', {
          t0: err.data ? err.data.message : err.message,
        }), alertId);

        $scope.loading.durations = false;
      },
    );
  };

  /*= =============================
=            STEP 4            =
============================== */

  $scope.loadContracts = function () {
    $scope.agree.value = false;
    if (!$scope.durations.details[$scope.model.duration].contracts
      || !$scope.durations.details[$scope.model.duration].contracts.length) {
      $rootScope.$broadcast('wizard-goToStep', 6);
    }
  };

  $scope.backToContracts = function () {
    if (!$scope.durations.details[$scope.model.duration].contracts
      || !$scope.durations.details[$scope.model.duration].contracts.length) {
      $rootScope.$broadcast('wizard-goToStep', 3);
    }
  };

  /*= =============================
=            STEP 5            =
============================== */

  $scope.getResumePrice = function (price) {
    return price.value === 0
      ? $translate.instant('price_free')
      : $translate.instant('price_ht_label', { t0: price.text });
  };

  $scope.confirmOrder = function () {
    $scope.loading.validation = true;
    IpOrder.postOrder($scope.model.service, $scope.model.params, $scope.model.duration)
      .then(
        (order) => {
          Alerter.alertFromSWS($translate.instant('ip_order_finish_success', {
            t0: order.url,
            t1: order.orderId,
          }), { idTask: order.orderId, state: 'OK' });
          window.open(order.url, '_blank');
        },
        (data) => {
          Alerter.alertFromSWS($translate.instant('ip_order_finish_error'), data.data);
        },
      )
      .finally(() => {
        $scope.resetAction();
      });
  };
});
