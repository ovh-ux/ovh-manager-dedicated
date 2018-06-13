angular.module("App").controller("CdnDomainUpdateCtrl", class CdnDomainUpdateCtrl {

    constructor ($state, $stateParams, $translate, Alerter, cdnDomain, ouiMessageAlerter, OvhApiCdnDedicated) {
        // Injections
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.Alerter = Alerter;
        this.cdnDomain = cdnDomain;
        this.ouiMessageAlerter = ouiMessageAlerter;
        this.OvhApiCdnDedicated = OvhApiCdnDedicated;

        // other attributes used in view
        this.loading = {
            update: false
        };
    }

    /* =============================
    =            EVENTS            =
    ============================== */

    onCdnDomainUpdateFormSubmit () {
        this.loading.update = true;

        return this.OvhApiCdnDedicated.Domains().v6().update({
            serviceName: this.$stateParams.productId,
            domain: this.$stateParams.domain
        }, {
            status: this.cdnDomain.status === "on" ? "off" : "on"
        }).$promise.then(() => {
            this.ouiMessageAlerter.success(this.$translate.instant("cdn_dedicated_domain_update_success", {
                t0: this.cdnDomain.domain
            }), "app.networks.cdn.dedicated.domain");

            this.$state.go("^", {}, {
                reload: true
            });
        }).catch((error) => {
            this.ouiMessageAlerter.error([this.$translate.instant("cdn_dedicated_domain_update_error", {
                t0: this.cdnDomain.domain
            }), _.get(error, "data.message")].join(" "));

            this.$state.go("^");
        }).finally(() => {
            this.loading.update = false;
        });
    }

    /* -----  End of EVENTS  ------ */

});
