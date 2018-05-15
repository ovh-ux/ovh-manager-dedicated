angular.module("App").controller("CdnGenerateSslCtrl", class CdnGenerateSslCtrl {

    constructor ($state, $stateParams, $translate, OvhApiCdn, Alerter) {
        // dependencies injections
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.OvhApiCdn = OvhApiCdn;
        this.Alerter = Alerter;

        // controller attributes
        this.model = {
            name: null
        };

        this.loading = {
            init: false,
            generate: false
        };

        this.ssl = null;
    }

    /* =============================
    =            EVENTS            =
    ============================== */

    onCdnSslGenerateFormSubmit () {
        if (this.cdnSslGenerateForm.$invalid) {
            return false;
        }

        this.loading.generate = true;

        return this.OvhApiCdn.Dedicated().Ssl().v6().save({
            serviceName: this.$stateParams.productId
        }, this.model).$promise.then(() => {
            this.Alerter.success(this.$translate.instant("cdn_dedicated_ssl_generate_success"), "cdnDedicatedManage");
        }).catch((error) => {
            this.Alerter.error([this.$translate.instant("cdn_dedicated_ssl_generate_error"), _.get(error, "data.message")].join(" "), "cdnDedicatedManage");
        }).finally(() => {
            this.loading.generate = false;
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
            this.model.name = this.ssl.name;
        }).catch((error) => {
            if (_.get(error, "status") === 404) {
                return null;
            }

            return this.Alerter.error([this.$translate.instant("cdn_dedicated_ssl_generate_load_error"), _.get(error, "data.message")].join(" "), "cdnDedicatedManage");
        }).finally(() => {
            this.loading.init = false;
        });
    }

    /* -----  End of INITIALIZATION  ------ */

});
