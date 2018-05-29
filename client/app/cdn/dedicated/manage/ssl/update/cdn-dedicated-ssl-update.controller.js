angular.module("App").controller("CdnUpdateSslCtrl", class CdnUpdateSslCtrl {

    constructor ($state, $stateParams, $translate, OvhApiCdn, Alerter) {
        // dependencies injections
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.OvhApiCdn = OvhApiCdn;
        this.Alerter = Alerter;

        // controller attributes
        this.model = {
            certificate: null,
            key: null,
            chain: null
        };

        this.loading = {
            init: false,
            update: false
        };

        this.ssl = null;
    }

    /* =============================
    =            EVENTS            =
    ============================== */

    onCdnSslUpdateFormSubmit () {
        if (this.cdnSslUpdateForm.$invalid) {
            return false;
        }

        this.loading.update = true;

        return this.OvhApiCdn.Dedicated().Ssl().v6().update({
            serviceName: this.$stateParams.productId
        }, this.model).$promise.then(() => {
            this.Alerter.success(this.$translate.instant("cdn_dedicated_ssl_update_success"), "cdnDedicatedManage");
        }).catch((error) => {
            this.Alerter.error([this.$translate.instant("cdn_dedicated_ssl_update_error"), _.get(error, "data.message")].join(" "), "cdnDedicatedManage");
        }).finally(() => {
            this.loading.update = false;
            this.$state.go("^");
        });
    }

    /* -----  End of EVENTS  ------ */


    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    $onInit () {
        this.loading.init = true;

        return this.OvhApiCdn.Dedicated().Ssl().v6().get({
            serviceName: this.$stateParams.productId
        }).$promise.then((ssl) => {
            this.ssl = ssl;
        }).catch((error) => {
            if (_.get(error, "status") === 404) {
                return null;
            }

            return this.Alerter.error([this.$translate.instant("cdn_dedicated_ssl_update_load_error"), _.get(error, "data.message")].join(" "), "cdnDedicatedManage");
        }).finally(() => {
            this.loading.init = false;
        });
    }

    /* -----  End of INITIALIZATION  ------ */

});
