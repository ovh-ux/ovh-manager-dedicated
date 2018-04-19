angular.module("App").controller("DedicatedCloudSubDatacenterVeeamBackupDisableCtrl", class {

    constructor ($stateParams, $state, translator, Alerter, DedicatedCloud) {
        // dependencies injections
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.translator = translator;
        this.Alerter = Alerter;
        this.DedicatedCloud = DedicatedCloud;

        // controller attributes
        this.loading = {
            init: false,
            disable: false
        };

        this.datacenter = null;
    }

    /* =============================
    =            EVENTS            =
    ============================== */

    onConfirmBtnClick () {
        this.loading.disable = true;

        return this.DedicatedCloud.disableVeeam(this.$stateParams.productId, this.$stateParams.datacenterId).then(() => {
            this.Alerter.success(this.translator.tr("dedicatedCloud_tab_veeam_disable_success", this.datacenter.name), "dedicatedCloudDatacenterAlert");
        }).catch((error) => {
            this.Alerter.error(this.translator.tr("dedicatedCloud_tab_veeam_disable_fail", this.datacenter.name), error, "dedicatedCloudDatacenterAlert");
        }).finally(() => {
            this.loading.disable = false;
            this.onCancelBtnClick();
        });
    }

    onCancelBtnClick () {
        this.$state.go("^");
    }

    /* -----  End of EVENTS  ------ */

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    $onInit () {
        this.loading.disable = true;

        return this.DedicatedCloud.getDatacenterInfoProxy(this.$stateParams.productId, this.$stateParams.datacenterId).then((datacenter) => {
            this.datacenter = datacenter;
        }).finally(() => {
            this.loading.disable = false;
        });
    }

    /* -----  End of INITIALIZATION  ------ */

});
