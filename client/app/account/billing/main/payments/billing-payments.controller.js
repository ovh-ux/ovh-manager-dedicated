angular.module('Billing').controller('Billing.PaymentsCtrl', function ($filter, $q, $scope, $state, $translate, constants, featureAvailability, OvhApiMe) {
  this.loadPayments = ($config) => {
    let request = OvhApiMe.Deposit().v7().query().sort($config.sort.property, $config.sort.dir > 0 ? 'ASC' : 'DESC');

    _.filter($config.criteria, 'property', 'date').forEach((crit) => {
      switch (crit.operator) {
        case 'is':
          request = request.addFilter('date', 'ge', crit.value);
          request = request.addFilter('date', 'le', moment(crit.value).add(1, 'day').format('YYYY-MM-DD'));
          break;
        case 'isAfter':
          request = request.addFilter('date', 'ge', crit.value);
          break;
        case 'isBefore':
          request = request.addFilter('date', 'ge', crit.value);
          break;
        default:
          break;
      }
    });

    _.filter($config.criteria, 'property', 'amount.value').forEach((crit) => {
      request = request.addFilter('amount.value', {
        is: 'eq',
        smaller: 'lt',
        bigger: 'gt',
      }[crit.operator], crit.value);
    });

    _.filter($config.criteria, 'property', 'paymentInfo.paymentType').forEach((crit) => {
      request = request.addFilter('paymentInfo.paymentType', {
        is: 'eq',
        isNot: 'ne',
      }[crit.operator], crit.value);
    });

    return $q.all({
      count: request.clone().execute().$promise,
      deposit: request.clone().expand()
        .offset($config.offset - 1)
        .limit($config.pageSize)
        .execute().$promise,
    }).then(({ count, deposit }) => {
      this.payments = _.map(deposit, 'value');
      return {
        data: this.payments,
        meta: {
          totalCount: count.length,
        },
      };
    });
  };

  this.getDatasToExport = () => {
    const header = [
      $translate.instant('payments_table_head_id'),
      $translate.instant('payments_table_head_date'),
      $translate.instant('payments_table_head_amount'),
      $translate.instant('payments_table_head_type'),
    ];
    const result = [header];
    return result.concat(this.payments.map(payment => [
      payment.depositId,
      $filter('date')(payment.date, 'mediumDate'),
      payment.amount.text,
      this.getTranslatedPaiementType(payment),
    ]));
  };

  this.getTranslatedPaiementType = payment => (payment.paymentInfo ? $translate.instant(`common_payment_type_${payment.paymentInfo.paymentType}`) : $translate.instant('payments_table_type_not_available'));

  this.shouldDisplayDepositsLinks = () => featureAvailability.showPDFAndHTMLDepositLinks();

  this.displayActionsCol = () => constants.target !== 'US';

  this.depositDetailsHref = ({ depositId }) => $state.href('app.account.billing.main.payments.details', { id: depositId });

  this.$onInit = () => {
    this.payments = [];
    if (constants.target === 'US') {
      return OvhApiMe.DepositRequest().v6().query().$promise.then((depositRequests) => {
        this.paymentRequests = depositRequests;
        this.paymentRequestsHref = $state.href('app.account.billing.main.payments.request');
      });
    }
    return $q.when();
  };
});
