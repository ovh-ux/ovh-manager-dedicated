angular.module("App").controller("CdnDomainGeneralCtrl", class CdnDomainGeneralCtrl {

    constructor ($q, $state, $stateParams, OvhApiCdnDedicated) {
        // injections
        this.$q = $q;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.OvhApiCdnDedicated = OvhApiCdnDedicated;

        // other attributes used in view
        this.loading = {
            init: false
        };

        this.cdn = null;
        this.domain = null;
    }

    getBackends () {
        return this.OvhApiCdnDedicated.Domains().Backends().v6().query({
            serviceName: this.$stateParams.productId,
            domain: this.$stateParams.domain
        }).$promise.then((backendIps) => {
            const backendIpPromises = [];

            backendIps.forEach((backendIp) => {
                backendIpPromises.push(this.OvhApiCdnDedicated.Domains().Backends().v6().get({
                    serviceName: this.$stateParams.productId,
                    domain: this.$stateParams.domain,
                    ip: backendIp
                }).$promise);
            });

            return this.$q.all(backendIpPromises);
        });
    }

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    $onInit () {
        this.loading.init = true;

        return this.$q.all({
            cdn: this.OvhApiCdnDedicated.v6().get({
                serviceName: this.$stateParams.productId
            }).$promise,
            domain: this.OvhApiCdnDedicated.Domains().v6().get({
                serviceName: this.$stateParams.productId,
                domain: this.$stateParams.domain
            }).$promise,
            backends: this.getBackends()
        }).then((results) => {
            this.cdn = results.cdn;
            this.domain = results.domain;
            this.backend = _.first(results.backends);
        }).finally(() => {
            this.loading.init = false;
        });


    }

    /* -----  End of INITIALIZATION  ------ */


});
