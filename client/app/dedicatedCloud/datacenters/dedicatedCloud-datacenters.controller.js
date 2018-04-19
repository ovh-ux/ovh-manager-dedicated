angular.module("App")
    .controller("DedicatedCloudDatacentersCtrl", class DedicatedCloudDatacentersController {
        constructor ($q, $scope, $state, $stateParams, constants, DedicatedCloud) {
            this.$q = $q;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.constants = constants;
            this.DedicatedCloud = DedicatedCloud;
        }

        loadDatacenters ({ offset, pageSize }) {
            return this.DedicatedCloud.getDatacentersInformations(this.$stateParams.productId, pageSize, offset - 1)
                .then((result) => ({
                    data: _.get(result, "list.results"),
                    meta: {
                        totalCount: result.count
                    }
                }))
                .catch((err) => {
                    this.$scope.resetAction();
                    this.$scope.setMessage(this.$scope.tr("dedicatedCloud_datacenters_loading_error"), {
                        message: err.message,
                        type: "ERROR"
                    });
                    return this.$q.reject(err);
                })
                .finally(() => {
                    this.$scope.loading = false;
                });
        }

        hasDiscount (datacenter) {
            const hasDiscount = this.DedicatedCloud.hasDiscount(datacenter);
            if (hasDiscount) {
                this.$scope.discount.AMDPCC = true;
            }
            return hasDiscount;
        }

        orderDatastore (datacenter) {
            if (this.constants.target === "US") {
                this.$state.go("app.dedicatedClouds.datacenter.datastores.orderUS", {
                    datacenterId: datacenter.id
                });
            } else {
                this.$scope.setAction("datacenter/datastore/order/dedicatedCloud-datacenter-datastore-order", datacenter, true);
            }
        }

        orderHost (datacenter) {
            if (this.constants.target === "US") {
                this.$state.go("app.dedicatedClouds.datacenter.hosts.orderUS", {
                    datacenterId: datacenter.id
                });
            } else {
                this.$scope.setAction("datacenter/host/order/dedicatedCloud-datacenter-host-order", datacenter, true);
            }
        }
    });
