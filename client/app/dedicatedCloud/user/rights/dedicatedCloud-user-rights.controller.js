class DedicatedCloudUserRightsCtrl {
    constructor ($scope, $stateParams, DedicatedCloud) {
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.DedicatedCloud = DedicatedCloud;

        this.rightIndex = $scope.currentActionData.rightIndex;
        this.rightsCurrentEdit = $scope.currentActionData.rightsCurrentEdit;
        this.selectedUser = $scope.currentActionData.selectedUser;
        this.rights = $scope.currentActionData.rights;

        this.$scope.save = () => {
            this.setUserRight(this.rightIndex);
        };
    }

    setUserRight (rightIndex) {
        const $scope = this.$scope;
        this.saving = true;
        if (this.rightsCurrentEdit.right === "DISABLED") {
            this.rightsCurrentEdit.canAddResource = false;
            this.rightsCurrentEdit.vmNetworkRole = "NO_ACCESS";
            this.rightsCurrentEdit.networkRole = "NO_ACCESS";
        }

        this.DedicatedCloud.setUserRights(this.$stateParams.productId, this.selectedUser.userId, this.rightsCurrentEdit)
            .then((data) => {
                $scope.setMessage($scope.tr("dedicatedCloud_USER_right_set_success", [this.selectedUser.name, this.rights.list.results[rightIndex].datacenterName]), data);
            })
            .catch((err) => {
                $scope.setMessage($scope.tr("dedicatedCloud_USER_right_set_fail", [this.selectedUser.name, this.rights.list.results[rightIndex].datacenterName]), { type: "ERROR", message: err.message });
            })
            .finally(() => {
                this.saving = false;
                $scope.resetAction();
            });
    }
}

angular.module("App").controller("DedicatedCloudUserRightsCtrl", DedicatedCloudUserRightsCtrl);
