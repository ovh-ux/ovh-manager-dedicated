angular.module("App").controller("NasPartitionAccessCtrl", function ($scope, $stateParams, Nas, Alerter) {
    const alerterId = "NasAlert";
    const self = this;

    self.table = {
        accessIds: [],
        accessDetails: [],
        refresh: false
    };

    self.loaders = {
        table: false
    };

    self.partitionName = $stateParams.partitionName;

    self.getAccess = function (forceRefresh) {
        self.loaders.table = true;

        Nas.getAccessIds($stateParams.nasId, self.partitionName, forceRefresh)
            .then(
                (accessIds) => {
                    self.table.accessIds = accessIds;
                    if (forceRefresh) {
                        self.table.refresh = !self.table.refresh;
                    }
                },
                (data) => {
                    self.table.accessIds = null;
                    self.loaders.table = false;
                    Alerter.alertFromSWS($scope.tr("nas_access_loading_error"), data, alerterId);
                }
            )
            .finally(() => {
                self.loaders.table = false;
            });
    };

    $scope.$on("nas_access_updated", () => {
        self.getAccess(true);
    });

    self.getAccess();
});
