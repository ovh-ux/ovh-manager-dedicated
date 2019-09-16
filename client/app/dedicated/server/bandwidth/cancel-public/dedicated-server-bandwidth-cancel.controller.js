export default class {
  /* @ngInject */
  constructor(
    $rootScope,
    $state,
    $scope,
    $translate,
    Server,
    Alerter,
  ) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$state = $state;
    this.$translate = $translate;
    this.Server = Server;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.$scope.loader = {
      loading: true,
    };

    this.$scope.cancel = () => this.$state.go('^');

    this.$scope.cancelOption = () => {
      this.$scope.loader.loading = true;

      this.Server.cancelBandwidthOption(this.serverName)
        .then(() => {
          this.$scope.setMessage(this.$translate.instant('server_cancel_bandwidth_cancel_success'), true);
          this.$rootScope.$broadcast('dedicated.informations.bandwidth');
        })
        .catch((data) => {
          _.set(data, 'type', 'ERROR');
          this.$scope.setMessage(this.$translate.instant('server_cancel_bandwidth_cancel_error'), data);
        })
        .finally(() => {
          this.$state.go('^');
          this.$scope.loader.loading = false;
        });
    };
  }
}
