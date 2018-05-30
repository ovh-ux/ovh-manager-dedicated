angular.module("App").controller("CdnDomainFlushCtrl", class CdnDomainFlushCtrl {

    constructor ($state, $stateParams, $translate, OvhApiCdnDedicated, Alerter, cdnDomain) {
        // dependencies injections
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.OvhApiCdnDedicated = OvhApiCdnDedicated;
        this.Alerter = Alerter;
        this.cdnDomain = cdnDomain; // from state modal resolve

        // attributes used in view
        this.loading = {
            flush: false
        };
    }

    /* =============================
    =            EVENTS            =
    ============================== */

    onCdnDomainFlushFormSubmit () {
        this.loading.flush = true;

        return this.OvhApiCdnDedicated.Domains().v6().flush({
            serviceName: this.$stateParams.productId,
            domain: this.$stateParams.domain
        }, {}).$promise.then(() => {
            this.Alerter.success(this.$translate.instant("cdn_dedicated_domain_flush_success"), "cdnDedicatedDomain");
        }).catch((error) => {
            this.Alerter.error([this.$translate.instant("cdn_dedicated_domain_flush_error"), _.get(error, "data.message")].join(" "), "cdnDedicatedDomain");
        }).finally(() => {
            this.loading.flush = false;
            this.$state.go("^");
        });
    }

    /* -----  End of EVENTS  ------ */

});
