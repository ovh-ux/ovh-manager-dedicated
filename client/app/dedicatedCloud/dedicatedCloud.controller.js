angular
  .module('App')
  .controller(
    'DedicatedCloudCtrl',
    class {
      /* @ngInject */
      constructor(
        $log,
        $q,
        $scope,
        $state,
        $stateParams,
        $timeout,
        $translate,
        $uibModal,

        constants,
        currentService,
        currentUser,
        DedicatedCloud,
        DucNotification,
        OvhApiDedicatedCloud,
        step,
        User,
      ) {
        this.$log = $log;
        this.$q = $q;
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$timeout = $timeout;
        this.$translate = $translate;
        this.$uibModal = $uibModal;

        this.constants = constants;
        this.currentService = currentService;
        this.currentUser = currentUser;
        this.DedicatedCloud = DedicatedCloud;
        this.DucNotification = DucNotification;
        this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
        this.step = step;
        this.User = User;
      }

      $onInit() {
        this.$scope.HDS_READY_NOTIFICATION = 'HDS_READY_NOTIFICATION';

        this.$scope.alerts = { dashboard: 'dedicatedCloud_alert' };
        this.$scope.loadingInformations = true;
        this.$scope.loadingError = false;
        this.$scope.dedicatedCloud = null;

        this.$scope.notifications = {
          HDS_READY_NOTIFICATION: false,
        };

        this.$scope.dedicatedCloudDescription = {
          model: null,
          editMode: false,
          loading: false,
        };

        this.$scope.discount = {
          AMDPCC: false,
        };

        this.$scope.dedicatedCloud = {};

        this.$scope.$on(
          'dedicatedcloud.informations.reload',
          () => {
            this.$scope.loadingInformations = true;
            this.$scope.loadDedicatedCloud();
          },
        );

        this.$scope.$on(
          '$locationChangeStart',
          () => {
            this.$scope.resetAction();
          },
        );

        this.$scope.$on('dedicatedCloud.setMessage', (event, { message, type }) => this.setMessage(message, { type }));

        this.$scope.loadDedicatedCloud = () => this.loadDedicatedCloud();
        this.$scope.editDescription = value => this.editDescription(value);
        this.$scope.getRight = order => this.getRight(order);
        this.$scope.resetAction = () => this.resetAction();
        this.$scope.setMessage = (message, data) => this.setMessage(message, data);
        this.$scope.setAction = (action, data) => this.setAction(action, data);
        this.$scope.stopNotification = notificationType => this.stopNotification(notificationType);
        this.$scope.showHdsReadyNotificationIfRequired = notification => this
          .showHdsReadyNotificationIfRequired(notification);
        this.$scope.getUserAccessPolicyLabel = () => this.getUserAccessPolicyLabel();

        return this.loadDedicatedCloud();
      }

      showNotificationIfRequired(notification) {
        return this.DucNotification
          .checkIfStopNotification(
            notification,
            this.$stateParams.productId,
          )
          .then((stopNotification) => {
            this.$scope.notifications[notification] = !stopNotification;
          })
          .catch((error) => {
            this.$scope.notifications[notification] = true;
            this.$log.error(error);
          });
      }

      loadNewPrices() {
        return this.DedicatedCloud
          .getNewPrices(this.$stateParams.productId)
          .then((newPrices) => {
            this.$scope.newPriceInformation = newPrices.resources;
            this.$scope.hasChangePrices = newPrices.resources
              .filter(resource => resource.changed === true).length > 0;
          });
      }

      loadUserInfo() {
        return this.User
          .getUser()
          .then((user) => {
            this.$scope.dedicatedCloud.email = user.email;
          });
      }

      loadDedicatedCloud() {
        this.$scope.message = null;

        return this.DedicatedCloud
          .getSelected(
            this.$stateParams.productId,
            true,
          )
          .then((dedicatedCloud) => {
            Object.assign(
              this.$scope.dedicatedCloud,
              dedicatedCloud,
            );

            this.$scope.dedicatedCloud.isExpired = dedicatedCloud.status === 'expired';

            if (this.$scope.dedicatedCloud.isExpired) {
              this.$scope.setMessage(
                this.$translate.instant('common_expired'),
                { type: 'cancelled' },
              );
            }

            this.$scope.dedicatedCloudDescription.model = angular
              .copy(this.$scope.dedicatedCloud.description);
            this.loadNewPrices();
            this.loadUserInfo();
            this.$scope.showHdsReadyNotificationIfRequired(this.$scope.HDS_READY_NOTIFICATION);
          })
          .catch((data) => {
            this.$scope.loadingError = true;
            this.$scope.setMessage(
              this.$translate.instant('dedicatedCloud_dashboard_loading_error'),
              {
                message: data.message,
                type: 'ERROR',
              },
            );
          })
          .finally(() => {
            this.$scope.loadingInformations = false;
          })
          .then(() => this.DedicatedCloud.getDescription(this.$stateParams.productId))
          .then((dedicatedCloudDescription) => {
            Object.assign(
              this.$scope.dedicatedCloud,
              dedicatedCloudDescription,
            );
          })
          .finally(() => null)
          .then(() => this.OvhApiDedicatedCloud
            .v6()
            .getServiceInfos({ serviceName: this.$stateParams.productId })
            .$promise)
          .then((serviceInformations) => {
            this.$scope.dedicatedCloud.serviceInfos = serviceInformations;
          });
      }

      editDescription(value) {
        const modal = this.$uibModal.open({
          animation: true,
          templateUrl: 'components/name-edition/name-edition.html',
          controller: 'NameEditionCtrl',
          controllerAs: '$ctrl',
          resolve: {
            data: () => ({
              contextTitle: 'dedicatedCloud_description',
              productId: this.$stateParams.productId,
              value,
            }),
          },
        });

        modal.result.then((newDescription) => {
          this.$scope.dedicatedCloud.description = newDescription;
        });
      }

      getRight(order) {
        return this.$scope.dedicatedCloud
          ? $.inArray(
            order,
            this.$scope.dedicatedCloud.orderRight,
          ) === -1
          : false;
      }

      // Action + message
      resetAction() {
        this.$scope.setAction(false);
      }

      setMessage(message, data) {
        let messageToSend = message;

        if (!data && !this.$scope.dedicatedCloud.isExpired) {
          this.$scope.alertType = 'alert-success';
          this.$scope.message = messageToSend;
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
            this.$scope.alertType = 'alert-danger';
            break;
          case 'waiting_ack':
          case 'waitingack':
          case 'doing':
          case 'warning':
          case 'partial':
            this.$scope.alertType = 'alert-warning';
            break;
          case 'todo':
          case 'done':
          case 'info':
          case 'ok':
            this.$scope.alertType = 'alert-success';
            break;
          default:
            this.$scope.alertType = 'alert-success';
            break;
        }

        if (data.message) {
          messageToSend += ` (${data.message})`;
        } else if (_.some(data.messages)) {
          const messageParts = _.map(
            data.messages,
            _message => `${_message.id} : ${_message.message}`,
          );
          messageToSend = ` (${messageParts.join(', ')})`;
        }

        this.$scope.message = messageToSend;
      }

      setAction(action, data) {
        if (action) {
          this.$scope.currentAction = action;
          this.$scope.currentActionData = data;

          this.$scope.stepPath = `dedicatedCloud/${this.$scope.currentAction}.html`;

          $('#currentAction').modal({
            keyboard: true,
            backdrop: 'static',
          });
        } else {
          $('#currentAction').modal('hide');
          this.$scope.currentActionData = null;
          this.$timeout(() => {
            this.$scope.stepPath = '';
          }, 300);
        }
      }

      stopNotification(notificationType) {
        this.$scope.notifications[notificationType] = false;

        this.DucNotification.stopNotification(
          this.$scope.HDS_READY_NOTIFICATION,
          this.$stateParams.productId,
        );
      }

      showHdsReadyNotificationIfRequired(notification) {
        if (_.startsWith(this.$scope.dedicatedCloud.commercialRange.startsWith, '2014') || _.startsWith(this.$scope.dedicatedCloud.commercialRange, '2016')) {
          this.showNotificationIfRequired(notification);
        }
      }

      getUserAccessPolicyLabel() {
        const policy = _.get(
          this.$scope,
          'dedicatedCloud.userAccessPolicy',
        );

        if (policy) {
          return this.$translate.instant(`dedicatedCloud_user_access_policy_${_.snakeCase(policy).toUpperCase()}`);
        }

        return '-';
      }
    },
  );
