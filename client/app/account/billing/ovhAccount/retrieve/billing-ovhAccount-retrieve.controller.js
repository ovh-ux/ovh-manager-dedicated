angular.module("Billing.controllers").controller("Billing.controllers.OvhAccountRetrieve", ($scope, $location, $timeout, $window, $q, Alerter, BillingOvhAccount, BillingPaymentInformation, User, OVH_ACCOUNT_EVENT) => {
    $scope.accountModel = $scope.currentActionData;
    $scope.retrieve = {
        amount: 0,
        account: ""
    };

    $scope.initStep1 = () => {
        $scope.loading = true;
        $q
            .all([BillingPaymentInformation.getValidBankAccounts(), User.getUser()])
            .then((data) => {
                $scope.bankAccounts = data[0];
                $scope.user = data[1];
            })
            .finally(() => ($scope.loading = false));
    };

    $scope.goToAddBankAccount = () => {
        $scope.resetAction();
        $timeout(() => $location.path("/billing/mean/add"), 300);
    };

    $scope.initStep2 = () => {
        $scope.loading = true;
        BillingOvhAccount.retrieveMoney($scope.accountModel.accountId, $scope.retrieve.amount * 100, $scope.retrieve.account.id)
            .then((order) => {
                $scope.$emit(OVH_ACCOUNT_EVENT.TRANSFER_TO_BANK_ACCOUNT);
                $scope.retrieveOrder = Object.assign({}, order, {
                    prices: {
                        withTax: order.priceWithTax,
                        withoutTax: order.priceWithoutTax,
                        tax: order.tax
                    }
                });
            })
            .catch((err) => {
                Alerter.alertFromSWS($scope.tr("ovhAccount_retrieve_error"), err);
                $scope.resetAction();
            })
            .finally(() => ($scope.loading = false));
    };

    $scope.retrieve = () => {
        $window.open($scope.retrieveOrder.url);
        Alerter.success($scope.tr("ovhAccount_retrieve_success", [$scope.retrieveOrder.url]));
        $scope.resetAction();
    };
});
