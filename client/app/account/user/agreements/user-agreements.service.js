angular.module("UserAccount").service("UserAccount.services.agreements", [
    "$http",
    "$q",
    "$translate",
    "UserAccount.constants",
    "$cacheFactory",
    function ($http, $q, $translate, constants, cache) {
        "use strict";

        const userAgreementsCache = cache("USER_AGREEMENTS");

        const proxyPath = `${constants.swsProxyRootPath}me`;

        const GDPR_AGREEMENTS_INFOS = [
            {
                agreementId: 1800,
                subsidiary: "DE",
                url: "https://www.ovh.de/privacy"
            }, {
                agreementId: 1801,
                subsidiary: "LT",
                url: "https://www.ovh.lt/privacy"
            }, {
                agreementId: 1802,
                subsidiary: "CZ",
                url: "https://www.ovh.cz/privacy"
            }, {
                agreementId: 1803,
                subsidiary: "IT",
                url: "https://www.ovh.it/privacy"
            }, {
                agreementId: 1804,
                subsidiary: "PT",
                url: "https://www.ovh.pt/privacy"
            }, {
                agreementId: 1805,
                subsidiary: "ES",
                url: "https://www.ovh.es/privacy"
            }, {
                agreementId: 1806,
                subsidiary: "NL",
                url: "https://www.ovh.nl/privacy"
            }, {
                agreementId: 1807,
                subsidiary: "FI",
                url: "https://www.ovh-hosting.fi/privacy"
            }, {
                agreementId: 1808,
                subsidiary: "PL",
                url: "https://www.ovh.pl/privacy"
            }, {
                agreementId: 1821,
                subsidiary: "EN",
                url: "https://www.ovh.co.uk/privacy"
            }, {
                agreementId: 1822,
                subsidiary: "IE",
                url: "https://www.ovh.ie/privacy"
            }, {
                agreementId: 1826,
                subsidiary: "FR",
                url: "https://www.ovh.com/fr/protection-donnees-personnelles"
            }
        ];

        function getSuccessDataOrReject (response) {
            return response.status < 300 ? response.data : $q.reject(response.data);
        }

        function formatList (response) {
            if (response.data.list && response.data.list.results && response.data.list.results.length) {
                response.data.list.results.forEach((agreement) => {
                    console.log(agreement);
                    if (_.find(GDPR_AGREEMENTS_INFOS, (x) => x.agreementId === agreement.contractId)) {
                        agreement.name = $translate.instant("user_agreement_GDPR_title");
                    }
                });
            }
            return response;
        }

        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
        this.getList = function (count, offset) {
            return $http
                .get("/sws/agreements", {
                    cache: userAgreementsCache,
                    params: {
                        count,
                        offset
                    },
                    serviceType: "aapi"
                })
                .then(formatList)
                .then(getSuccessDataOrReject);
        };

        this.getAgreement = function (agreementId) {
            return $http.get(`${proxyPath}/agreements/${agreementId}`)
                .then((response) => {
                    if (response.data && response.data.contractId) {
                        const gdprAgreement = _.find(GDPR_AGREEMENTS_INFOS, (x) => x.agreementId === response.data.contractId);
                        if (gdprAgreement) {
                            response.data.title = $translate.instant("user_agreement_GDPR_title");
                            response.data.helperText = $translate.instant("user_agreement_GDPR_helper_text", { agreementLink: gdprAgreement.url });
                        }

                    }
                    return response;
                })
                .then(getSuccessDataOrReject);
        };

        this.getContract = function (contractId) {
            return $http.get(`${proxyPath}/agreements/${contractId}/contract`).then(getSuccessDataOrReject);
        };

        this.getToValidate = function () {
            return $http
                .get("/sws/agreements", {
                    cache: userAgreementsCache,
                    params: {
                        count: 0,
                        offset: 0,
                        agreed: "todo"
                    },
                    serviceType: "aapi"
                })
                .then(formatList)
                .then(getSuccessDataOrReject);
        };

        this.accept = function (contractId) {
            return $http
                .post(`${proxyPath}/agreements/${contractId}/accept`)
                .then(formatList)
                .then(getSuccessDataOrReject)
                .then((response) => {
                    userAgreementsCache.removeAll();
                    return response;
                });
        };
    }
]);
