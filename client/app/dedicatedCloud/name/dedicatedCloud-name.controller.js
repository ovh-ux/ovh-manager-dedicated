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
        this.DedicatedCloud.updateDescription(this.$stateParams.productId, this.newValue);
        this.updateName()
            .then(() => {
                this.$scope.setMessage(this.$translate.instant(`dedicatedCloud_edit_${this.translateWord}_success`), {
                    type: "SUCCESS"
                });
                _.set(this.$scope, this.$scope.currentActionData.path, this.newValue);
                this.closeModal();
            }).catch((err) => {
                this.$scope.setMessage(this.$translate.instant(`dedicatedCloud_edit_${this.translateWord}_error`, [this.newValue]), {
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
            this.translateWord = "description";
            this.updateName = () => this.DedicatedCloud.updateDescription(this.$stateParams.productId, this.newValue);
            break;
        case "datacenterName.model":
            this.translateWord = "datacenter_name";
            this.updateName = () => this.DedicatedCloud.updateDatacenterName(this.$stateParams.productId, this.$stateParams.datacenterId, this.newValue);
            break;
        case "datacenterDescription.model":
            this.translateWord = "datacenter_description";
            this.updateName = () => this.DedicatedCloud.updateDatacenterDescription(this.$stateParams.productId, this.$stateParams.datacenterId, this.newValue);
            break;
        default:
            this.translateWord = "description";
            break;
        }
    }
});
