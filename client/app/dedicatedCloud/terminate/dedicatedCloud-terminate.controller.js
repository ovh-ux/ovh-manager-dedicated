angular.module("App").controller("DedicatedCloudTerminateCtrl", class DedicatedCloudTerminateCtrl {

    constructor ($state, $stateParams, translator, DedicatedCloud, Alerter) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.translator = translator;
        this.DedicatedCloud = DedicatedCloud;
        this.Alerter = Alerter;

        this.loading = {
            terminate: false
        };
    }

    /* =============================
    =            EVENTS            =
    ============================== */

    onTerminateBtnClick () {
        this.loading.terminate = true;

        return this.DedicatedCloud.terminate(`${this.$stateParams.productId} lksqhjf lqhsfkj sqhfkqfsh`)
            .then(() => this.Alerter.success(this.translator.tr("dedicatedCloud_close_service_success"), "dedicatedCloud"))
            .catch((error) => this.Alerter.alertFromSWS(this.translator.tr("dedicatedCloud_close_service_error"), error, "dedicatedCloud"))
            .finally(() => {
                this.loading.terminate = false;
                this.onCancelBtnClick();
            });
    }

    onCancelBtnClick () {
        this.$state.go("^");
    }

    /* -----  End of EVENTS  ------ */

});
