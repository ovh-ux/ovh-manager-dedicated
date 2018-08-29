angular.module('UserAccount').controller('UserAccount.controllers.doubleAuth.backupCode.delete', [
  '$rootScope',
  '$scope',
  '$translate',
  'UserAccount.services.doubleAuth.backupCode',
  'Alerter',
  function ($rootScope, $scope, $translate, DoubleAuthBackupCodeService, Alerter) {
    $scope.backupCode = {
      sotpAccount: _.get($scope, 'currentActionData', {}),
      code: '',
      isDeleting: false,
    };

    /* ===============================
        =            ACTIONS            =
        =============================== */

    /**
         * Delete backupCode.
         * @return {Promise}
         */
    $scope.deleteBackupCode = () => {
      $scope.backupCode.isDeleting = true;
      return DoubleAuthBackupCodeService.disable($scope.backupCode.code)
        .then(() => DoubleAuthBackupCodeService.delete())
        .then(() => {
          $rootScope.$broadcast('doubleAuthBackupCode.reload');
          $scope.resetAction();
        })
        .catch(err => Alerter.alertFromSWS($translate.instant('user_account_security_double_auth_type_backup_code_delete_error'), err.data, 'doubleAuthAlertBackupCodeDelete'))
        .finally(() => {
          $scope.backupCode.isDeleting = false;
        });
    };

    /**
         * Cancel backupCode manage modal.
         */
    $scope.cancel = () => $scope.resetAction();

    /* -----  End of ACTIONS  ------ */
  },
]);
