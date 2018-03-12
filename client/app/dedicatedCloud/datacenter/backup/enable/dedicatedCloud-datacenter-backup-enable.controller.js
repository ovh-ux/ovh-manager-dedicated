angular.module("App").controller("DedicatedCloudSubDatacenterVeeamBackupEnableCtrl", class {

    constructor ($q, $stateParams, $uibModalInstance, translator, Alerter, DedicatedCloud) {
        // dependencies injections
        this.$q = $q;
        this.$stateParams = $stateParams;
        this.$uibModalInstance = $uibModalInstance;
        this.translator = translator;
        this.Alerter = Alerter;
        this.DedicatedCloud = DedicatedCloud;

        // controller attributes
        this.loading = {
            init: false,
            enable: false
        };

        this.datacenter = null;
        this.hosts = null;
    }

    /* =============================
    =            EVENTS            =
    ============================== */

    onConfirmBtnClick () {
        if (!this.hosts.length) {
            return this.$uibModalInstance.close();
        }

        this.loading.enable = true;

        return this.DedicatedCloud.enableVeeam(this.$stateParams.productId, this.$stateParams.datacenterId).then(() => {
            this.Alerter.success(this.translator.tr("dedicatedCloud_tab_veeam_enable_success", this.datacenter.name), "dedicatedCloudDatacenterAlert");
        }).catch((error) => {
            this.Alerter.error(this.translator.tr("dedicatedCloud_tab_veeam_enable_fail", this.datacenter.name), error, "dedicatedCloudDatacenterAlert");
        }).finally(() => {
            this.loading.enable = false;
            this.$uibModalInstance.close();
        });
    }

    /* -----  End of EVENTS  ------ */

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    $onInit () {
        this.loading.init = true;

        return this.$q.all({
            datacenter: this.DedicatedCloud.getDatacenterInfoProxy(this.$stateParams.productId, this.$stateParams.datacenterId),
            hosts: this.DedicatedCloud.getHostsLexi(this.$stateParams.productId, this.$stateParams.datacenterId)
        }).then((data) => {
            this.datacenter = data.datacenter;
            this.hosts = data.hosts;
        }).finally(() => {
            this.loading.init = false;
        });
    }

    /* -----  End of INITIALIZATION  ------ */

});
