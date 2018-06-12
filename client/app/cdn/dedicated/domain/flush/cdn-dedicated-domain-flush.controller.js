angular.module("App").controller("CdnDomainFlushCtrl", class CdnDomainFlushCtrl {

    constructor ($state, $stateParams, $translate, OvhApiCdnDedicated, ouiMessageAlerter, cdnDomain) {
        // dependencies injections
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.OvhApiCdnDedicated = OvhApiCdnDedicated;
        this.ouiMessageAlerter = ouiMessageAlerter;
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
            this.ouiMessageAlerter.success(this.$translate.instant("cdn_dedicated_domain_flush_success", {
                t0: this.cdnDomain.domain
            }), "app.networks.cdn.dedicated.domain");
        }).catch((error) => {
            this.ouiMessageAlerter.error([this.$translate.instant("cdn_dedicated_domain_flush_error", {
                t0: this.cdnDomain.domain
            }), _.get(error, "data.message")].join(" "), "app.networks.cdn.dedicated.domain");
        }).finally(() => {
            this.loading.flush = false;
            this.$state.go("^");
        });
    }

    /* -----  End of EVENTS  ------ */

});
