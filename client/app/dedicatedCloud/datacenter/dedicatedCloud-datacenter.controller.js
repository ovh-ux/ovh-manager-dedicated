angular
  .module('App')
  .controller('DedicatedCloudSubDatacenterCtrl', class {
    constructor(
      $scope,
      $stateParams,
      $timeout,
      $translate,
      $uibModal,
      DedicatedCloud,
      DEDICATED_CLOUD_DATACENTER,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.$translate = $translate;
      this.$uibModal = $uibModal;
      this.DedicatedCloud = DedicatedCloud;
      this.DEDICATED_CLOUD_DATACENTER = DEDICATED_CLOUD_DATACENTER;
    }

    $onInit() {
      this.$scope.loadingInformations = true;
      this.$scope.loadingError = false;
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
      this.$scope.setMessage = (message, data) => this.setMessage(message, data);
      this.$scope.resetAction = () => this.resetAction();

      return this.loadDatacenter();
    }

    loadDatacenter() {
      this.$scope.message = null;

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
          this.$scope.loadingInformations = false;
        })
        .catch((data) => {
          this.$scope.loadingInformations = false;
          this.$scope.loadingError = true;
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

    /* Update description or name */
    editDescription(value, contextTitle) {
      this.$uibModal.open({
        animation: true,
        templateUrl: 'components/name-edition/name-edition.html',
        controller: 'NameEditionCtrl',
        controllerAs: '$ctrl',
        resolve: {
          data: () => ({
            contextTitle,
            datacenterId: this.$stateParams.datacenterId,
            productId: this.$stateParams.productId,
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
  });
