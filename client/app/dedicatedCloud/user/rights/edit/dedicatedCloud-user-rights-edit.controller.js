class DedicatedCloudUserRightsEditCtrl {
    constructor ($scope, $q, $stateParams, DedicatedCloud) {
        this.$scope = $scope;
        this.$q = $q;
        this.$stateParams = $stateParams;
        this.DedicatedCloud = DedicatedCloud;

        this.user = null;
        this.right = null;
        this.datacenter = null;
        this.enums = null;

        this.loading = {
            init: false,
            save: false
        };

        // to ensure compatibility with widzard step...
        this.$scope.save = () => {
            this.setUserRight();
        };
    }

    $onInit () {
        this.loading.init = true;

        return this.$q.all({
            user: this.DedicatedCloud.getUserDetail(this.$stateParams.productId, this.$stateParams.userId),
            right: this.DedicatedCloud.getUserRight(this.$stateParams.productId, this.$stateParams.userId, this.$scope.currentActionData.rightId),
            models: this.DedicatedCloud.getModels()
        }).then((response) => {
            this.user = response.user;
            this.right = response.right;
            this.enums = {
                right: response.models.models["dedicatedCloud.right.RightEnum"].enum,
                networkRole: response.models.models["dedicatedCloud.right.NetworkRoleEnum"].enum,
                vmNetworkRole: response.models.models["dedicatedCloud.right.VmNetworkRoleEnum"].enum
            };

            return this.DedicatedCloud.getDatacenterInfoProxy(this.$stateParams.productId, this.right.datacenterId).then((datacenter) => {
                this.datacenter = datacenter;
            });
        }).catch((error) => {
            this.$scope.resetAction();
            this.$scope.setMessage(this.$translate.instant("dedicatedCloud_USER_right_get_fail"), {
                type: "ERROR",
                message: error.message
            });
        }).finally(() => {
            this.loading.init = false;
        });
    }

    setUserRight () {
        this.loading.save = true;

        return this.DedicatedCloud.setUserRights(this.$stateParams.productId, this.$stateParams.userId, this.right).then(() => {
            this.$scope.setMessage(this.$scope.tr("dedicatedCloud_USER_right_set_success", [this.user.name, this.datacenter.name]), true);
        }).catch((err) => {
            this.$scope.setMessage(this.$scope.tr("dedicatedCloud_USER_right_set_fail", [this.user.name, this.datacenter.name]), {
                type: "ERROR",
                message: err.message
            });
        }).finally(() => {
            this.loading.save = false;
            this.$scope.resetAction();
        });
    }
}

angular.module("App").controller("DedicatedCloudUserRightsEditCtrl", DedicatedCloudUserRightsEditCtrl);
