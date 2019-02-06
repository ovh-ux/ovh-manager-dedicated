angular.module('App').controller('AddAccessFtpBackupCtrl', class AddAccessFtpBackupCtrl {
  constructor($rootScope, $scope, $stateParams, $translate, Alerter, Server) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Server = Server;
  }

  $onInit() {
    this.access = {
      listIp: [],
      ip: null,
      ftp: false,
      cifs: false,
      nfs: false,
    };

    this.loading = false;
  }

  load() {
    return () => {
      this.loading = true;
      return this.Server.getAuthorizableBlocks(this.$stateParams.productId)
        .then((list) => {
          this.access.listIp = list;
        })
        .catch(({ data }) => {
          this.$scope.resetAction();
          this.Alerter.alertFromSWS(this.$translate.instant('server_configuration_ftpbackup_access_add_ip_failure'), data, 'server_tab_ftpbackup_alert');
        })
        .finally(() => {
          this.loading = false;
        });
    };
  }

  addFtpBackup() {
    return () => {
      const resultMessages = {
        OK: this.$translate.instant('server_configuration_ftpbackup_access_add_success'),
        PARTIAL: this.$translate.instant('server_configuration_ftpbackup_access_add_partial'),
        ERROR: this.$translate.instant('server_configuration_ftpbackup_access_add_failure'),
      };

      this.loading = true;

      return this.Server.postFtpBackupIp(
        this.$stateParams.productId,
        this.access.ip,
        this.access.ftp,
        this.access.nfs,
        this.access.cifs,
      )
        .then((data) => {
          data.results.forEach((task) => {
            this.$rootScope.$broadcast('dedicated.ftpbackup.task.refresh', task);
          });
          this.$rootScope.$broadcast('server.ftpBackup.access.load');
          this.Alerter.alertFromSWSBatchResult(resultMessages, data, 'server_tab_ftpbackup_alert');
        })
        .catch((data) => {
          this.Alerter.alertFromSWSBatchResult(resultMessages, data, 'server_tab_ftpbackup_alert');
        })
        .finally(() => {
          this.$scope.resetAction();
          this.loading = false;
        });
    };
  }

  isIpBlocksLengthValid() {
    const IP_BLOCKS_MAX_LENGTH = 1024;
    if (this.access.ip) {
      return this.access.ip.join('').length <= IP_BLOCKS_MAX_LENGTH;
    }
    return true;
  }
});
