angular.module('UserAccount').controller('UserAccount.controllers.doubleAuth.totp.delete', [
  '$rootScope',
  '$scope',
  '$q',
  '$translate',
  'UserAccount.services.doubleAuth.totp',
  'Alerter',
  function ($rootScope, $scope, $q, $translate, DoubleAuthTotpService, Alerter) {
    $scope.totp = {
      totpAccount: _.get($scope, 'currentActionData', {}),
      code: null,
      isDeleting: false,
    };

    /* ===============================
        =            HELPERS            =
        =============================== */

    /**
         * Check if step is valid.
         * @return {Boolean}
         */
    $scope.doesStepIsValid = () => ($scope.totp.totpAccount.status === 'disabled' || $scope.totp.totpAccount.status === 'needCodeValidation' ? true : !_.isEmpty($scope.totp.code));

    /* -----  End of HELPERS  ------ */

    /* ===============================
        =            ACTIONS            =
        =============================== */

    /**
         * Delete double auth TOTP account.
         * @return {Promise}
         */
    $scope.deleteDoubleAuthTotp = () => {
      let promise = $q.when(true);
      if ($scope.totp.totpAccount.status === 'enabled') {
        promise = DoubleAuthTotpService.disable($scope.totp.totpAccount.id, $scope.totp.code);
      }
      $scope.totp.isDeleting = true;
      return promise
        .then(() => DoubleAuthTotpService.delete($scope.totp.totpAccount.id, $scope.totp.code))
        .then(() => {
          Alerter.success($translate.instant('user_security_double_auth_totp_delete_success'), 'doubleAuthAlertTotp');
          $rootScope.$broadcast('doubleAuthTOTP.reload');
          $scope.resetAction();
        })
        .catch(err => Alerter.alertFromSWS($translate.instant('user_security_double_auth_totp_delete_error'), err.data, 'doubleAuthAlertTotpDelete'))
        .finally(() => {
          $scope.totp.isDeleting = false;
        });
    };

    /**
         * Cancel TOTP delete modal.
         */
    $scope.cancel = () => {
      $rootScope.$broadcast('doubleAuthTOTP.reload');
      $scope.resetAction();
    };

    /* -----  End of ACTIONS  ------ */
  },
]);
