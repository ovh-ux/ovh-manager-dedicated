angular.module("Billing.controllers").controller("Billing.controllers.HistoryValidateInvoicesChangeCtrl", class {

    constructor ($scope, $translate, OvhApiMe, Alerter) {
        this.$scope = $scope;
        this.OvhApiMe = OvhApiMe;
        this.Alerter = Alerter;
        this.$translate = $translate;
    }

    confirmChoice () {
        this.OvhApiMe.Billing().InvoicesByPostalMail().v6().post({
            enable: this.invoicesByPostalMail
        }).$promise.then(() => {
            this.$scope.setMessage(this.$translate.instant("history_invoices_choice_modal_update_success"), "true");
        }).catch((err) => {
            this.$scope.setMessage(this.$translate.instant("history_invoices_choice_modal_update_error"), err.data);
        }).finally(() => this.$scope.setAction());
    }

    cancelChoice () {
        this.$scope.cancelChoiceModal();
        this.$scope.setAction();
    }

    $onInit () {
        this.invoicesByPostalMail = this.$scope.currentActionData.choice;
    }
});
