angular.module("App").controller("CdnDomainDeleteCtrl", class CdnDomainDeleteCtrl {

    constructor ($state, $stateParams, $translate, cdnDomain, ouiMessageAlerter, OvhApiCdnDedicated) {
        // Injections
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.cdnDomain = cdnDomain;
        this.ouiMessageAlerter = ouiMessageAlerter;
        this.OvhApiCdnDedicated = OvhApiCdnDedicated;

        // Other attributes used in view
        this.loading = {
            remove: false
        };
    }

    /* =============================
    =            EVENTS            =
    ============================== */

    onCdnDomainDeleteFormSubmit () {
        this.loading.remove = true;

        return this.OvhApiCdnDedicated.Domains().v6().remove({
            serviceName: this.$stateParams.productId,
            domain: this.$stateParams.domain
        }).$promise.then(() => {
            this.ouiMessageAlerter.success(this.$translate.instant("cdn_dedicated_domain_delete_success"), "app.networks.cdn.dedicated.domain");

            this.$state.go("^", {}, {
                reload: true
            });
        }).catch((error) => {
            this.ouiMessageAlerter.error([this.$translate.instant("cdn_dedicated_domain_delete_fail", {
                t0: this.cdnDomain.domain
            }), _.get(error, "data.message")].join(" "), "app.networks.cdn.dedicated.domain");

            this.$state.go("^");
        }).finally(() => {
            this.loading.remove = false;
        });
    }

    /* -----  End of EVENTS  ------ */


});
