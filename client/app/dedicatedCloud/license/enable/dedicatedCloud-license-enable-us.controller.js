angular.module("App").controller("DedicatedCloudLicencesSplaEnableUSCtrl", class DedicatedCloudLicencesSplaEnableUSCtrl {

    constructor ($stateParams, $scope, $state, $q, OvhHttp, User) {
        this.$state = $state;
        this.$q = $q;
        this.OvhHttp = OvhHttp;
        this.User = User;
        this.serviceName = $stateParams.productId;
        this.selectedOffer = null;
    }

    $onInit () {
        this.loading = true;
        return this.$q.all({
            url: this.User.getUrlOf("express_order"),
            offers: this.fetchOffers()
        }).then((results) => {
            this.expressOrderUrl = results.url;
            this.offers = results.offers;
            this.selectedOffer = _.first(this.offers);
        }).catch((err) => {
            this.$scope.setMessage(this.$translate.instant(""), {
                message: err.message || err,
                type: "ERROR"
            });
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
