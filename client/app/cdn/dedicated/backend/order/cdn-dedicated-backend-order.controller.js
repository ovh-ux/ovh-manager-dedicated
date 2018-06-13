angular.module("App").controller("CdnBackendOrderCtrl", class CdnBackendOrderCtrl {

    constructor ($q, $state, $stateParams, $translate, $window, cdnDedicated, ouiMessageAlerter, OvhApiOrderCdn) {
        // Injections
        this.$q = $q;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.$window = $window;
        this.cdnDedicated = cdnDedicated;
        this.ouiMessageAlerter = ouiMessageAlerter;
        this.OvhApiOrderCdn = OvhApiOrderCdn;

        // Other attributes used in view
        this.loading = {
            init: false,
            durations: false,
            order: false
        };

        this.model = {
            backendQuantity: 1,
            duration: null,
            contracts: false
        };

        this.unitPrices = null;
        this.prices = null;
    }

    /* ============================
    =            STEPS            =
    ============================= */

    onStepperFinish () {
        this.loading.order = true;

        return this.OvhApiOrderCdn.Dedicated().Backend().v6().save({
            serviceName: this.$stateParams.productId,
            backend: this.model.backendQuantity,
            duration: this.model.duration.duration.value
        }, {
            backend: this.model.backendQuantity
        }).$promise.then(({ orderId, url }) => {
            this.ouiMessageAlerter.success(this.$translate.instant("cdn_dedicated_backend_order_success", {
                orderId,
                url
            }), "app.networks.cdn.dedicated.backend.order");

            this.$window.open(url, "_blank");

            // reset order process
            this.$onInit();
        }).catch((error) => {
            this.ouiMessageAlerter.error([this.$translate.instant("cdn_dedicated_backend_order_fail"), _.get(error, "data.message")].join(" "), "app.networks.cdn.dedicated.backend.order");
        }).finally(() => {
            this.loading.order = false;
        });
    }

    /* ----------  Step 1: Choose quantity  ---------- */

    onStep1Submit () {
        let responseDurations;

        this.loading.durations = true;

        return this.OvhApiOrderCdn.Dedicated().Backend().v6().query({
            serviceName: this.$stateParams.productId,
            backend: this.model.backendQuantity
        }).$promise.then((durations) => {
            responseDurations = durations;

            return this.$q.all(_.map(durations, (duration) => this.OvhApiOrderCdn.Dedicated().Backend().v6().get({
                serviceName: this.$stateParams.productId,
                backend: this.model.backendQuantity,
                duration
            }).$promise));
        }).then((responses) => {
            this.prices = _.map(responses, (duration, index) => {
                duration.duration = {
                    value: responseDurations[index],
                    text: _.capitalize(moment.duration(parseInt(responseDurations[index], 10), "months").humanize())
                };
                return duration;
            });
        }).catch((error) => {
            this.ouiMessageAlerter.error([this.$translate.instant("cdn_dedicated_backend_order_load_fail"), _.get(error, "data.message")].join(" "), "app.networks.cdn.dedicated.backend.order");
        }).finally(() => {
            this.loading.durations = false;
        });
    }

    /* -----  End of STEPS  ------ */

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    $onInit () {
        this.loading.init = true;

        // reset models
        this.model.backendQuantity = 1;
        this.model.duration = null;
        this.model.contracts = false;

        return this.OvhApiOrderCdn.Dedicated().Backend().v6().get({
            serviceName: this.$stateParams.productId,
            backend: 1,
            duration: "01"
        }).$promise.then(({ prices }) => {
            this.unitPrices = prices;
        }).catch((error) => {
            this.ouiMessageAlerter.error([this.$translate.instant("cdn_dedicated_backend_order_load_fail"), _.get(error, "data.message")].join(" "), "app.networks.cdn.dedicated.backend.order");
        }).finally(() => {
            this.loading.init = false;
        });
    }

    /* -----  End of INITIALIZATION  ------ */

});
