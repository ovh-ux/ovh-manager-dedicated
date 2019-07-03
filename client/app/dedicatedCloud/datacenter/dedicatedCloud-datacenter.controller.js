angular
  .module('App')
  .controller('ovhManagerPccDatacenter', class {
    /* @ngInject */
    constructor(
      $scope,
      $stateParams,
      $timeout,
      $transitions,
      $translate,
      $uibModal,
      Alerter,
      coreConfig,
      currentDrp,
      currentService,
      DedicatedCloud,
      dedicatedCloudDrp,
      DEDICATED_CLOUD_DATACENTER,
      DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
      DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.$transitions = $transitions;
      this.$translate = $translate;
      this.$uibModal = $uibModal;
      this.Alerter = Alerter;
      this.coreConfig = coreConfig;
      this.currentDrp = currentDrp;
      this.currentService = currentService;
      this.DedicatedCloud = DedicatedCloud;
      this.dedicatedCloudDrp = dedicatedCloudDrp;
      this.DEDICATED_CLOUD_DATACENTER = DEDICATED_CLOUD_DATACENTER;
      this.DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
      this.DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
      this.DRP_VPN_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS;
    }

    $onInit() {
      this.loadingInformations = true;
      this.loadingError = false;
      this.$scope.datacenter = {
        model: null,
      };
      this.$scope.datacenterDescription = {
        model: null,
        editMode: false,
        loading: false,
      };
      this.$scope.datacenterName = {
        model: null,
        editMode: false,
        loading: false,
      };

      this.$scope.$on('datacenter.informations.reload', () => {
        this.$scope.loadDatacenter();
      });

      this.$scope.editDescription = (value, contextTitle) => this
        .editDescription(value, contextTitle);
      this.$scope.loadDatacenter = () => this.loadDatacenter();
      this.$scope.setAction = (action, data, parent) => this.setAction(action, data, parent);
      this.$scope.resetMessage = () => this.resetMessage();
      this.$scope.setMessage = (message, data) => this.setMessage(message, data);
      this.$scope.resetAction = () => this.resetAction();

      this.initializeTransitions();

      return this.loadDatacenter();
    }

    initializeTransitions() {
      this.$transitions.onStart({
        to: 'app.dedicatedClouds.datacenter.drp.**',
      }, () => {
        this.$scope.loading = true;
      });

      this.$transitions.onError({
        to: 'app.dedicatedClouds.datacenter.drp.**',
      }, ($transition$) => {
        const loadServiceError = _.get($transition$, '_error.detail.data.message', null);
        this.$scope.loading = false;

        if (loadServiceError !== null) {
          this.Alerter.error(
            `${this.$translate.instant('dedicatedCloud_datacenter_drp_get_state_error')} ${loadServiceError}`,
            'dedicatedCloudDatacenterAlert',
          );
        }
      });

      this.$transitions.onSuccess({
        to: 'app.dedicatedClouds.datacenter.drp.**',
      }, () => {
        this.$scope.loading = false;
      });
    }

    loadDatacenter() {
      this.$scope.message = null;

      return Promise.all([
        this.getDatacenterInformations(),
        this.checkForZertoOptionOrder(),
      ]).finally(() => {
        this.loadingInformations = false;
      });
    }

    getDatacenterInformations() {
      return this.DedicatedCloud
        .getDatacenterInformations(
          this.$stateParams.productId,
          this.$stateParams.datacenterId,
          true,
        )
        .then((datacenter) => {
          this.$scope.datacenter.model = datacenter;
          this.$scope.datacenter.model.id = this.$stateParams.datacenterId;
          this.$scope.datacenterDescription.model = angular
            .copy(this.$scope.datacenter.model.description);
          this.$scope.datacenterName.model = angular.copy(this.$scope.datacenter.model.name);
        })
        .catch((data) => {
          this.loadingError = true;
          this.$scope.setMessage(this.$translate.instant('dedicatedCloud_dashboard_loading_error'), angular.extend(data, { type: 'ERROR' }));
        })
        .then(() => this.DedicatedCloud
          .getDescription(this.$stateParams.productId)
          .then((dedicatedCloudDescription) => {
            this.$scope.dedicatedCloud = angular.extend(
              this.$scope.dedicatedCloud || {},
              dedicatedCloudDescription,
            );
          }));
    }

    checkForZertoOptionOrder() {
      return this.dedicatedCloudDrp.checkForZertoOptionOrder(this.currentService.name)
        .then((storedDrpInformations) => {
          let storedDrpStatus = this.DRP_STATUS.disabled;
          if (storedDrpInformations) {
            storedDrpStatus = this.dedicatedCloudDrp.constructor
              .formatStatus(storedDrpInformations.status);
          }

          this.drpStatus = [this.currentDrp.state, storedDrpStatus]
            .find(status => status !== this.DRP_STATUS.disabled)
            || this.DRP_STATUS.disabled;

          this.drpRemotePccStatus = this.currentDrp.drpType === this.DRP_OPTIONS.ovh
            ? this.dedicatedCloudDrp.constructor.formatStatus(_.get(this.currentDrp, 'remoteSiteInformation.state'))
            : this.DRP_STATUS.delivered;
        })
        .catch((error) => {
          this.loadingError = true;
          this.$scope.setMessage(`${this.$translate.instant('dedicatedCloud_datacenter_drp_get_state_error')} ${_.get(error, 'data.message', error.message)}`);
        });
    }

    isDrpActionPossible() {
      return [
        this.DRP_STATUS.delivered,
        this.DRP_STATUS.disabled,
        this.DRP_STATUS.waitingConfiruration,
      ].includes(this.drpStatus);
    }

    /* Update description or name */
    editDescription(value, contextTitle) {
      const context = _.last(contextTitle.split('_'));

      this.$uibModal.open({
        animation: true,
        templateUrl: 'components/name-edition/name-edition.html',
        controller: 'NameEditionCtrl',
        controllerAs: '$ctrl',
        resolve: {
          data: () => ({
            contextTitle,
            datacenterId: this.$stateParams.datacenterId,
            destinationId: this.DEDICATED_CLOUD_DATACENTER.alertId,
            productId: this.$stateParams.productId,
            successText: this.$translate.instant(`dedicatedCloud_datacenter_${context}Modifying_success`),
            value,
          }),
        },
      }).result
        .then((newValue) => {
          if (contextTitle === 'dedicatedCloud_datacenter_name') {
            this.$scope.datacenterName.model = newValue;
          } else {
            this.$scope.datacenterDescription.model = newValue;
          }
        });
    }

    resetAction() {
      this.$scope.setAction(false);
    }

    setMessage(message, data) {
      let messageToSend = message;
      let i = 0;

      this.$scope.alertType = '';
      if (data) {
        if (data.message) {
          messageToSend += ` (${data.message})`;
          switch (data.type) {
            case 'ERROR':
              this.$scope.alertType = 'alert-danger';
              break;
            case 'WARNING':
              this.$scope.alertType = 'alert-warning';
              break;
            case 'INFO':
              this.$scope.alertType = 'alert-success';
              break;
            default:
              this.$scope.alertType = 'alert-warning';
              break;
          }
        } else if (data.messages) {
          if (data.messages.length > 0) {
            switch (data.state) {
              case 'ERROR':
                this.$scope.alertType = 'alert-danger';
                break;
              case 'PARTIAL':
                this.$scope.alertType = 'alert-warning';
                break;
              case 'OK':
                this.$scope.alertType = 'alert-success';
                break;
              default:
                this.$scope.alertType = 'alert-warning';
                break;
            }

            messageToSend += ' (';
            for (i; i < data.messages.length; i += 1) {
              messageToSend += `${data.messages[i].id} : ${data.messages[i].message}${data.messages.length === i + 1 ? ')' : ', '}`;
            }
          }
        } else if (data.idTask && data.state) {
          switch (data.state) {
            case 'BLOCKED':
            case 'blocked':
            case 'CANCELLED':
            case 'cancelled':
            case 'PAUSED':
            case 'paused':
            case 'ERROR':
            case 'error':
              this.$scope.alertType = 'alert-danger';
              break;
            case 'WAITING_ACK':
            case 'waitingAck':
            case 'DOING':
            case 'doing':
              this.$scope.alertType = 'alert-warning';
              break;
            case 'TODO':
            case 'todo':
            case 'DONE':
            case 'done':
              this.$scope.alertType = 'alert-success';
              break;
            default:
              break;
          }
        } else if (data === 'true' || data === true) {
          this.$scope.alertType = 'alert-success';
        }
      }

      this.$scope.message = messageToSend;
    }

    resetMessage() {
      this.$scope.message = null;
    }

    setAction(action, data, parent) {
      if (action) {
        this.$scope.currentAction = action;
        this.$scope.currentActionData = data;

        if (parent) {
          this.$scope.stepPath = `dedicatedCloud/${this.$scope.currentAction}.html`;
        } else {
          this.$scope.stepPath = `dedicatedCloud/${this.$scope.currentAction}.html`;
        }

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

    deleteDrp() {
      return this.$uibModal.open({
        templateUrl: '/client/app/dedicatedCloud/dedicatedCloud-datacenter-drp-delete.html',
        controller: 'DedicatedCloudDatacenterDrpDeleteCtrl',
        controllerAs: '$ctrl',
        resolve: {
          drpInformations: () => this.currentDrp,
        },
      }).result
        .then(() => {
          this.Alerter.success(this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_delete_drp_success'), 'dedicatedCloud_alert');
          return this.$state.go('app.dedicatedClouds.datacenter');
        })
        .catch((error) => {
          if (error != null) {
            this.Alerter.error(this.$translate.instant(`${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_delete_drp_error')} ${_.get(error, 'message', '')}`), 'dedicatedCloud_alert');
          }
        });
    }
  });
