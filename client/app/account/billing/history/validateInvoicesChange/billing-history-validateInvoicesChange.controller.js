angular.module("Billing.controllers").controller("Billing.controllers.HistoryValidateInvoicesChangeCtrl", class {

    constructor ($scope, OvhApiMe, Alerter, translator) {
        this.$scope = $scope;
        this.OvhApiMe = OvhApiMe;
        this.Alerter = Alerter;
        this.tr = translator.tr;
    }

    confirmChoice () {
        this.OvhApiMe.Billing().InvoicesByPostalMail().v6().post({
            enable: this.invoicesByPostalMail
        }).$promise.then(() => {
            this.$scope.setMessage(this.tr("history_invoices_choice_modal_update_success"), "true");
        }).catch((err) => {
            this.$scope.setMessage(this.tr("history_invoices_choice_modal_update_error"), err.data);
        }).finally(() => this.$scope.setAction());
    }

    cancelChoice () {
        this.$scope.cancelChoiceModal();
        this.$scope.setAction();
    }

    $onInit () {
        this.invoicesByPostalMail = this.$scope.currentActionData.choice;
    }

    // history_invoices_choice_modal_update_success
    // history_invoices_choice_modal_update_error
});
