import PriceDisplay from '../../../../dedicatedUniverseComponents/price/priceDisplay.class';
import { PRICE_DISPLAY_TYPES } from '../../../../dedicatedUniverseComponents/price/price.constants';

angular
  .module('Billing.controllers')
  .controller('Billing.controllers.OvhAccountRetrieve', (
    $q,
    $scope,
    $state,
    $timeout,
    $translate,
    $window,
    Alerter,
    atInternet,
    BillingOvhAccount,
    ducPriceDisplayService,
    ovhPaymentMethod,
    User,
    OVH_ACCOUNT_EVENT,
  ) => {
    $scope.accountModel = $scope.currentActionData;
    $scope.retrieve = {
      amount: 0,
      account: '',
    };

    function getBankAccounts() {
      return ovhPaymentMethod.getAllPaymentMethods({
        transform: true,
      }).then(paymentMethods => _.filter(paymentMethods, paymentMethod => paymentMethod.paymentType.value === 'BANK_ACCOUNT'));
    }

    $scope.initStep1 = () => {
      $scope.loading = true;
      $q
        .all([
          getBankAccounts(),
          User.getUser(),
        ])
        .then(([bankAccounts, user]) => {
          $scope.bankAccounts = bankAccounts;
          $scope.user = user;
        })
        .finally(() => {
          $scope.loading = false;
        });
    };

    $scope.goToAddBankAccount = () => {
      $scope.resetAction();
      $timeout(() => $state.go('app.account.billing.payment.method.add', {
        from: 'app.account.billing.payment.ovhaccount',
      }), 300);
    };

    $scope.initStep2 = () => {
      $scope.loading = true;
      BillingOvhAccount
        .retrieveMoney(
          $scope.accountModel.accountId,
          $scope.retrieve.amount * 100,
          $scope.retrieve.account.paymentMethodId,
        )
        .then((order) => {
          $scope.$emit(OVH_ACCOUNT_EVENT.TRANSFER_TO_BANK_ACCOUNT);
          $scope.retrieveOrder = order;
          $scope.priceDisplay = new PriceDisplay();
          $scope.priceDisplay.addPrice(PRICE_DISPLAY_TYPES.WITH_TAX, order.priceWithTax);
          $scope.priceDisplay.addPrice(PRICE_DISPLAY_TYPES.WITHOUT_TAX, order.priceWithoutTax);
        })
        .catch((err) => {
          Alerter.alertFromSWS($translate.instant('ovhAccount_retrieve_error'), err);
          $scope.resetAction();
        })
        .finally(() => {
          $scope.loading = false;
        });
    };

    $scope.retrieve = () => {
      $window.open($scope.retrieveOrder.url);
      Alerter.success($translate.instant('ovhAccount_retrieve_success', {
        t0: $scope.retrieveOrder.url,
      }));
      $scope.resetAction();
      atInternet.trackClick({
        name: 'validation_transfer_bank_account',
        type: 'action',
        chapter1: 'payment_types',
        chapter2: 'prepaid_account',
      });
    };
  });
