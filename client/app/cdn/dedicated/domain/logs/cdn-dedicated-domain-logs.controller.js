angular.module('App').controller('CdnDomainTabLogsCtrl',
  class CdnDomainTabLogsCtrl {
    constructor($scope, $stateParams, cdnDedicatedDomainLogs, OvhTailLogs) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.OvhTailLogs = OvhTailLogs;
      this.cdnDedicatedDomainLogs = cdnDedicatedDomainLogs;
    }

    $onInit() {
      this.logger = new this.OvhTailLogs({
        source: () => this.cdnDedicatedDomainLogs
          .getLogs(this.$stateParams.productId, this.$stateParams.domain)
          .then(logs => logs.url),
        delay: 2000,
      });

      this.startLog();
    }

    $onDestroy() {
      this.logger.stop();
    }

    stopLog() {
      this.logger.stop();
    }

    startLog() {
      this.logger.log();
    }

    getLogs() {
      this.logger = this.logger.logs;
      return this.logger;
    }
  });
