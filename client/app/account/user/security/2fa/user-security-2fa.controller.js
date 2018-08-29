angular.module('UserAccount').controller('UserAccount.controllers.doubleAuth.2fa.enable', [
  '$rootScope',
  '$scope',
  '$q',
  '$translate',
  'UserAccount.services.doubleAuth.backupCode',
  'UserAccount.services.doubleAuth.sms',
  'UserAccount.services.doubleAuth.totp',
  'UserAccount.services.doubleAuth.u2f',
  'Alerter',
  function ($rootScope, $scope, $q, $translate, DoubleAuthBackupCodeService, DoubleAuthSmsService,
    DoubleAuthTotpService, DoubleAuthU2fService, Alerter) {
    $scope.step1 = {
      doubleAuthType: null,
      isActive: false,
    };

    $scope.step2 = {
      sms: {
        phone: null,
        code: null,
        secret: null,
        description: null,
        isSendingCode: false,
        isValidating: false,
      },
      totp: {
        qrCode: null,
        size: 220,
        code: null,
        showSecret: false,
        description: null,
        isLoading: false,
        isAdding: false,
        hasValidCode: false,
      },
      u2f: {
        registerChallenge: null,
        description: null,
        isLoading: false,
      },
      isActive: false,
      hasError: false,
    };

    $scope.step3 = {
      backupCode: {
        codes: null,
        isGenerating: false,
        hasGenerated: false,
      },
      isActive: false,
    };

    $scope.step4 = {
      isActive: false,
    };

    /* ===============================
    =            HELPERS            =
    =============================== */

    /**
     * Does 2fa Sms is available.
     * @type {Boolean}
     */
    $scope.does2faSmsIsAvailable = () => DoubleAuthSmsService.isSupported();

    $scope.getDoubleAuthType = () => $scope.step1.doubleAuthType;

    /**
     * Does step 1 is valid.
     * @return {Boolean}
     */
    $scope.doesStep1IsValid = () => angular.isString($scope.step1.doubleAuthType)
      && _.size($scope.step1.doubleAuthType);

    /**
     * Does step 2 is valid.
     * @return {Boolean}
     */
    $scope.doesStep2IsValid = () => {
      switch ($scope.getDoubleAuthType()) {
        case 'sms':
          return angular.isObject($scope.step2.sms.secret)
            && this.userAccountAdd2faSmsForm
            && this.userAccountAdd2faSmsForm.$valid;
        case 'totp':
          return this.userAccountAdd2faTotpForm && this.userAccountAdd2faTotpForm.$valid;
        case 'u2f':
          return this.userAccountAdd2faU2fDescriptionForm
            && this.userAccountAdd2faU2fDescriptionForm.$valid;
        default:
          return false;
      }
    };

    /**
     * Fetch sms code.
     * @return {Promise}
     */
    $scope.fetchSmsCode = () => {
      $scope.step2.sms.isSendingCode = true;
      return DoubleAuthSmsService.post($scope.step2.sms.phone)
        .then((smsSecret) => {
          $scope.step2.sms.secret = smsSecret;
          return smsSecret;
        })
        .finally(() => {
          $scope.step2.sms.isSendingCode = false;
        });
    };

    /**
     * Generate Backup Code.
     * @return {Promise}
     */
    $scope.generateBackupCode = () => {
      $scope.step3.backupCode.isGenerating = true;
      return DoubleAuthBackupCodeService.post()
        .then((backupCodes) => {
          $scope.step3.backupCode.hasGenerated = true;
          $scope.step3.backupCode.codes = _.get(backupCodes, 'codes', null);
          return backupCodes;
        })
        .finally(() => {
          $scope.step3.backupCode.isGenerating = false;
        });
    };

    /**
     * Add U2F Key.
     * @return {Promise}
     */
    $scope.addKey = () => {
      $scope.step2.hasError = false;
      return DoubleAuthU2fService.post()
        .then((registerChallenge) => {
          $scope.step2.u2f.registerChallenge = registerChallenge;
          $scope.step2.u2f.description = _.get(registerChallenge, 'key.description', '');
        })
        .catch((err) => {
          let key = null;
          if (err.response.errorCode === 3 || err.response.errorCode === 4) {
            key = `user_account_security_double_auth_type_u2f_add_error_code_${err.response.errorCode}`;
          } else {
            key = 'user_account_security_double_auth_type_u2f_add_error';
          }
          $scope.step2.hasError = true;
          Alerter.error($translate.instant(key), 'doubleAuthAlert2fa');
        });
    };

    /**
     * Valid code helper.
     * - We validate double authentifcation sms/totp.
     * - We generate backup code.
     *
     * @return {Promise}
     */
    $scope.validCode = () => {
      switch ($scope.getDoubleAuthType()) {
        case 'sms':
          return DoubleAuthSmsService
            .validate($scope.step2.sms.secret.id, $scope.step2.sms.code)
            .then(() => {
              if (!_.isEmpty($scope.step2.sms.description)) {
                return DoubleAuthSmsService.edit(
                  $scope.step2.sms.secret.id,
                  $scope.step2.sms.description,
                );
              }
              return $q.when();
            })
            .catch((err) => {
              $scope.step2.hasError = true;
              Alerter.alertFromSWS(
                $translate.instant('user_account_security_double_auth_type_sms_error_validate'),
                {
                  message: err.data.message,
                  type: 'error',
                },
                'doubleAuthAlert2fa',
              );
              return $q.reject();
            });
        case 'totp':
          return DoubleAuthTotpService
            .validate($scope.step2.totp.qrCode.id, $scope.step2.totp.code)
            .then(() => {
              if (!_.isEmpty($scope.step2.totp.description)) {
                return DoubleAuthTotpService.edit(
                  $scope.step2.totp.qrCode.id,
                  $scope.step2.totp.description,
                );
              }
              return $q.when();
            })
            .catch((err) => {
              $scope.step2.hasError = true;
              Alerter.alertFromSWS(
                $translate.instant('user_account_security_double_auth_type_totp_error_validate'),
                {
                  message: err.data.message,
                  type: 'error',
                },
                'doubleAuthAlert2fa',
              );
              return $q.reject();
            });
        case 'u2f':
          if (!_.isEmpty($scope.step2.u2f.description)) {
            return DoubleAuthU2fService
              .edit($scope.step2.u2f.registerChallenge.u2fId, $scope.step2.u2f.description);
          }
          return $q.when();
        default:
          break;
      }
      return null;
    };

    /* -----  End of HELPERS  ------ */

    /* ===============================
    =            ACTIONS            =
    =============================== */

    $scope.loadFirstStep = () => {
      $scope.step1.isActive = true;
    };

    /**
     * Load second step.
     * @return {Promise}
     */
    $scope.loadSecondStep = () => {
      const promises = {};
      $scope.step2.hasError = false;
      switch ($scope.getDoubleAuthType()) {
        case 'sms':
          // Ask phone number and then send code with `fetchSmsCode` helper.
          break;
        case 'totp':
          // Add a TOTP access restriction.
          $scope.step2.totp.isLoading = true;
          if (!$scope.step2.totp.qrCode) {
            promises.totp = DoubleAuthTotpService.post();
          }
          break;
        case 'u2f':
          // Add a U2F access restriction.
          $scope.step2.u2f.isLoading = true;
          if (!$scope.step2.u2f.registerChallenge) {
            promises.u2f = $scope.addKey();
          }
          break;
        default:
          break;
      }
      return $q
        .all(promises)
        .then((results) => {
          if (results.totp) {
            $scope.step2.totp.qrCode = results.totp;
          }
          if (results.u2f) {
            $scope.step2.u2f.registerChallenge = results.u2f;
          }
        })
        .finally(() => {
          $scope.step2.totp.isLoading = false;
          $scope.step2.u2f.isLoading = false;
        });
    };

    /**
     * Load third step.
     * @return {Promise}
     */
    $scope.loadThirdStep = () => $scope.generateBackupCode();

    /**
     * Load fourth step.
     * - We validate backup code.
     *
     * @return {Promise}
     */
    $scope.loadFourthStep = () => DoubleAuthBackupCodeService
      .validate(_.first($scope.step3.backupCode.codes));

    $scope.goToFirstStep = () => {
      $scope.step1.isActive = true;
      $scope.step2.isActive = false;
      $scope.step3.isActive = false;
      $scope.step4.isActive = false;
    };

    $scope.goToSecondStep = () => {
      $scope.step2.isActive = true;
      $scope.step1.isActive = false;
      $scope.step3.isActive = false;
      $scope.step4.isActive = false;
    };

    $scope.goToThirdStep = () => {
      $scope.step3.isActive = true;
      $scope.step1.isActive = false;
      $scope.step2.isActive = false;
      $scope.step4.isActive = false;
    };

    $scope.goToFourthStep = () => {
      $scope.step4.isActive = true;
      $scope.step1.isActive = false;
      $scope.step2.isActive = false;
      $scope.step3.isActive = false;
    };

    /**
     * Enable double auth.
     * @return {Promise}
     */
    $scope.enableDoubleAuth = () => {
      $rootScope.$broadcast('doubleAuthSMS.reload');
      $rootScope.$broadcast('doubleAuthTOTP.reload');
      $rootScope.$broadcast('doubleAuthU2F.reload');
      $rootScope.$broadcast('doubleAuthBackupCode.reload');
      $scope.resetAction();
    };

    /**
     * Cancel.
     */
    $scope.cancel = () => {
      $rootScope.$broadcast('doubleAuthSMS.reload');
      $rootScope.$broadcast('doubleAuthTOTP.reload');
      $rootScope.$broadcast('doubleAuthU2F.reload');
      $rootScope.$broadcast('doubleAuthBackupCode.reload');
      $scope.resetAction();
    };

    /* -----  End of ACTIONS  ------ */

    /* ==============================
    =            EVENTS            =
    ============================== */

    $scope.setDoubleAuthType = (type) => {
      $scope.step1.doubleAuthType = type;
    };

    $scope.toggleSecretField = () => {
      $scope.step2.totp.showSecret = !$scope.step2.totp.showSecret;
    };

    /* -----  End of EVENTS  ----- */
  },
]);
