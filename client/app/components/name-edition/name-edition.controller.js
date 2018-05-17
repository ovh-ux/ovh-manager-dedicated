angular.module("App").controller("NameEditionCtrl", class NameEditionCtrl {

    constructor ($scope, $state, $stateParams, $timeout, $transitions, $translate, Alerter, DedicatedCloud) {
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$timeout = $timeout;
        this.$transitions = $transitions;
        this.$translate = $translate;
        this.Alerter = Alerter;
        this.DedicatedCloud = DedicatedCloud;
    }

    closeModal () {
        const successMessageDelay = 500;
        this.$state.go("^", null, { reload: true }).then(() => {
            this.$timeout(() => {
                this.Alerter.success(this.$translate.instant(`${this.modalContextTitle}_edit_success`), "dedicatedCloud");
            }, successMessageDelay);
        });
    }

    updateDescription () {
        this.updating = true;
        this.updateName()
            .then(() => {
                this.closeModal();
            }).catch((err) =>
                this.Alerter.error([this.$translate.instant(`${this.modalContextTitle}_edit_error`, {
                    t0: this.newValue
                }), _.get(err, "message")].join(". "), "dedicatedCloud")
            ).finally(() => {
                this.updating = false;
            });
    }

    $onInit () {
        this.newValue = this.$stateParams.value;
        this.contextTitle = this.$stateParams.contextTitle;

        switch (this.$stateParams.contextTitle) {
        case "dedicatedCloud_description":
            this.modalContextTitle = "dedicatedCloud_description";
            this.updateName = () => this.DedicatedCloud.updateDescription(this.$stateParams.productId, this.newValue);
            break;
        case "dedicatedCloud_datacenter_name":
            this.modalContextTitle = "dedicatedCloud_datacenter_name";
            this.updateName = () => this.DedicatedCloud.updateDatacenterName(this.$stateParams.productId, this.$stateParams.datacenterId, this.newValue);
            break;
        case "dedicatedCloud_datacenter_description":
            this.modalContextTitle = "dedicatedCloud_datacenter_description";
            this.updateName = () => this.DedicatedCloud.updateDatacenterDescription(this.$stateParams.productId, this.$stateParams.datacenterId, this.newValue);
            break;
        default:
            this.modalContextTitle = "description";
            this.updateName = angular.noop;
            break;
        }
    }
});
