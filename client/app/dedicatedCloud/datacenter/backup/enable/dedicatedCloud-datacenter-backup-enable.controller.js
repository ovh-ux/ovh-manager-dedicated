angular.module('App').controller('DedicatedCloudSubDatacenterVeeamBackupEnableCtrl', class {
  constructor($q, $stateParams, $state, $translate, Alerter, DedicatedCloud) {
    // dependencies injections
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.DedicatedCloud = DedicatedCloud;

    // controller attributes
    this.loading = {
      init: false,
      enable: false,
    };

    this.datacenter = null;
    this.hosts = null;
  }

  /* =============================
    =            EVENTS            =
    ============================== */

  onConfirmBtnClick() {
    if (!this.hosts.length) {
      return this.onCancelBtnClick();
    }

    this.loading.enable = true;

    return this.DedicatedCloud
      .enableVeeam(this.$stateParams.productId, this.$stateParams.datacenterId)
      .then(() => {
        this.Alerter.success(this.$translate.instant('dedicatedCloud_tab_veeam_enable_success', {
          t0: this.datacenter.name,
        }), 'dedicatedCloudDatacenterAlert');
      })
      .catch((error) => {
        this.Alerter.error(this.$translate.instant('dedicatedCloud_tab_veeam_enable_fail', {
          t0: this.datacenter.name,
        }), error, 'dedicatedCloudDatacenterAlert');
      })
      .finally(() => {
        this.loading.enable = false;
        this.onCancelBtnClick();
      });
  }

  onCancelBtnClick() {
    this.$state.go('^');
  }

  /* -----  End of EVENTS  ------ */

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  $onInit() {
    this.loading.init = true;

    return this.$q.all({
      datacenter: this.DedicatedCloud
        .getDatacenterInfoProxy(this.$stateParams.productId, this.$stateParams.datacenterId),
      hosts: this.DedicatedCloud
        .getHostsLexi(this.$stateParams.productId, this.$stateParams.datacenterId),
    }).then((data) => {
      this.datacenter = data.datacenter;
      this.hosts = data.hosts;
    }).finally(() => {
      this.loading.init = false;
    });
  }

  /* -----  End of INITIALIZATION  ------ */
});
