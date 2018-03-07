angular.module("services").service("Distribution", [
    "$rootScope",
    "OvhHttp",
    "$q",
    function ($rootScope, OvhHttp, $q) {
        "use strict";

        const distributions = {};

        /*
    * get packages by apiv6
    */
        this.getPackages = function (serviceType, image) {
            if (distributions[serviceType] && distributions[serviceType][image]) {
                return $q.when(distributions[serviceType][image]);
            }
            if (!distributions[serviceType]) {
                distributions[serviceType] = {};
            }
            return OvhHttp.get("/distribution/image/{serviceType}/{imageName}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceType,
                    imageName: image
                },
                returnErrorKey: ""
            }).then((response) => {
                distributions[serviceType][image] = response;
                return response;
            }, (err) => err.status === 404 ? { packages: [] } : $q.reject(err));
        };
    }
]);
