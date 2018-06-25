angular.module("Billing").controller("BillingMainHistoryCtrl", class BillingMainHistoryCtrl {

    constructor ($q, $state, $translate, $uibModal, Alerter, constants, currentUser, exportCsv, OvhApiMe, paymentMethodHelper) {
        // Injections
        this.$q = $q;
        this.$state = $state;
        this.$translate = $translate;
        this.$uibModal = $uibModal;
        this.Alerter = Alerter;
        this.constants = constants;
        this.currentUser = currentUser; // from app route resolve
        this.exportCsv = exportCsv;
        this.OvhApiMe = OvhApiMe;
        this.paymentMethodHelper = paymentMethodHelper;

        // Other attributes used in view
        this.loading = {
            init: false,
            "export": false
        };

        this.postalMailOptions = {
            enabled: false,
            activated: false
        };

        this.datagridConfig = null;
    }

    /**
     *  Used to create an api v7 request instance including sort and filters
     */
    _getApiv7Request () {
        const criteriaOperatorToApiV7Map = {
            isAfter: "ge",
            isBefore: "le",
            contains: "like"
        };
        let apiv7Request = this.OvhApiMe.Bill().v7().query().sort(this.datagridConfig.sort.property, this.datagridConfig.sort.dir === 1 ? "ASC" : "DESC");

        this.datagridConfig.criteria.forEach((criteria) => {
            if (criteria.property === "date") {
                if (criteria.operator === "is") {
                    apiv7Request = apiv7Request
                        .addFilter(criteria.property, "ge", criteria.value)
                        .addFilter(criteria.property, "le", moment(criteria.value).add(1, "day").format("YYYY-MM-DD"));
                } else {
                    apiv7Request = apiv7Request.addFilter(criteria.property, _.get(criteriaOperatorToApiV7Map, criteria.operator), criteria.value);
                }
            } else {
                // it's a search from search input
                apiv7Request = apiv7Request.addFilter("billId", _.get(criteriaOperatorToApiV7Map, criteria.operator), _.startsWith(criteria.value, "FR") ? criteria.value : `FR${criteria.value}`);
            }
        });

        return apiv7Request;
    }

    /**
     *  Apply debt object to bill objects returned by an apiv7 batch call.
     */
    _applyDebtToBills (bills) {
        let billDebtsPromise = this.$q.when([]);

        if (this.debtAccount.active) {
            billDebtsPromise = this.OvhApiMe.Bill().v7().debt().batch("billId", _.map(bills, "key"))
                .execute().$promise;
        }

        return billDebtsPromise.then((debts) => _.map(bills, (bill) => {
            const debt = _.find(debts, {
                path: `/me/bill/${bill.key}/debt`
            });

            return _.set(bill, "value.debt", _.get(debt, "value", null));
        }));
    }

    /* ===============================
    =            DATAGRID            =
    ================================ */

    getBills ($config) {
        this.datagridConfig = $config;
        const apiv7Request = this._getApiv7Request();

        return this.$q.all({
            count: apiv7Request.clone().execute().$promise,
            bills: apiv7Request.clone().expand()
                .offset($config.offset - 1)
                .limit($config.pageSize)
                .execute().$promise
        }).then(({ count, bills }) => this._applyDebtToBills(bills).then((billList) => ({
            data: _.map(billList, "value"),
            meta: {
                totalCount: count.length
            }
        })));
    }

    /* -----  End of DATAGRID  ------ */

    /* ====================================
    =            EXPORT TO CSV            =
    ===================================== */

    exportToCsv () {
        this.loading.export = true;

        const translations = {
            notAvailable: this.$translate.instant("billing_main_history_table_unavailable"),
            dueImmediatly: this.$translate.instant("billing_main_history_table_immediately"),
            paid: this.$translate.instant("billing_main_history_table_debt_paid")
        };
        const headers = [
            this.$translate.instant("billing_main_history_table_id"),
            this.$translate.instant("billing_main_history_table_order_id"),
            this.$translate.instant("billing_main_history_table_date"),
            this.$translate.instant("billing_main_history_table_total"),
            this.$translate.instant("billing_main_history_table_total_with_VAT")
        ];

        if (this.debtAccount.active) {
            headers.push(this.$translate.instant("billing_main_history_table_balance_due_amount"));
            headers.push(this.$translate.instant("billing_main_history_table_balance_due_date"));
        }

        return this._getApiv7Request().expand().execute().$promise
            .then((bills) => this._applyDebtToBills(bills))
            .then((billList) => {
                const rows = _.map(billList, "value").map((bill) => {
                    let row = [bill.billId, bill.orderId, moment(bill.date).format("L"), bill.priceWithoutTax.text, bill.priceWithTax.text];

                    if (this.debtAccount.active) {
                        if (!bill.debt) {
                            row.concat([translations.notAvailable, translations.notAvailable]);
                        }
                        const dueAmount = _.get(bill, "debt.dueAmount.text", translations.notAvailable);
                        let dueDate;
                        if (_.get(bill, "debt.dueAmount.value", 0) > 0) {
                            dueDate = _.get(bill, "debt.dueDate") ? moment(bill.debt.dueDate).format("L") : translations.dueImmediatly;
                        } else {
                            dueDate = translations.paid;
                        }
                        row = row.concat([dueAmount, dueDate]);
                    }

                    return row;
                });
                return [headers].concat(rows);
            })
            .then((csvData) => this.exportCsv.exportData({
                separator: ";",
                datas: csvData
            }))
            .catch((error) => {
                this.Alerter.error([this.$translate.instant("billing_main_history_export_error"), _.get(error, "data.message")].join(" "), "billing_main_alert");
            })
            .finally(() => {
                this.loading.export = false;
            });
    }

    /* -----  End of EXPORT TO CSV  ------ */

    /* =============================
    =            EVENTS            =
    ============================== */

    onPostalMailOptionsChange () {
        const postalOptionsModal = this.$uibModal.open({
            templateUrl: "account/billing/main/history/postalMailOptions/billing-main-history-postal-mail-options.html",
            controller: "BillingHistoryPostalMailOptionsCtrl",
            controllerAs: "$ctrl",
            resolve: {
                postalMailOptionsActivated: () => !this.postalMailOptions.activated
            }
        });

        return postalOptionsModal.result.catch(() => {
            // reset the checkbox state in case modal is closed without confirm
            this.postalMailOptions.activated = !this.postalMailOptions.activated;
        });
    }

    /* -----  End of EVENTS  ------ */

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    _getDebtAccount () {
        return this.OvhApiMe.DebtAccount().v6().get().$promise.catch((error) => {
            if (error.status === 404) {
                return {
                    active: false
                };
            }

            return this.$q.reject(error);
        });
    }

    $onInit () {
        let postalMailOptionPromise = this.$q.when(null);

        this.loading.init = true;

        if (this.currentUser.billingCountry === "FR" && this.currentUser.legalform === "individual") {
            postalMailOptionPromise = this.OvhApiMe.Billing().InvoicesByPostalMail().v6().get().$promise;
        }

        return this.$q.all({
            debtAccount: this._getDebtAccount(),
            hasDefaultPaymentMehtod: this.paymentMethodHelper.hasDefaultPaymentMethod(),
            invoicesByPostalMail: postalMailOptionPromise
        }).then(({ debtAccount, hasDefaultPaymentMehtod, invoicesByPostalMail }) => {
            this.debtAccount = debtAccount;
            this.hasDefaultPaymentMehtod = hasDefaultPaymentMehtod;

            // set invoice by postal mail options
            this.postalMailOptions.enabled = invoicesByPostalMail !== null;
            this.postalMailOptions.activated = _.get(invoicesByPostalMail, "data", false);
        }).catch((error) => {
            this.Alerter.error([this.$translate.instant("billing_main_history_loading_errors"), _.get(error, "data.message")].join(" "), "billing_main_alert");
        }).finally(() => {
            this.loading.init = false;
        });
    }

    /* -----  End of INITIALIZATION  ------ */

});
