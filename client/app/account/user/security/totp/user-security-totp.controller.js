angular.module('UserAccount').controller('UserAccount.controllers.doubleAuth.totp', [
  '$scope',
  '$q',
  '$translate',
  'UserAccount.services.doubleAuth.totp',
  'Alerter',
  function ($scope, $q, $translate, DoubleAuthTotpService, Alerter) {
    $scope.totp = {
      totpAccounts: null,
      isLoading: false,
    };

    /* ===============================
        =            HELPERS            =
        =============================== */

    /**
         * Fetch TOTP accounts.
         * @return {Promise}
         */
    function fetchTotpAccounts() {
      return DoubleAuthTotpService.query().then(totpIds => $q.all(_.map(totpIds, totpId => DoubleAuthTotpService.get(totpId))).then(totpAccounts => _.filter(totpAccounts, totpAccount => totpAccount.status !== 'needCodeValidation')));
    }

    /* -----  End of HELPERS  ------ */

    /* ==============================
        =            EVENTS            =
        ============================== */

    $scope.$on('doubleAuthTOTP.reload', $scope.init);

    /* -----  End of EVENTS  ----- */

    /* ======================================
        =            INITIALIZATION            =
        ====================================== */

    /**
         * Init.
         * @return {Promise}
         */
    $scope.init = () => {
      $scope.totp.isLoading = true;
      return fetchTotpAccounts()
        .then((totpAccounts) => {
          $scope.totp.totpAccounts = totpAccounts;
        })
        .catch(err => Alerter.alertFromSWS($translate.instant('user_account_security_double_auth_type_totp_error'), err.data, 'doubleAuthAlert'))
        .finally(() => {
          $scope.totp.isLoading = false;
        });
    };

    /* -----  End of INITIALIZATION  ------ */
  },
]);
