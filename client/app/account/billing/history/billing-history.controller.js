angular.module("Billing.controllers").controller("Billing.controllers.History", function ($scope, $timeout, $q, $log, $translate, BillingHistory, BillingUser, BillingDebtAccount, BillingmessageParser, BillingPaymentInformation, BillingdateRangeSelection, OvhApiMe, constants) { // eslint-disable-line max-len
    "use strict";
    const self = this;

    const COL_SPAN_DEBT_ACCOUNT = 6; // [référence, date, amount, balance due, date due, actions]
    const COL_SPAN_DEBT_LEGACY = 4; // [référence, date, amount, actions]

    self.history = null;

    self.loaders = {
        "export": false,
        history: false,
        paymentMeans: false
    };

    self.orderByState = {
        predicate: "billId",
        reverse: "DESC"
    };

    self.debtAccount = { active: false };
    self.target = constants.target;

    self.colSpan = COL_SPAN_DEBT_LEGACY;

    self.hasValidDefaultPaymentMean = true;
    self.target = constants.target;

    this.loadHistory = function (limit, offset) {
        const sort = getHistorySortOrder(self.orderByState);
        const dateFrom = BillingdateRangeSelection.dateFrom;
        const dateTo = BillingdateRangeSelection.dateTo;
        const searchText = self.searchText;

        let historyTotalCount = 0;
        self.loaders.history = true;

        return $timeout()
            .then(() => BillingHistory.getBillsIds({ dateFrom, dateTo, searchText }))
            .then((historyCounter) => {
                historyTotalCount = historyCounter.length;

                return BillingHistory.getBillingHistory({
                    limit,
                    offset,
                    dateFrom,
                    dateTo,
                    searchText,
                    sort,
                    collectDebt: self.debtAccount.active
                });
            })
            .then((history) => {
                self.history = history;
                self.history.count = historyTotalCount;

                const historyErrors = self.history.filter((hist) => hist.error);
                if (historyErrors.length > 0) {
                    $scope.setMessage($translate.instant("history_invoice_loading_errors", {
                        t0: historyErrors.length
                    }), { alertType: "ERROR" });
                }
            })
            .catch((err) => {
                $log.error(err);
                err.data.alertType = "ERROR";
                $scope.setMessage($translate.instant("billingError"), err.data);
            })
            .finally(() => {
                $timeout(() => {
                    self.loaders.history = false;
                });
            });
    };

    this.onOrderStateChanged = function (predicate, reverse) {
        self.orderByState = { predicate, reverse };
        $scope.$broadcast("paginationServerSide.loadPage", "1", "historyTable");
    };

    this.onDateRangeChanged = function () {
        $scope.$broadcast("paginationServerSide.loadPage", "1", "historyTable");
    };

    this.onSearchTextChanged = function () {
        $scope.$broadcast("paginationServerSide.loadPage", "1", "historyTable");
    };

    this.getDatasToExport = function () {
        const dateFrom = BillingdateRangeSelection.dateFrom;
        const dateTo = BillingdateRangeSelection.dateTo;
        const INFORMATION_NOT_AVAILABLE = $translate.instant("history_table_information_not_available");
        const DEBT_DUE_IMMEDIATELY = $translate.instant("history_table_debt_due_immediately");
        const DEBT_PAID = $translate.instant("history_table_debt_paid");

        const headers = [
            $translate.instant("history_table_head_id"),
            $translate.instant("history_table_head_order_id"),
            $translate.instant("history_table_head_date"),
            $translate.instant("history_table_head_total"),
            $translate.instant("history_table_head_total_with_VAT")
        ];

        if (self.debtAccount.active) {
            headers.push($translate.instant("history_table_head_balance_due"));
            headers.push($translate.instant("history_table_head_due_date"));
        }

        self.loaders.export = true;
        return BillingHistory.getBillingHistory({
            dateFrom,
            dateTo,
            sort: { field: "billId", order: "DESC" }
        })
            .then((history) => {
                const rows = history.map((bill) => {
                    let row = [bill.billId, bill.orderId, moment(bill.date).format("L"), bill.priceWithoutTax.text, bill.priceWithTax.text];

                    if (self.debtAccount.active) {
                        if (!bill.debt) {
                            row.concat([INFORMATION_NOT_AVAILABLE, INFORMATION_NOT_AVAILABLE]);
                        }
                        const dueAmount = _.get(bill, "debt.dueAmount.text", INFORMATION_NOT_AVAILABLE);
                        let dueDate;
                        if (_.get(bill, "debt.dueAmount.value", 0) > 0) {
                            dueDate = _.get(bill, "debt.dueDate") ? moment(bill.debt.dueDate).format("L") : DEBT_DUE_IMMEDIATELY;
                        } else {
                            dueDate = DEBT_PAID;
                        }
                        row = row.concat([dueAmount, dueDate]);
                    }
                    return row;
                });

                return [headers].concat(rows);
            })
            .catch((err) => {
                $scope.setMessage($translate.instant("billingError"), err.data);
                $log.error(err);
            })
            .finally(() => {
                self.loaders.export = false;
            });
    };

    this.payAllDebts = function () {
        $scope.setAction("payDebt", null, "history");
    };

    this.paySingleDebt = function (debt) {
        $scope.setAction("payDebt", debt, "history");
    };

    this.openValidationModal = function () {
        const data = {
            choice: this.invoicesByPostalMail,
            saveData: this.tmpInvoicesChoice
        };
        $scope.setAction("validateInvoicesChange", data);
    };

    $scope.cancelChoiceModal = function () {
        self.invoicesByPostalMail = angular.copy(self.tmpInvoicesChoice);
    };

    $scope.setMessage = function (message, data) {
        const msg = BillingmessageParser(message, data);
        self.message = msg.message;
        self.alertType = msg.alertType;
    };

    $scope.setAction = function (action, data) {
        const actionModalSelector = $("#currentAction");
        if (action) {
            $scope.currentAction = action;
            $scope.currentActionData = data;
            $scope.stepPath = `${$scope.BILLING_BASE_URL}history/${$scope.currentAction}/billing-history-${$scope.currentAction}.html`;

            actionModalSelector.modal({
                keyboard: true,
                backdrop: "static"
            });
        } else {
            actionModalSelector.modal("hide");
            $scope.currentActionData = null;
            $timeout(() => {
                $scope.stepPath = "";
            }, 300);
        }
    };

    /**
     * HELPERS AND UTILITIES
     */

    function getHistorySortOrder ({ predicate, reverse }) {
        return {
            field: predicate,
            order: reverse ? "DESC" : "ASC"
        };
    }

    /**
     * INITIALISATION
     */

    function loadDefaultPaymentMethod () {
        self.loaders.paymentMeans = true;
        return BillingPaymentInformation.hasDefaultPaymentMean()
            .then((hasDefault) => {
                self.hasValidDefaultPaymentMean = hasDefault;
            })
            .catch(() => {
                $scope.setMessage($translate.instant("statements_payment_mean_error"), {
                    alertType: "ERROR"
                });
            })
            .finally(() => {
                self.loaders.paymentMeans = false;
            });
    }

    this.$onInit = function () {
        this.isLoading = true;
        BillingUser.isVATNeeded().then((result) => {
            this.isVATNeeded = result;
        });
        this.canSetInvoiceByMail = false;

        loadDefaultPaymentMethod();

        return $q.all([
            BillingDebtAccount.getDebtAccount()
                .then((debtAccount) => {
                    this.debtAccount = debtAccount;
                    if (this.debtAccount.active) {
                        this.colSpan = COL_SPAN_DEBT_ACCOUNT;
                    }
                })
                .catch((err) => {
                    if (err.status === 404) {
                        return null;
                    }
                    return $scope.setMessage($scope.$translate.instant("billingError"), {
                        alertType: "ERROR"
                    });
                }),
            OvhApiMe.Billing().InvoicesByPostalMail().v6().get().$promise
                .then((result) => {
                    this.canSetInvoiceByPostalMail = true;
                    this.invoicesByPostalMail = result.data;
                    this.tmpInvoicesChoice = angular.copy(this.invoicesByPostalMail);
                })
        ]).finally(() => {
            this.isLoading = false;
        });
    };
});
