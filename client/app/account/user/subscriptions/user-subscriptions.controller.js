angular.module("UserAccount.controllers").controller("UserAccount.controllers.Subscriptions", [
    "$scope",
    "UserAccount.services.Subscriptions",
    "User",
    "Alerter",
    function ($scope, UseraccountSubscriptions, User, Alerter) {
        "use strict";

        $scope.subscriptions = {};
        $scope.subscriptionsLoading = false;

        function loadSubscriptions () {
            $scope.subscriptionsLoading = true;
            UseraccountSubscriptions.getUseraccountSubscriptions()
                .then(
                    (data) => {
                        $scope.subscriptions = data;
                    },
                    (err) => {
                        Alerter.alertFromSWS($scope.tr("subscriptions_error"), err, "SubscriptionAlerter");
                    }
                )
                .finally(() => {
                    $scope.subscriptionsLoading = false;
                });
        }

        $scope.updateUseraccountSubscription = function (state, type) {
            UseraccountSubscriptions.updateUseraccountSubscription(type, state).catch((err) => {
                Alerter.alertFromSWS($scope.tr("subscriptions_error"), err, "SubscriptionAlerter");
            });
        };

        loadSubscriptions();
    }
]);
