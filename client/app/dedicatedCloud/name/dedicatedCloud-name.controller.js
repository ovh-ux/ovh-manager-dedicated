angular.module("App").controller("DedicatedCloudNameCtrl", class {

    constructor ($scope, $stateParams, $translate, DedicatedCloud) {
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.DedicatedCloud = DedicatedCloud;
    }

    closeModal () {
        this.$scope.resetAction();
    }

    updateDescription () {
        this.updating = true;
        this.updateName()
            .then(() => {
                this.$scope.setMessage(this.$translate.instant(`dedicatedCloud_edit_${this.modalContextTitle}_success`), {
                    type: "SUCCESS"
                });
                _.set(this.$scope, this.$scope.currentActionData.path, this.newValue);
                this.closeModal();
            }).catch((err) => {
                this.$scope.setMessage(this.$translate.instant(`dedicatedCloud_edit_${this.modalContextTitle}_error`, [this.newValue]), {
                    message: err.message,
                    type: "ERROR"
                });
            }).finally(() => {
                this.updating = false;
            });
    }

    $onInit () {
        this.newValue = this.$scope.currentActionData.value;

        switch (this.$scope.currentActionData.path) {
        case "dedicatedCloud.description":
            this.modalContextTitle = "description";
            this.updateName = () => this.DedicatedCloud.updateDescription(this.$stateParams.productId, this.newValue);
            break;
        case "datacenterName.model":
            this.modalContextTitle = "datacenter_name";
            this.updateName = () => this.DedicatedCloud.updateDatacenterName(this.$stateParams.productId, this.$stateParams.datacenterId, this.newValue);
            break;
        case "datacenterDescription.model":
            this.modalContextTitle = "datacenter_description";
            this.updateName = () => this.DedicatedCloud.updateDatacenterDescription(this.$stateParams.productId, this.$stateParams.datacenterId, this.newValue);
            break;
        default:
            this.modalContextTitle = "description";
            this.updateName = angular.noop;
            break;
        }
    }
});
