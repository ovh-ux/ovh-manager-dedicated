angular.module("services").service("User", [
    "$rootScope",
    "$http",
    "$q",
    "constants",
    "Billing.constants",
    "Products",
    "$translate",
    "OvhHttp",
    function ($rootScope, $http, $q, constants, billingConstants, Products, $translate, OvhHttp) {
        "use strict";

        const self = this;
        let user = null;
        let userPromise;
        let userPromiseRunning = false;

        this.getUser = function () {
            if (!userPromiseRunning && user === null) {
                userPromiseRunning = true;

                userPromise = $q.when("start").then(() =>
                    $q.all({
                        me: OvhHttp.get("/me", {
                            rootPath: "apiv6"
                        }),
                        certificates: this.getUserCertificates()
                    }).then((result) => {
                        userPromiseRunning = false;

                        if (result) {
                            user = {
                                nichandle: result.me.nichandle,
                                email: result.me.email,
                                firstName: result.me.firstname,
                                lastName: result.me.name,
                                billingCountry: result.me.country,
                                ovhSubsidiary: result.me.ovhSubsidiary,
                                spareEmail: result.me.spareEmail,
                                legalform: result.me.legalform,
                                customerCode: result.me.customerCode,
                                isEnterprise: _.indexOf(result.certificates, "enterprise") > -1
                            };
                        }
                    })
                );
            }

            return userPromise.then(() => user, (error) => $q.reject(error));
        };

        this.getUser();

        /* eslint-disable no-unused-vars */
        this.getUrlOf = function (link) {
            return this.getUser().then((data) => {
                try {
                    return constants.urls[data.ovhSubsidiary][link];
                } catch (exception) {
                    return constants.urls.FR[link];
                }
            });
        };

        /* The new structure in constants.config.js will be ...value.subsidiary and not subsidiary.value
         * It will be easier for maintainers when you see all the possible values for a constant at the same place
         * If constants are structured the old way, use getUrlOf
         */
        this.getUrlOfEndsWithSubsidiary = function (link) {
            return this.getUser().then((data) => {
                try {
                    return constants.urls[link][data.ovhSubsidiary];
                } catch (exception) {
                    return constants.urls[link].FR;
                }
            });
        };
        /* eslint-enable no-unused-vars */

        this.getSshKeys = function () {
            return OvhHttp.get("/me/sshKey", {
                rootPath: "apiv6"
            });
        };

        this.getCreditCards = function () {
            return $http.get("apiv6/me/paymentMean/creditCard").then((response) => {
                const queries = response.data.map(self.getCreditCard);

                return $q.all(queries);
            });
        };

        this.getCreditCard = function (id) {
            return $http.get(`apiv6/me/paymentMean/creditCard/${id}`).then((response) => response.data);
        };

        this.uploadFile = function (filename, file, tags) {
            let idFile;
            let documentResponse;

            const filenameSplitted = file.name.split(".");
            const params = {
                name: [filename, filenameSplitted[filenameSplitted.length - 1]].join(".")
            };

            if (tags) {
                angular.extend(params, { tags });
            }

            return $http
                .post("apiv6/me/document", params)
                .then((response) => {
                    documentResponse = response;

                    return $http.post("apiv6/me/document/cors", { origin: window.location.origin });
                })
                .then(() => {
                    idFile = documentResponse.data.id;
                    return $http.put(documentResponse.data.putUrl, file, {
                        serviceType: "external",
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                })
                .then(() => idFile);
        };

        this.getDocument = function (id) {
            return $http.get(`apiv6/me/document/${id}`).then((response) => response.data);
        };

        this.getDocumentIds = function () {
            return $http.get("apiv6/me/document").then((response) => response.data);
        };

        this.getDocuments = function () {
            return self.getDocumentIds().then((data) => {
                const queries = data.map(self.getDocument);

                return $q.all(queries);
            });
        };

        this.payWithRegisteredPaymentMean = function (opts) {
            return OvhHttp.post("/me/order/{orderId}/payWithRegisteredPaymentMean", {
                rootPath: "apiv6",
                urlParams: {
                    orderId: opts.orderId
                },
                data: {
                    paymentMean: opts.paymentMean
                }
            });
        };

        this.getValidPaymentMeansIds = function () {
            const means = billingConstants.paymentMeans;
            const baseUrl = `${constants.swsProxyRootPath}me/paymentMean`;
            const meanRequests = [];
            means.forEach((paymentMethod) => {
                let paramStruct = null;
                if (paymentMethod === "bankAccount") {
                    paramStruct = {
                        state: "valid"
                    };
                }
                const promise = $http.get([baseUrl, paymentMethod].join("/"), { params: paramStruct }).then((response) => response.data);
                meanRequests.push(promise);
            });
            return $q.all(meanRequests).then((response) => _.flatten(response));
        };

        this.getUserCertificates = function () {
            return OvhHttp.get("/me/certificates", {
                rootPath: "apiv6"
            });
        };
    }
]);
