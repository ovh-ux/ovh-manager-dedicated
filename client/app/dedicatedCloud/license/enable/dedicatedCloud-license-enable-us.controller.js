angular.module("App").controller("DedicatedCloudLicencesSplaEnableUSCtrl", class DedicatedCloudLicencesSplaEnableUSCtrl {

    constructor ($state, $stateParams, $translate, Alerter, OvhHttp, User) {
        this.$state = $state;
        this.$translate = $translate;
        this.OvhHttp = OvhHttp;
        this.Alerter = Alerter;
        this.User = User;
        this.serviceName = $stateParams.productId;
        this.selectedOffer = null;
    }

    $onInit () {
        this.loading = true;
        return this.User.getUrlOf("express_order").then((url) => {
            this.expressOrderUrl = url;
        }).catch(() => {
            this.Alerter.error(this.$translate.instant("dedicatedCloud_tab_licences_active_spla_load_fail"));
            this.$state.go("^");
        }).finally(() => {
            this.loading = false;
        });
    }

    fetchOffers () {
        return this.OvhHttp.get("/order/cartServiceOption/privateCloud/{serviceName}", {
            rootPath: "apiv6",
            urlParams: {
                serviceName: this.serviceName
            }
        }).then((offers) => _.filter(offers, { planCode: "pcc-option-windows" }));
    }

    fetchDatagridOffers () {
        return this.fetchOffers().then((offers) => {
            this.selectedOffer = _.first(offers);
            return {
                data: offers,
                meta: {
                    totalCount: _.size(offers)
                }
            };
        });
    }

    onOrderClick () {
        this.$state.go("^");
        return true;
    }

    getOrderUrl () {
        if (!this.selectedOffer) {
            return null;
        }

        const price = _.first(this.selectedOffer.prices);

        return `${this.expressOrderUrl}review?products=${JSURL.stringify([{
            productId: "privateCloud",
            serviceName: this.serviceName,
            planCode: this.selectedOffer.planCode,
            duration: price.duration,
            pricingMode: price.pricingMode,
            quantity: 1
        }])}`;
    }

    onCancelBtnClick () {
        this.$state.go("^");
    }
});
