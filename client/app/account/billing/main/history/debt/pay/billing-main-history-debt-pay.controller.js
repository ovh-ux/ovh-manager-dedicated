angular.module("Billing").controller("BillingHistoryDebtPayCtrl", class BillingHistoryDebtPayCtrl {

    constructor ($q, $state, $stateParams, $translate, $window, Alerter, OvhApiMe) {
        // Injections
        this.$q = $q;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.$window = $window;
        this.Alerter = Alerter;
        this.OvhApiMe = OvhApiMe;

        // Other attributes used in view
        this.loading = {
            pay: false
        };
    }

    closeModal () {
        return this.$state.go("app.account.billing.main.history");
    }

    /* =============================
    =            EVENTS            =
    ============================== */

    onDebtPayFormSubmit () {
        this.loading.pay = true;

        let promise;

        if (this.$stateParams.debtId !== "all") {
            promise = this.OvhApiMe.DebtAccount().Debt().v6().pay({
                debtId: this.$stateParams.debtId
            }).$promise;
        } else {
            promise = this.OvhApiMe.DebtAccount().v6().pay().$promise;
        }

        return promise.then(({ orderId, url }) => {
            this.Alerter.success(this.$translate.instant("billing_main_history_debt_pay_success", {
                t0: orderId,
                t1: url
            }), "billing_main_alert");

            this.$window.open(url, "_blank");
        }).catch((error) => {
            this.Alerter.error([this.$translate.instant("billing_main_history_debt_pay_error"), _.get(error, "data.message")].join(" "), "billing_main_alert");
        }).finally(() => {
            this.loading.pay = false;
            this.closeModal();
        });
    }

    /* -----  End of EVENTS  ------ */

});
