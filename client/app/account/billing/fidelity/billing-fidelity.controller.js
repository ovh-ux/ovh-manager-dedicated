angular.module('Billing.controllers').controller('Billing.controllers.Fidelity', ($scope, $filter, $translate, BillingFidelity, BillingUser, BillingmessageParser, BillingdateRangeSelection) => {
  $scope.fidelityLoading = false;
  $scope.fidelityAccountLoading = false;
  $scope.fidelityAccount = null;
  $scope.currency = null;

  function getItems() {
    $scope.fidelityLoading = true;

    BillingFidelity
      .getMovements(BillingdateRangeSelection.dateFrom, BillingdateRangeSelection.dateTo)
      .then((movements) => {
        $scope.tasksId = movements.reverse();
      })
      .catch((data) => {
        $scope.setMessage($translate.instant('fidelity_get_movements_error'), data.data);
        $scope.loaders.tasks = false;
      })
      .finally(() => {
        $scope.fidelityLoading = false;
      });
  }
  $scope.onDateRangeChanged = function () {
    getItems();
  };

  $scope.setMessage = function (message, data) {
    const msg = BillingmessageParser(message, data);
    $scope.message = msg.message;
    $scope.alertType = msg.alertType;
  };

  // Set items count by page
  $scope.itemsPerPage = 10;
  $scope.tasksId = [];
  $scope.tasksDetails = [];

  $scope.loaders = {
    tasks: true,
  };

  /*
  * if you want transform item must return transformated item
  * item is the current item to transform
  */
  $scope.transformItem = function (item) {
    return BillingFidelity.getMovementsDetails(item);
  };

  /*
  * call when a item of current page is transformed
  * taskDetails contains the transformated items
  */
  $scope.onTransformItemNotify = function (taskDetails) {
    $scope.tasksDetails.push(taskDetails);
  };

  /*
  * call when all item of current page are transformed
  * tasksDetails contains transformated item
  */
  $scope.onTransformItemDone = function () {
    $scope.loaders.tasks = false;
  };

  $scope.getLastUpdate = function (format) {
    if ($scope.fidelityAccount) {
      return $filter('date')($scope.fidelityAccount.lastUpdate, format);
    }
    return '';
  };

  /**
   * initialisation
   */
  function getFidelityAccount() {
    $scope.fidelityAccountLoading = true;
    return BillingFidelity.getFidelityAccount()
      .then((fidelityAccount) => {
        $scope.fidelityAccount = fidelityAccount;
        getItems();
      })
      .catch((data) => {
        if (data.status !== 404) {
          $scope.setMessage($translate.instant('fidelity_get_accounts_error'), data.data);
        } else {
          $scope.fidelityAccount = null;
        }
      })
      .finally(() => {
        $scope.fidelityAccountLoading = false;
      });
  }

  function init() {
    getFidelityAccount();

    BillingUser.getMe().then((data) => {
      $scope.currency = data.currency;
    });
  }

  init();
});
