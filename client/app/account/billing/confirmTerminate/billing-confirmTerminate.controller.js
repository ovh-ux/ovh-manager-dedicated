angular.module("Billing.controllers").controller("Billing.controllers.TerminateServiceCtrl", function ($stateParams, BillingTerminate) {
    "use strict";

    this.reasons = ["LACK_OF_PERFORMANCES", "TOO_EXPENSIVE", "TOO_HARD_TO_USE", "NOT_RELIABLE", "NOT_NEEDED_ANYMORE", "MIGRATED_TO_COMPETITOR", "MIGRATED_TO_ANOTHER_OVH_PRODUCT", "OTHER"];

    this.serviceId = $stateParams.id;
    this.serviceState = null;
    this.token = $stateParams.token;
    this.loading = true;
    this.terminating = false;
    this.error = false;
    this.globalError = null;

    this.init = function () {
        if (!this.token || !this.serviceId) {
            this.globalError = true;
            return;
        }

        this.loading = true;
        BillingTerminate
            .getServiceInfo(this.serviceId)
            .then((serviceInfos) => {
                this.serviceInfos = serviceInfos;
                return serviceInfos.serviceId;
            })
            .then((serviceId) =>
                BillingTerminate.getServiceApi(serviceId, true).then((service) => {
                    this.serviceState = _.get(service, "resource.state");
                })
            )
            .catch(() => {
                this.globalError = true;
            })
            .finally(() => {
                this.loading = false;
            });
    };

    this.confirmTermination = function () {
        this.terminating = true;
        BillingTerminate
            .confirmTermination(this.serviceId, this.serviceInfos.domain, this.reason, this.commentary, this.token)
            .then(() => {
                this.error = false;
                this.serviceState = "suspending";
            })
            .catch(() => {
                this.error = true;
            })
            .finally(() => {
                this.terminating = false;
            });
    };

    this.init();
});
