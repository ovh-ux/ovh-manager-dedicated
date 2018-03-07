angular.module("Billing.services").service("BillingMean", [
    "$q",
    "$http",
    "$window",
    "BillingApi",
    "BillingApiSchema",
    "Billing.constants",
    "OvhHttp",
    function ($q, $http, $window, Api, ApiSchema, constants, OvhHttp) {
        "use strict";

        const self = this;
        const BASE_URL = `${constants.swsProxyRootPath}me/paymentMean`;

        this.means = constants.paymentMeans;
        this.meApiSchema = null;
        this.meApiSchemaPromise = null;

        this.isApiSchemaLoaded = () => !!self.meApiSchema;

        this.getApiSchemaPromise = () => self.meApiSchemaPromise;

        this.canPaymentTypeSetDefaultAtCreation = function (paymentType) {
            const apiEndpoint = getPaymentTypeEndpointSchema(paymentType);

            const postOperation = _.find(apiEndpoint.operations, {
                httpMethod: "POST"
            });
            if (!postOperation || !angular.isObject(postOperation)) {
                return false;
            }

            return _.some(postOperation.parameters, {
                dataType: "boolean",
                name: "setDefault"
            });
        };

        this.canBeAddedByUser = function (paymentType) {
            const apiEndpoint = getPaymentTypeEndpointSchema(paymentType);
            return _.some(apiEndpoint.operations, { httpMethod: "POST" });
        };

        this.getDetailedPaymentMeansForType = function (paymentType) {
            const meanFunctionName = `get${_.capitalize(paymentType)}`;

            return self[meanFunctionName]().then((paymentMeanIds) => {
                const detailsPromises = _.map(paymentMeanIds, (paymentMeanId) =>
                    self[meanFunctionName]("/{id}", {
                        urlParams: {
                            id: paymentMeanId
                        }
                    })
                );
                return $q.all(detailsPromises);
            });
        };

        this.getDetailedPaymentMeans = function () {
            const paymentMeanTypeListPromises = _.chain(self.means)
                .map((meanType) => [`${meanType}s`, self.getDetailedPaymentMeansForType(meanType)])
                .zipObject()
                .value();

            return $q.all(paymentMeanTypeListPromises);
        };

        this.getValidPaymentMeansIds = function () {
            const meanRequests = self.means.map((paymentMethod) => {
                let params = null;
                if (paymentMethod === "bankAccount") {
                    params = {
                        state: "valid"
                    };
                }
                return $http.get(`${BASE_URL}/${paymentMethod}`, { params });
            });

            return $q.all(meanRequests).then((responses) => responses.reduce((accumulator, response) => Array.isArray(response.data) ? accumulator.concat(response.data) : accumulator, []));
        };

        this.getOneValidBankAccount = (id) => $http.get(`${BASE_URL}/bankAccount/${id}`).then((resp) => resp.data);

        this.getValidBankAccounts = () =>
            $http
                .get(`${BASE_URL}/bankAccount`, {
                    state: "valid"
                })
                .then((ids) => $q.all(ids.data.map((id) => this.getOneValidBankAccount(id))));

        this.post = function (mean) {
            const payment = angular.copy(mean);

            delete payment.type;
            delete payment.validationType;

            if (mean.type === "bankAccount") {
                payment.iban = payment.iban.replace(/\s/g, "");
                payment.bic = payment.bic.replace(/\s/g, "");

                return self[`post${camelTo(mean.type)}`]("", {
                    data: payment
                });
            }

            return self[`post${camelTo(mean.type)}`]("", { data: payment });
        };

        /**
         * setAsDefaultPaymentMean:
         * @param mean: mean of payment
         * @param type: type of mean of payment [bankAccount, creditCard, paypal]
         */
        this.setAsDefaultPaymentMean = function (mean, type) {
            return Api.operation({
                method: "POST",
                url: `${BASE_URL}/${type}/${mean.id}/chooseAsDefaultPaymentMean`
            });
        };

        this.updatePaymentMean = function (opts) {
            return OvhHttp.put("/me/paymentMean/{type}/{id}", {
                rootPath: "apiv6",
                urlParams: {
                    type: opts.type,
                    id: opts.mean.id
                },
                data: {
                    description: opts.description
                }
            });
        };

        /**
         * HELPERS / UTILITIES
         */

        function assertThatApiSchemaIsLoaded () {
            if (!self.isApiSchemaLoaded()) {
                throw new Error("API Schema is not loaded.");
            }
        }

        function getPaymentTypeEndpointSchema (paymentType) {
            assertThatApiSchemaIsLoaded();

            const apiEndpoint = _.find(self.meApiSchema.apis, {
                path: `/me/paymentMean/${paymentType}`
            });
            if (!angular.isObject(apiEndpoint)) {
                throw new TypeError(`No endpoint schema found for paymentType '${paymentType}'`);
            }
            return apiEndpoint;
        }

        function camelTo (s) {
            return angular.uppercase(s[0]) + s.substring(1);
        }

        function injectCreditCardExpirationState (mean) {
            if (!mean.state && mean.expirationDate) {
                mean.state = "valid"; // default credit card state

                if ($window.moment().isAfter(mean.expirationDate)) {
                    mean.state = "expired";
                }
            }

            return mean;
        }

        /**
         * INITIALISE
         */

        function init () {
            self.meApiSchemaPromise = ApiSchema.getSchema("me").then((schema) => {
                self.meApiSchema = schema;
            });

            self.means.forEach((paymentType) => {
                const fullUrl = `${BASE_URL}/${paymentType}`;
                const camelizedPaymentType = camelTo(paymentType);

                ["get", "delete", "post"].forEach((httpMethod) => {
                    if (camelizedPaymentType === "DeferredPaymentAccount" && httpMethod === "post") {
                        return;
                    }

                    self[httpMethod + camelizedPaymentType] = function (a, b) {
                        const promise = Api[httpMethod](b ? fullUrl + a : fullUrl, b);

                        if (httpMethod === "get" && camelizedPaymentType === "CreditCard") {
                            return promise.then(injectCreditCardExpirationState);
                        }
                        return promise;
                    };
                });
            });
        }

        init();
    }
]);
