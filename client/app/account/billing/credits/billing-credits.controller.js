angular.module('Billing.controllers').controller('Billing.controllers.Credits', class BillingCreditsCtrl {
  constructor(Alerter, $translate, BillingCredits, BillingUser) {
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.billingCredits = BillingCredits;
    this.User = BillingUser;

    this.balances = null;
    this.paginatedBalances = null;

    // for pagination-front
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.nbPages = null;

    this.loading = {
      init: false,
      getBalance: false,
      creditCode: false,
    };

    this.model = {
      creditCode: null,
    };
  }

  /* ==============================
    =            HELPERS            =
    =============================== */

  static getExpiringDetails(expiring) {
    const copiedSummary = angular.copy(expiring);

    // sort by expiration date to get the less expiring item
    copiedSummary.sort((summaryItemA, summaryItemB) => {
      const dateA = new Date(summaryItemA.expirationDate);
      const dateB = new Date(summaryItemB.expirationDate);
      return dateA - dateB;
    });

    // calculate amount of expirate amount
    const totalAmount = _.reduce(_.map(copiedSummary, 'amount.value'), (total, amountValue) => total + amountValue);

    // use the text of the first item amout to build total amount object
    const totalAmountObject = {
      currencyCode: _.get(_.first(copiedSummary), 'amount.currencyCode'),
      value: totalAmount,
      text: _.get(_.first(copiedSummary), 'amount.text').replace(/\d+(?:[.,]\d+)?/, `${totalAmount.toFixed(2)}`),
    };

    return {
      expirationDate: _.get(_.first(copiedSummary), 'expirationDate'),
      amount: totalAmountObject,
      expireSoon: moment(_.get(_.first(copiedSummary), 'expirationDate')).diff(moment(), 'days') <= 7,
    };
  }

  /* -----  End of HELPERS  ------ */

  /* ===================================
    =            VOUCHER FORM            =
    ==================================== */

  addCreditCode() {
    this.loading.creditCode = true;
    return this.User.addCreditCode(this.model.creditCode)
      .then((result) => {
        this.Alerter.success(this.$translate.instant('voucher_credit_code_success', [result.amount.text]));
        this.model.creditCode = null;
        this.$onInit();
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(this.$translate.instant('voucher_credit_code_error'), err);
      })
      .finally(() => {
        this.loading.creditCode = false;
      });
  }

  /* -----  End of VOUCHER FORM  ------ */

  /* =======================================
    =            PAGINATION FRONT            =
    ======================================== */

  getBalanceDetails(balanceName) {
    this.loading.getBalance = true;
    return this.billingCredits.getBalance(balanceName);
  }

  pushBalanceDetails(balanceDetails) {
    _.set(balanceDetails, 'expiringDetails', balanceDetails.expiring && balanceDetails.expiring.length ? this.constructor.getExpiringDetails(balanceDetails.expiring) : null);
    this.paginatedBalances.push(balanceDetails);
  }

  onDetailsDone() {
    this.loading.getBalance = false;
  }

  /* -----  End of PAGINATION FRONT  ------ */

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  $onInit() {
    this.loading.init = true;

    this.balances = null;
    this.paginatedBalances = [];

    return this.billingCredits
      .queryBalance()
      .then((balances) => {
        this.balances = balances;
      })
      .catch((error) => {
        this.Alerter.set('alert-danger', [this.$translate.instant('billing_credit_balance_movements_load_error'), _.get(error, 'message')].join(' '));
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */
});
