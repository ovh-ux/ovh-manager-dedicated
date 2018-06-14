angular.module("Billing.services").service("BillingHistory", function ($http, $q, $cacheFactory) {
    "use strict";

    const billingCache = $cacheFactory("UNIVERS_BILLING_HISTORY");
    const self = this;
    const batchSeparator = ",";
    const billPathRegex = new RegExp("^/me/bill/([a-z0-9]+)$", "i");
    const debtPathRegex = new RegExp("^/me/bill/([a-z0-9]+)/debt$", "i");

    function getQueryString (params) {
        return _.map(params, (val, key) => [encodeURIComponent(key), encodeURIComponent(val)].join("=")).join("&");
    }

    this.getBillingHistory = function (params) {
        const billsPromise = self.getBills(params);

        if (!params.collectDebt) {
            return billsPromise;
        }
        return billsPromise.then((bills) => {
            bills.forEach((bill) => {
                self.getDebt(bill.billId).then((debt) => (bill.debt = debt));
            });
            return bills;
        });
    };

    this.getBillsIds = function ({ dateFrom, dateTo, searchText }) {
        const apiv7Ops = {
            "date:ge": moment(dateFrom)
                .startOf("day")
                .toISOString(),
            "date:le": moment(dateTo)
                .endOf("day")
                .toISOString()
        };

        if (searchText) {
            apiv7Ops["billId:like"] = `%${searchText}%`;
        }

        const qs = getQueryString(apiv7Ops);

        return $http
            .get(`/me/bill?${qs}`, {
                cache: billingCache,
                serviceType: "apiv7"
            })
            .then((response) => response.data);
    };

    this.getBills = function ({ limit = 0, offset = 0, dateFrom, dateTo, searchText, sort = false }) {
        const apiv7Ops = {
            "date:ge": moment(dateFrom)
                .startOf("day")
                .toISOString(),
            "date:le": moment(dateTo)
                .endOf("day")
                .toISOString(),
            $expand: 1
        };

        if (searchText) {
            apiv7Ops["billId:like"] = `%${searchText}%`;
        }

        if (limit > 0) {
            apiv7Ops.$limit = limit;
        }

        if (offset > 0) {
            apiv7Ops.$offset = offset;
        }

        if (sort && sort.field && sort.order) {
            apiv7Ops.$sort = sort.field;
            apiv7Ops.$order = sort.order;
        }

        const qs = getQueryString(apiv7Ops);

        return $http
            .get(`/me/bill?${qs}`, {
                cache: billingCache,
                serviceType: "apiv7"
            })
            .then((response) =>
                response.data.map((item) => {
                    const value = item.value;

                    if (!value.billId) {
                        value.billId = item.key || billPathRegex.exec(item.path).pop();
                    }
                    return item.error ? angular.extend({ error: item.error }, value) : value;
                })
            );
    };

    this.getDebt = (billId) =>
        $http
            .get(`/me/bill/${billId}/debt`, {
                cache: billingCache,
                serviceType: "apiv6"
            })
            .then((response) => response.data)
            .catch((err) => {
                if (err.status === 404) {
                    return null;
                }
                return $q.reject(err);
            });

    this.getDebtByBatch = (billIds) => {
        if (!angular.isArray(billIds)) {
            throw new TypeError("Expecting an array of bill ids.");
        }

        // Add an extra batchSeparator in the end of the batch to workaround ENGINE-5479
        const batchIds = encodeURIComponent(billIds.join(batchSeparator) + batchSeparator);

        return $http
            .get(`/me/bill/${batchIds}/debt?$batch=${batchSeparator}`, {
                cache: billingCache,
                serviceType: "apiv7"
            })
            .then((response) => {
                const debts = response.data.filter((debt) => !debt.error && _.get(debt, "value.debtId"));
                return debts.map((item) => {
                    const billId = debtPathRegex.exec(item.path).pop();
                    return angular.extend({ billId }, item.value);
                });
            });
    };

    this.getDebtOperations = (billId) =>
        $http
            .get(`/me/bill/${billId}/debt/operation`, {
                cache: billingCache,
                serviceType: "apiv6"
            })
            .then((response) => response.data);

    this.getDebtOperationDetail = (billId, operationId) =>
        $http
            .get(`/me/bill/${billId}/debt/operation/${operationId}`, {
                cache: billingCache,
                serviceType: "apiv6"
            })
            .then((response) => response.data);
});
