angular.module('Billing.controllers').controller('Billing.controllers.Refunds', function ($scope, BillingRefunds, $translate, BillingUser, BillingmessageParser, BillingdateRangeSelection) {
  const FUSE_CAPACITY = 300;

  $scope.refundsLoading = false;
  $scope.refunds = null;
  $scope.refundCount = null;

  $scope.orderByState = {
    predicate: 'billingDate',
    reverse: false,
  };

  $scope.paymentType = {
    model: 0,
    values: [],
  };

  $scope.fuseRefundOpen = function () {
    return $scope.refundCount > FUSE_CAPACITY;
  };

  this.sortHistoryResult = ({ predicate, reverse }) => {
    $scope.refunds.list.results.sort((a, b) => {
      let result;
      switch (predicate) {
        case 'date':
          result = moment(a[predicate]) - moment(b[predicate]);
          break;
        case 'paymentType':
          result = $translate.instant(`common_payment_type_${a[predicate]}${a.paymentIdentifier}`).localeCompare($translate.instant(`common_payment_type_${b[predicate]}${b.paymentIdentifier}`));
          break;
        case 'priceWithTax':
          result = a[predicate].value - b[predicate].value;
          break;
        default:
          result = a[predicate].localeCompare(b[predicate]);
      }

      return reverse ? -result : result;
    });
  };

  $scope.onOrderStateChanged = (predicate, reverse) => {
    $scope.orderByState.predicate = predicate;
    $scope.orderByState.reverse = reverse;
    this.sortHistoryResult($scope.orderByState);
  };

  BillingUser.isVATNeeded().then((result) => {
    $scope.isVATNeeded = result;
  });

  $scope.loadRefunds = function (count, offset) {
    $scope.paymentType.values = [0];

    $scope.refundsLoading = true;

    return BillingRefunds.getBillingRefunds({
      count: 0,
      offset: 0,
      date: BillingdateRangeSelection.dateFrom,
      dateTo: BillingdateRangeSelection.dateTo,
    })
      .then((refundCounter) => {
        $scope.refundCount = refundCounter.count;

        return BillingRefunds.getBillingRefunds({
          count,
          offset,
          date: BillingdateRangeSelection.dateFrom,
          dateTo: BillingdateRangeSelection.dateTo,
        });
      })
      .then((refunds) => {
        $scope.refunds = refunds;
        $scope.refundsLoading = false;

        angular.forEach(refunds.list.results, (historyLine) => {
          if ($scope.paymentType.values.indexOf(historyLine.paymentType) === -1) {
            $scope.paymentType.values.push(historyLine.paymentType);
          }
        });
      })
      .catch((err) => {
        $scope.setMessage($translate.instant('ovhAccount_renew_step2_error'), err.data);
      });
  };

  $scope.onDateRangeChanged = function () {
    $scope.$broadcast('paginationServerSide.loadPage', '1', 'refundTable');
  };

  $scope.setMessage = function (message, data) {
    const msg = BillingmessageParser(message, data);
    $scope.message = msg.message;
    $scope.alertType = msg.alertType;
  };
});
