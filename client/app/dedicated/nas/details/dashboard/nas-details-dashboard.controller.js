angular.module("App").controller("NasDetailsDashboardCtrl", class NasDetailsDashboardCtrl {

    constructor ($stateParams, nasData, Nas, Alerter) {
        // injections
        this.$stateParams = $stateParams;
        this.nasData = nasData;
        this.Nas = Nas;
        this.Alerter = Alerter;

        // attributes used in view
        this.loading = {
            monitoring: false
        };
    }

    updateMonitoringState () {
        this.loading.monitoring = true;

        return this.Nas.updateNasDetails(this.$stateParams.nasId, this.nasData.nas.customName, !this.nasData.monitoring.enabled).then(() => {
            this.Alerter.success(this.$translate.instant(`nas_dashboard_update_success_${this.nasData.monitoring.enabled ? "disabled" : "enabled"}`), "NasAlert");
            this.nasData.monitoring.enabled = !this.nasData.monitoring.enabled;
        }).catch((error) => {
            this.Alerter.alertFromSWS(this.$translate.instant("nas_dashboard_update_error"), error, "NasAlert");
        }).finally(() => {
            this.loading.monitoring = false;
        });
    }

});
