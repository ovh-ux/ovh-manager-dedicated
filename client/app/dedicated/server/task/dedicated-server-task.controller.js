angular.module('App')
  .controller('TaskCtrl', class DedicatedServerTaskController {
    constructor($scope, $stateParams, $translate, Alerter, Server) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Server = Server;
    }

    $onInit() {
      this.isServiceExpired = false;
    }

    loadDatagridTasks({ offset, pageSize }) {
      const serviceExpiredErrorCode = 460;
      return this.Server.getTasks(this.$stateParams.productId, pageSize, offset - 1)
        .then(result => ({
          data: _.get(result, 'list.results'),
          meta: {
            totalCount: result.count,
          },
        }))
        .catch((error) => {
          if (error.code === serviceExpiredErrorCode) {
            this.isServiceExpired = true;
            this.Alerter.error(this.$translate.instant('server_configuration_service_expired'), 'taskAlert');
          } else {
            this.Alerter.alertFromSWS(this.$translate.instant('server_configuration_task_loading_error'), error, 'dedicatedServerTaskAlert');
          }
        });
    }
  });
