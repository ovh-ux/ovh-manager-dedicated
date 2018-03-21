angular.module("App").controller("DedicatedCloudDatacentersHostOrderUSCtrl", function ($state, $q, OvhHttp, User, serviceName, datacenterId) {
    "use strict";

    this.selectedOffer = null;
    this.quantity = 1;
    this.expressOrderUrl = null;

    this.fetchOffers = () => OvhHttp.get("/order/cartServiceOption/privateCloud/{serviceName}", {
        rootPath: "apiv6",
        urlParams: { serviceName }
    }).then((offers) => _.filter(offers, { family: "host" })).then((offers) => OvhHttp.get("/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/orderableHostProfiles", {
        rootPath: "apiv6",
        urlParams: {
            serviceName,
            datacenterId
        }
    }).then((profiles) => {
        const result = [];
        angular.forEach(offers, (offer) => {
            const profile = _.filter(profiles, { name: offer.planCode });
            if (profile.length === 1) {
                offer.profile = _.first(profile);
                result.push(offer);
            }
        });
        const sortedResult = _.sortBy(result, (item) => item.prices[0].price.value);
        this.selectedOffer = _.first(sortedResult);
        return sortedResult;
    }));

    this.fetchDatagridOffers = () => this.fetchOffers().then((offers) => ({
        data: offers,
        meta: {
            totalCount: offers.length
        }
    }));

    this.getBackUrl = () => $state.href("app.dedicatedClouds.datacenter.hosts");

    this.getOrderUrl = () => {
        const price = _.first(this.selectedOffer.prices);
        return `${this.expressOrderUrl}review?products=${JSURL.stringify([{
            productId: "privateCloud",
            serviceName,
            planCode: this.selectedOffer.planCode,
            duration: price.duration,
            pricingMode: price.pricingMode,
            quantity: this.quantity,
            configuration: [{
                label: "datacenter_id",
                values: [datacenterId]
            }]
        }])}`;
    };

    this.init = () => {
        this.loading = true;
        return User.getUrlOf("express_order").then((url) => {
            this.expressOrderUrl = url;
        }).finally(() => {
            this.loading = false;
        });
    };

    this.init();
});

