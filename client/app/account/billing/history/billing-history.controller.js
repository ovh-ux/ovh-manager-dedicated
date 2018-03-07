angular.module("Billing.controllers").controller("Billing.controllers.History", function ($scope, $timeout, $q, $log, translator, BillingHistory, BillingUser, BillingDebtAccount, BillingmessageParser, BillingPaymentInformation, BillingdateRangeSelection) { // eslint-disable-line max-len
    "use strict";
    const self = this;

    const tr = translator.tr;

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

    self.colSpan = COL_SPAN_DEBT_LEGACY;

    self.hasValidDefaultPaymentMean = true;

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
                    $scope.setMessage(tr("history_invoice_loading_errors", [historyErrors.length]), { alertType: "ERROR" });
                }
            })
            .catch((err) => {
                $log.error(err);
                err.data.alertType = "ERROR";
                $scope.setMessage(tr("billingError"), err.data);
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
        const INFORMATION_NOT_AVAILABLE = tr("history_table_information_not_available");
        const DEBT_DUE_IMMEDIATELY = tr("history_table_debt_due_immediately");
        const DEBT_PAID = tr("history_table_debt_paid");

        const headers = [tr("history_table_head_id"), tr("history_table_head_order_id"), tr("history_table_head_date"), tr("history_table_head_total"), tr("history_table_head_total_with_VAT")];

        if (self.debtAccount.active) {
            headers.push(tr("history_table_head_balance_due"));
            headers.push(tr("history_table_head_due_date"));
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
                $scope.setMessage(tr("billingError"), err.data);
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
                $scope.setMessage(tr("statements_payment_mean_error"), {
                    alertType: "ERROR"
                });
            })
            .finally(() => {
                self.loaders.paymentMeans = false;
            });
    }

    (function init (_self) {
        BillingUser.isVATNeeded().then((result) => {
            _self.isVATNeeded = result;
        });

        loadDefaultPaymentMethod();

        BillingDebtAccount.getDebtAccount()
            .then((debtAccount) => {
                _self.debtAccount = debtAccount;
                if (_self.debtAccount.active) {
                    _self.colSpan = COL_SPAN_DEBT_ACCOUNT;
                }
            })
            .catch((err) => {
                if (err.status === 404) {
                    return null;
                }
                return $scope.setMessage($scope.tr("billingError"), {
                    alertType: "ERROR"
                });
            });
    })(this);
});
