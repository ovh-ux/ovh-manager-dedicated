angular.module("UserAccount").service("UserAccount.services.agreements", [
    "$http",
    "$q",
    "UserAccount.constants",
    "$cacheFactory",
    function ($http, $q, constants, cache) {
        "use strict";

        const userAgreementsCache = cache("USER_AGREEMENTS");

        const proxyPath = `${constants.swsProxyRootPath}me`;

        function getSuccessDataOrReject (response) {
            return response.status < 300 ? response.data : $q.reject(response.data);
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
                .then(getSuccessDataOrReject);
        };

        this.getAgreement = function (agreementId) {
            return $http.get(`${proxyPath}/agreements/${agreementId}`).then(getSuccessDataOrReject);
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
                .then(getSuccessDataOrReject);
        };

        this.accept = function (contractId) {
            return $http
                .post(`${proxyPath}/agreements/${contractId}/accept`)
                .then(getSuccessDataOrReject)
                .then((response) => {
                    userAgreementsCache.removeAll();
                    return response;
                });
        };
    }
]);
