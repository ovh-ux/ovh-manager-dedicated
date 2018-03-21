angular.module("App").controller("DedicatedCloudDatacentersDatastoreOrderUSCtrl", class DedicatedCloudDatacentersDatastoreOrderUSCtrl {

    constructor ($scope, $state, OvhHttp, User, serviceName, datacenterId) {
        this.$scope = $scope;
        this.$state = $state;
        this.OvhHttp = OvhHttp;
        this.User = User;
        this.serviceName = serviceName;
        this.datacenterId = datacenterId;

        this.selectedOffer = null;
        this.quantity = 1;
        this.expressOrderUrl = null;
    }


    fetchOffers () {
        return this.OvhHttp.get("/order/cartServiceOption/privateCloud/{serviceName}", {
            rootPath: "apiv6",
            urlParams: {
                serviceName: this.serviceName
            }
        }).then((offers) => _.filter(offers, { family: "datastore" })).then((offers) => {
            const sortedResult = _.sortBy(offers, (item) => item.prices[0].price.value);
            this.selectedOffer = _.first(sortedResult);
            return sortedResult;
        });
    }

    fetchDatagridOffers () {
        return this.fetchOffers().then((offers) => ({
            data: offers,
            meta: {
                totalCount: _.size(offers)
            }
        }));
    }

    getBackUrl () {
        return this.$state.href("app.dedicatedClouds.datacenter.datastores");
    }

    getOrderUrl () {
        const price = _.first(this.selectedOffer.prices);
        return `${this.expressOrderUrl}review?products=${JSURL.stringify([{
            productId: "privateCloud",
            serviceName: this.serviceName,
            planCode: this.selectedOffer.planCode,
            duration: price.duration,
            pricingMode: price.pricingMode,
            quantity: this.quantity,
            configuration: [{
                label: "datacenter_id",
                values: [this.datacenterId]
            }]
        }])}`;
    }

    $onInit () {
        this.loading = true;
        return this.User.getUrlOf("express_order").then((url) => {
            this.expressOrderUrl = url;
        }).catch((err) => {
            this.$scope.setMessage(this.$scope.tr("dedicatedCloud_tab_datastores_loading_error"), {
                message: err.message || err,
                type: "ERROR"
            });
        }).finally(() => {
            this.loading = false;
        });
    }
});

