export default class {
  /* @ngInject */
  constructor($rootScope, $scope, $translate, Server, Alerter) {
    this.setMessage = $scope.setMessage;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.Server = Server;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.loader = {
      loading: true,
    };
  }

  cancelOption() {
    this.loader.loading = true;

    this.Server.cancelBandwidthOption(this.serverName)
      .then(() => {
        this.setMessage(this.$translate.instant('server_cancel_bandwidth_cancel_success'), true);
        this.$rootScope.$broadcast('dedicated.informations.bandwidth');
      })
      .catch((data) => {
        _.set(data, 'type', 'ERROR');
        this.setMessage(this.$translate.instant('server_cancel_bandwidth_cancel_error'), data);
      })
      .finally(() => {
        this.loader.loading = false;
        this.goBack();
      });
  }
}
