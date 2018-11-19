angular.module('App').controller('DedicatedCloudCtrl', [
  '$log',
  '$q',
  '$scope',
  '$state',
  '$stateParams',
  '$timeout',
  '$translate',
  '$uibModal',
  'DedicatedCloud',
  'DucNotification',
  'featureAvailability',
  'OvhApiDedicatedCloud',
  'step',
  'User',
  function (
    $log,
    $q,
    $scope,
    $state,
    $stateParams,
    $timeout,
    $translate,
    $uibModal,
    DedicatedCloud,
    DucNotification,
    featureAvailability,
    OvhApiDedicatedCloud,
    step,
    User,
  ) {
    $scope.HDS_READY_NOTIFICATION = 'HDS_READY_NOTIFICATION';

    $scope.alerts = { dashboard: 'dedicatedCloud_alert' };
    $scope.loadingInformations = true;
    $scope.loadingError = false;
    $scope.dedicatedCloud = null;
    $scope.featureAvailability = featureAvailability;

    $scope.notifications = {
      HDS_READY_NOTIFICATION: false,
    };

    $scope.dedicatedCloudDescription = {
      model: null,
      editMode: false,
      loading: false,
    };

    $scope.discount = {
      AMDPCC: false,
    };

    $scope.dedicatedCloud = {};

    function showNotificationIfRequired(notification) {
      DucNotification.checkIfStopNotification(notification, $stateParams.productId)
        .then((stopNotification) => {
          $scope.notifications[notification] = !stopNotification;
        })
        .catch((error) => {
          $scope.notifications[notification] = true;
          $log.error(error);
        });
    }

    function loadNewPrices() {
      return DedicatedCloud.getNewPrices($stateParams.productId).then((newPrices) => {
        $scope.newPriceInformation = newPrices.resources;
        $scope.hasChangePrices = newPrices.resources
          .filter(resource => resource.changed === true).length > 0;
      });
    }

    function loadUserInfo() {
      return User.getUser().then((user) => {
        $scope.dedicatedCloud.email = user.email;
      });
    }

    $scope.loadDedicatedCloud = function () {
      $scope.message = null;
      DedicatedCloud.getSelected($stateParams.productId, true)
        .then((dedicatedCloud) => {
          Object.assign($scope.dedicatedCloud, dedicatedCloud);
          $scope.dedicatedCloud.isExpired = dedicatedCloud.status === 'expired';
          if ($scope.dedicatedCloud.isExpired) {
            $scope.setMessage($translate.instant('common_expired'), { type: 'cancelled' });
          }
          $scope.dedicatedCloudDescription.model = angular.copy($scope.dedicatedCloud.description);
          loadNewPrices();
          loadUserInfo();
          $scope.showHdsReadyNotificationIfRequired($scope.HDS_READY_NOTIFICATION);
        })
        .catch((data) => {
          $scope.loadingError = true;
          $scope.setMessage($translate.instant('dedicatedCloud_dashboard_loading_error'), { message: data.message, type: 'ERROR' });
        })
        .finally(() => {
          $scope.loadingInformations = false;
        });
      DedicatedCloud.getDescription($stateParams.productId).then((dedicatedCloudDescription) => {
        Object.assign($scope.dedicatedCloud, dedicatedCloudDescription);
      });

      OvhApiDedicatedCloud.v6().getServiceInfos({
        serviceName: $stateParams.productId,
      }).$promise.then((serviceInformations) => {
        $scope.dedicatedCloud.serviceInfos = serviceInformations;
      });
    };

    $scope.$on('dedicatedcloud.informations.reload', () => {
      $scope.loadingInformations = true;
      $scope.loadDedicatedCloud();
    });

    $scope.editDescription = function (value) {
      const modal = $uibModal.open({
        animation: true,
        templateUrl: 'components/name-edition/name-edition.html',
        controller: 'NameEditionCtrl',
        controllerAs: '$ctrl',
        resolve: {
          data() {
            return {
              contextTitle: 'dedicatedCloud_description',
              productId: $stateParams.productId,
              value,
            };
          },
        },
      });

      modal.result.then((newDescription) => {
        $scope.dedicatedCloud.description = newDescription;
      });
    };

    $scope.getRight = function (order) {
      return $scope.dedicatedCloud
        ? $.inArray(order, $scope.dedicatedCloud.orderRight) === -1
        : false;
    };

    // Action + message

    $scope.resetAction = function () {
      $scope.setAction(false);
    };

    $scope.$on('$locationChangeStart', () => {
      $scope.resetAction();
    });

    $scope.setMessage = function (message, data) {
      let messageToSend = message;

      if (!data && !$scope.dedicatedCloud.isExpired) {
        $scope.message = messageToSend;
        return;
      }

      let errorType = '';
      if (data.type && !(data.idTask || data.taskId)) {
        errorType = data.type;
      } else if (data.state) {
        errorType = data.state;
      }

      switch (errorType.toLowerCase()) {
        case 'blocked':
        case 'cancelled':
        case 'paused':
        case 'error':
          $scope.alertType = 'alert-danger';
          break;
        case 'waiting_ack':
        case 'waitingack':
        case 'doing':
        case 'warning':
        case 'partial':
          $scope.alertType = 'alert-warning';
          break;
        case 'todo':
        case 'done':
        case 'info':
        case 'ok':
          $scope.alertType = 'alert-success';
          break;
        default:
          $scope.alertType = 'alert-success';
          break;
      }

      if (data.message) {
        messageToSend += ` (${data.message})`;
      } else if (_.some(data.messages)) {
        const messageParts = _.map(data.messages, _message => `${_message.id} : ${_message.message}`);
        messageToSend = ` (${messageParts.join(', ')})`;
      }

      $scope.message = messageToSend;
    };

    $scope.setAction = function (action, data) {
      if (action) {
        $scope.currentAction = action;
        $scope.currentActionData = data;

        $scope.stepPath = `dedicatedCloud/${$scope.currentAction}.html`;

        $('#currentAction').modal({
          keyboard: true,
          backdrop: 'static',
        });
      } else {
        $('#currentAction').modal('hide');
        $scope.currentActionData = null;
        $timeout(() => {
          $scope.stepPath = '';
        }, 300);
      }
    };

    $scope.contactMeForHds = function () {
      User.getUser()
        .then((user) => {
          /* eslint-disable */
                    const message = `New HDS prospect ${user.nichandle}`;
                    const ticket = {
                        subject: message,
                        type: "genericRequest",
                        body: message,
                        serviceName: $stateParams.productId
                    };

                    // return Otrs.postTicket(ticket);
                    /* eslint-enable */
        })
        .then(() => {
          $scope.stopNotification($scope.HDS_READY_NOTIFICATION);
          $scope.setMessage($translate.instant('dedicatedCloud_contact_me_success'));
        })
        .catch((error) => {
          $scope.setMessage($translate.instant('dedicatedCloud_contact_me_fail'), { message: error.message, type: 'ERROR' });
          $log.error(error);
        });
    };

    $scope.stopNotification = function (notificationType) {
      $scope.notifications[notificationType] = false;
      DucNotification.stopNotification($scope.HDS_READY_NOTIFICATION, $stateParams.productId);
    };

    $scope.showHdsReadyNotificationIfRequired = function (notification) {
      if (_.startsWith($scope.dedicatedCloud.commercialRange.startsWith, '2014') || _.startsWith($scope.dedicatedCloud.commercialRange, '2016')) {
        showNotificationIfRequired(notification);
      }
    };

    $scope.getUserAccessPolicyLabel = function () {
      const policy = _.get($scope, 'dedicatedCloud.userAccessPolicy');
      if (policy) {
        return $translate.instant(`dedicatedCloud_user_access_policy_${_.snakeCase(policy).toUpperCase()}`);
      }
      return '-';
    };

    $scope.loadDedicatedCloud();
  },
]);
