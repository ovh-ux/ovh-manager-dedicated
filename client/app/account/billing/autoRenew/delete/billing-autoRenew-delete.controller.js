angular
    .module("Billing.controllers")
    .controller("billingAutoRenewDeleteCtrl", class BillingAutoRenewDeleteCtrl {
        constructor ($filter, $q, $rootScope, $scope, $translate, Alerter, BillingAutoRenew, AUTORENEW_EVENT) {
            this.$filter = $filter;
            this.$q = $q;
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.$translate = $translate;

            this.Alerter = Alerter;
            this.BillingAutoRenew = BillingAutoRenew;

            this.AUTORENEW_EVENT = AUTORENEW_EVENT;
        }

        $onInit () {
            this.selectedServices = this.$scope.currentActionData;
            this.serviceToDisplay = this.selectedServices[0];
            this.serviceToDisplay.expirationText = this.$filter("date")(this.serviceToDisplay.expiration, "mediumDate");
        }

        switchRenewalModeToManual () {
            const formattedServices = _(this.selectedServices).map((originalService) => {
                const service = _(originalService).clone(true);
                service.renew.automatic = false;

                return _(service).pick(["serviceId", "serviceType", "renew"]).value();
            }).value();

            return this.BillingAutoRenew.updateServices(formattedServices);
        }

        switchRenewalModeToDeleteAtExpiration () {
            const formattedServices = _(this.selectedServices).map((originalService) => {
                const service = _(originalService).clone(true);
                service.renew.deleteAtExpiration = true;

                return _(service).pick(["serviceId", "serviceType", "renew"]).value();
            }).value();

            return this.BillingAutoRenew
                .updateServices(formattedServices)
                .then(() => {
                    this.$scope.$emit(this.AUTORENEW_EVENT.TERMINATE_AT_EXPIRATION, formattedServices);
                });
        }

        switchRenewalModeToManualIfNeeded () {
            const AUTO_RENEW_TYPES = ["automaticV2014", "automaticV2016", "automaticForcedProduct"];
            const renewType = _(this.serviceToDisplay).get("service.renewalType", this.serviceToDisplay.renewalType);
            const serviceIsAutomaticallyRenewed = AUTO_RENEW_TYPES.includes(renewType);

            return this.serviceToDisplay.renew.automatic && !serviceIsAutomaticallyRenewed ? this.switchRenewalModeToManual() : this.$q.when();
        }

        deleteRenew () {
            return this.switchRenewalModeToManualIfNeeded()
                .then(() => this.switchRenewalModeToDeleteAtExpiration())
                .catch((err) => {
                    this.Alerter.alertFromSWS(this.$translate.instant("autorenew_service_update_step2_error"), err);
                })
                .finally(() => {
                    this.$rootScope.$broadcast(this.BillingAutoRenew.events.AUTORENEW_CHANGED);
                    this.$scope.resetAction();
                });
        }
    });
