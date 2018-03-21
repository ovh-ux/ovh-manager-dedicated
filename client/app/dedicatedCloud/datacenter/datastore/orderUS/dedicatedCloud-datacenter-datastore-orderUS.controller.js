angular.module("App").controller("DedicatedCloudDatacentersDatastoreOrderUSCtrl", function ($scope, $state, $q, OvhHttp, User, serviceName, datacenterId) {
    "use strict";

    this.selectedOffer = null;
    this.quantity = 1;
    this.expressOrderUrl = null;

    this.fetchOffers = () => OvhHttp.get("/order/cartServiceOption/privateCloud/{serviceName}", {
        rootPath: "apiv6",
        urlParams: { serviceName }
    }).then((offers) => _.filter(offers, { family: "datastore" })).then((offers) => {
        const sortedResult = _.sortBy(offers, (item) => item.prices[0].price.value);
        this.selectedOffer = _.first(sortedResult);
        return sortedResult;
    });

    this.fetchDatagridOffers = () => this.fetchOffers().then((offers) => ({
        data: offers,
        meta: {
            totalCount: offers.length
        }
    }));

    this.getBackUrl = () => $state.href("app.dedicatedClouds.datacenter.datastores");

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
        }).catch((err) => {
            $scope.setMessage($scope.tr("dedicatedCloud_tab_datastores_loading_error"), {
                message: err.message || err,
                type: "ERROR"
            });
        }).finally(() => {
            this.loading = false;
        });
    };

    this.init();
});

