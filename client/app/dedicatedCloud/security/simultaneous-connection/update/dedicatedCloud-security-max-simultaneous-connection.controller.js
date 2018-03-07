class DedicatedCloudSecurityMaxSimultaneousConnectionsCtrl {
    constructor ($scope, $stateParams, DedicatedCloud, translator) {
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.DedicatedCloud = DedicatedCloud;
        this.translator = translator;
        this.tr = translator.tr;

        this.maxSimultaneousConnections = {
            value: null,
            current: $scope.currentActionData
        };

        $scope.update = this.update.bind(this);
    }

    update () {
        this.$scope.resetAction();
        this.DedicatedCloud.updateMaxConcurrentConnections(this.$stateParams.productId, this.maxSimultaneousConnections.value)
            .then((data) => {
                this.$scope.setMessage(
                    this.tr("dedicatedCloud_SECURITY_change_nb_simultaneous_connection_success"),
                    _.assign(
                        {
                            type: "success"
                        },
                        data
                    )
                );
            })
            .catch((err) => {
                this.$scope.setMessage(this.tr("dedicatedCloud_SECURITY_change_nb_simultaneous_connection_failure"), err.data);
            });
    }
}

angular.module("App").controller("DedicatedCloudSecurityMaxSimultaneousConnectionsCtrl", DedicatedCloudSecurityMaxSimultaneousConnectionsCtrl);
