class DedicatedCloudSecurityPolicyLogoutCtrl {
    constructor ($scope, $stateParams, DedicatedCloud, translator) {
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.DedicatedCloud = DedicatedCloud;
        this.translator = translator;
        this.tr = translator.tr;

        this.selectedLogoutPolicy = {
            value: null
        };

        $scope.modifyPolicyLogout = this.modifyPolicyLogout.bind(this);
    }

    modifyPolicyLogout () {
        this.$scope.resetAction();
        this.DedicatedCloud.modifyPolicyLogout(this.$stateParams.productId, this.selectedLogoutPolicy.value)
            .then((data) => {
                this.$scope.setMessage(
                    this.tr("dedicatedCloud_configuration_SECURITY_policy_logout_success"),
                    _.assign(
                        {
                            type: "success"
                        },
                        data
                    )
                );
            })
            .catch((err) => {
                this.$scope.setMessage(this.tr("dedicatedCloud_configuration_SECURITY_policy_logout_fail"), err.data);
            });
    }
}

angular.module("App").controller("DedicatedCloudSecurityPolicyLogoutCtrl", DedicatedCloudSecurityPolicyLogoutCtrl);
