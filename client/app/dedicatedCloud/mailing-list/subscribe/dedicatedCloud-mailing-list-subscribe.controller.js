angular.module("App").controller("DedicatedCloudMailingCtrl", ($scope, dedicatedCloudMailingList, Alerter) => {
    $scope.load = {
        loading: false
    };

    $scope.mailing = {
        pcc: $scope.currentActionData,
        email: null
    };

    $scope.subscribe = function () {
        $scope.load.loading = true;
        dedicatedCloudMailingList.postMailingList($scope.mailing.email, $scope.mailing.pcc)
            .then(() => Alerter.success($scope.tr("dedicatedCloud_subscribe_mailing_step2_success", $scope.mailing.email), "dedicatedCloud"))
            .catch((err) => Alerter.alertFromSWS($scope.tr("dedicatedCloud_subscribe_mailing_step2_error", $scope.mailing.email), err, "dedicatedCloud"))
            .finally(() => {
                $scope.resetAction();
                $scope.load.loading = false;
            });
    };
});
