angular.module('Billing.controllers').controller('Billing.controllers.OvhAccount', ($scope, $filter, $timeout, $translate, BILLING_BASE_URL, BillingOvhAccount, User, BillingmessageParser, BillingdateRangeSelection) => {
  $scope.ovhAccountLoading = false;
  $scope.ovhAccountsLoading = false;
  $scope.ovhAccount = {
    model: null,
    refresh: false,
    choice: null,
    list: [],
  };

  function init() {
    $scope.ovhAccountsLoading = true;

    User.getUser().then((user) => {
      $scope.user = user;
    });

    return BillingOvhAccount.getOvhAccount()
      .then((ovhAccountList) => {
        $scope.ovhAccount.list = ovhAccountList;

        if (ovhAccountList.length) {
          const canBeCredited = _.find(ovhAccountList, {
            canBeCredited: true,
          });
          if (canBeCredited) {
            $scope.ovhAccount.choice = canBeCredited;
          } else {
            $scope.ovhAccount.choice = _.first(ovhAccountList);
          }
        } else {
          $scope.ovhAccount.model = {
            hasOvhAccount: false,
          };
        }
      })
      .catch((err) => {
        $scope.setMessage($translate.instant('ovhAccount_get_accounts_error'), err.data);
      })
      .finally(() => {
        $scope.ovhAccountsLoading = false;
      });
  }

  $scope.changeOvhAccount = function () {
    $scope.ovhAccount.model = null;
    $scope.$broadcast('paginationServerSide.loadPage', '1', 'accountTable');
  };

  $scope.loadOvhAccount = function (count, offset) {
    $scope.ovhAccountLoading = true;

    const date = BillingdateRangeSelection.dateFrom;
    const { dateTo } = BillingdateRangeSelection;
    const ovhAccount = $scope.ovhAccount.choice.ovhAccountId;

    const data = {
      count, offset, date, dateTo, ovhAccount,
    };

    return BillingOvhAccount.getBillingOvhAccount(data)
      .then((account) => {
        $scope.ovhAccount.model = account;
      })
      .catch((err) => {
        $scope.setMessage($translate.instant('ovhAccount_renew_step2_error'), err.data);
      })
      .finally(() => {
        $scope.ovhAccountLoading = false;
      });
  };

  $scope.onDateRangeChanged = function () {
    $scope.$broadcast('paginationServerSide.loadPage', '1', 'accountTable');
  };

  $scope.getPriceClasses = function (price) {
    if (price >= 0) {
      return 'bold';
    }
    return 'red bold';
  };

  $scope.$on('module.billing.credit.reload', () => {
    $scope.ovhAccount.refresh = true;
  });

  $scope.refreshCredit = function () {
    $scope.ovhAccount.refresh = false;
    $scope.ovhAccount.model = null;
    $scope.loadOvhAccount();
  };

  $scope.setAction = function (action, data) {
    if (action) {
      $scope.currentAction = action;
      $scope.currentActionData = data;

      $scope.stepPath = `${BILLING_BASE_URL}ovhAccount/${$scope.currentAction}/billing-ovhAccount-${$scope.currentAction}.html`;

      $('#currentAction').modal({
        keyboard: true,
        backdrop: 'static',
      });
    } else {
      $('#currentAction').modal('hide');
      $scope.currentActionData = null;
      $timeout(() => {
        $scope.stepPath = '';
      }, 300);
    }
  };

  $scope.resetAction = function () {
    $scope.setAction(false);
  };

  $scope.setMessage = function (message, data) {
    const msg = BillingmessageParser(message, data);
    $scope.message = msg.message;
    $scope.alertType = msg.alertType;
  };

  $scope.getDatasToExport = function () {
    const datasToReturn = [[$translate.instant('ovhAccount_table_head_id'), $translate.instant('ovhAccount_table_head_date'), $translate.instant('ovhAccount_table_head_debit'), $translate.instant('ovhAccount_table_head_credit')]];
    $scope.csvLoading = true;
    return BillingOvhAccount.getBillingOvhAccount({
      count: 0,
      offset: 0,
      date: BillingdateRangeSelection.dateFrom,
      dateTo: BillingdateRangeSelection.dateTo,
      ovhAccount: $scope.ovhAccount.choice.ovhAccountId,
    }).then((ovhAccount) => {
      angular.forEach(ovhAccount.list.results, (bill) => {
        datasToReturn.push([bill.factureNumber, $filter('date')(bill.date, 'mediumDate'), bill.debit, bill.credit]);
      });
      return datasToReturn;
    }, () => '').finally(() => {
      $scope.csvLoading = false;
    });
  };

  init();
});
