/* eslint-disable no-prototype-builtins, no-restricted-syntax */
/**
 * @ngdoc controller
 * @name Billing.controllers.Method.Add'
 * @description
 */
angular.module('Billing.controllers').controller('billingPaymentMeanAddCtrl', ($location, $q, $scope, $translate, Alerter, BillingMean, BillingUser, paymentMethodHelper, User, IBAN_BIC_RULES) => {
  $scope.loader = {
    add: false,
    means: false,
  };

  $scope.canPaymentTypeSetDefaultAtCreation = function (paymentType) {
    return BillingMean.canPaymentTypeSetDefaultAtCreation(paymentType);
  };

  $scope.checkBic = function () {
    const bicInput = $scope.paymentMeanForm.bic;
    let bic = bicInput.$viewValue;
    const bicRegExp = new RegExp(IBAN_BIC_RULES.BIC_REGEXP);

    bicInput.$setValidity('bic_valid', true);
    bicInput.$setValidity('bic_bank', true);
    if (!bic) {
      return;
    }

    bic = bic.replace(/\s/g, '').toUpperCase();
    const bicTab = bicRegExp.exec(bic);

    bicInput.$setValidity('bic_valid', !!bicTab);
    if (!bicTab) {
      return;
    }

    const bicHash = {
      bank: bicTab[1],
      country: bicTab[2],
      location: bicTab[3],
      branch: bicTab[4],
    };

    bicInput.$setValidity('bic_bank', !!bicHash.bank);
  };

  $scope.checkIban = function () {
    const ibanInput = $scope.paymentMeanForm.iban;
    let iban = ibanInput.$viewValue;
    const IBANValidationModulo = IBAN_BIC_RULES.IBAN_VALIDATION_MODULO;
    const countryBaseRegExp = IBAN_BIC_RULES.COUNTRY_BASE_REGEXP;
    const ibanRegExp = new RegExp(IBAN_BIC_RULES.IBAN_REGEXP);

    ibanInput.$setValidity('iban_valid', true);
    ibanInput.$setValidity('iban_country', true);
    ibanInput.$setValidity('iban_base', true);
    ibanInput.$setValidity('iban_key', true);

    if (!iban) {
      return;
    }

    iban = iban.replace(/\s/g, '').toUpperCase();
    const ibanTab = ibanRegExp.exec(iban);

    ibanInput.$setValidity('iban_valid', !!ibanTab);
    if (!ibanTab) {
      return;
    }

    const ibanHash = {
      country: ibanTab[1],
      key: ibanTab[2],
      remaining: ibanTab[3],
    };

    ibanInput.$setValidity('iban_country', countryBaseRegExp.hasOwnProperty(ibanHash.country));
    if (!countryBaseRegExp.hasOwnProperty(ibanHash.country)) {
      return;
    }

    const baseRegExp = countryBaseRegExp[ibanHash.country];
    ibanInput.$setValidity('iban_base', !!baseRegExp.test(ibanHash.remaining));
    if (!baseRegExp.test(ibanHash.remaining)) {
      return;
    }

    const checkString = ibanHash.remaining + ibanHash.country + ibanHash.key;

    let numericIbanString = '';
    let currentChar = '';
    let currentCharCode = -1;
    let value = '';

    for (let index = 0; index < checkString.length; index += 1) {
      currentChar = checkString.charAt(index);
      currentCharCode = checkString.charCodeAt(index);

      if (currentCharCode > 47 && currentCharCode < 58) {
        numericIbanString += currentChar;
      } else if (currentCharCode > 64 && currentCharCode < 91) {
        value = currentCharCode - 65 + 10;
        numericIbanString += value;
      } else {
        ibanInput.$setValidity('iban_valid', false);
        return;
      }
    }

    let previousModulo = 0;
    let subpart = '';
    for (let idx = 0; idx < numericIbanString.length; idx += 5) {
      subpart = `${previousModulo}${numericIbanString.substr(idx, 5)}`;
      previousModulo = subpart % IBANValidationModulo;
    }
    ibanInput.$setValidity('iban_key', previousModulo === 1);
  };

  $scope.add = function () {
    $scope.loader.add = true;

    const meanData = BillingMean.canPaymentTypeSetDefaultAtCreation($scope.mean.type) ? $scope.mean : _.omit($scope.mean, 'setDefault');

    if ($scope.customerIsFromFrance && $scope.mean.type === 'bankAccount') {
      meanData.ownerAddress = `${meanData.addressNumber || ''} ${meanData.addressStreetName} ${meanData.addressPostalCode} ${meanData.addressTown}`.trim();
      delete meanData.addressNumber;
      delete meanData.addressStreetName;
      delete meanData.addressPostalCode;
      delete meanData.addressTown;
    }

    return BillingMean.post(meanData)
      .then((response) => {
        const url = _.get(response, 'url');
        $scope.meanAdded = true;

        if (url && $scope.mean.type === 'bankAccount') {
          Alerter.set('alert-info', [$translate.instant('paymentType_bankAccount_add_success_with_download', {
            t0: url,
          }), $translate.instant('paymentType_bankAccount_processing_delay')].join(' '));

          return response;
        }

        Alerter.set('alert-info',
          `${$translate.instant('paymentType_add_validation_description')}
          ${$translate.instant('paymentType_add_success_url', { t0: url })}`);
        return response;
      })
      .catch((reason) => {
        Alerter.set('alert-danger', reason.data.message || $translate.instant('paymentType_add_error'));
        return $q.reject(reason);
      })
      .finally(() => {
        $scope.loader.add = false;
      });
  };

  /**
     * HELPERS / UTILITIES
     */

  function setPaymentMeansInScope(meanTypes) {
    $scope.means = meanTypes;

    if ($scope.means && $scope.means.length === 1) {
      $scope.mean.type = _.first($scope.means);
      $scope.meanIslocked = true;
      $scope.titleTypeOfSelect = 'no_choice';
    } else {
      const queryParam = $location.search().meanType;
      if (queryParam && $scope.means.indexOf(queryParam) !== -1) {
        $scope.mean.type = queryParam;
      }
    }
  }

  /**
     * INITIALISE
     */

  function preprocessIbanRules() {
    for (const ibanCountry in IBAN_BIC_RULES.COUNTRY_BASE_REGEXP) {
      if (IBAN_BIC_RULES.COUNTRY_BASE_REGEXP.hasOwnProperty(ibanCountry)) {
        const IBAN_LENGTH_EXTRACTOR_REGEX = new RegExp(/\{(\d+)\}/g);
        const source = IBAN_BIC_RULES.COUNTRY_BASE_REGEXP[ibanCountry].source; // eslint-disable-line
        let counter = 0;
        let myArray;
        const ibanLengthByFour = [];

        do {
          myArray = IBAN_LENGTH_EXTRACTOR_REGEX.exec(source);
          if (myArray !== null) {
            counter += parseInt(myArray[1], 10);
          }
        } while (myArray !== null);

        while (counter > 0) {
          if (counter >= 4) {
            ibanLengthByFour.push(4);
          } else {
            ibanLengthByFour.push(counter);
          }
          counter -= 4;
        }
        IBAN_BIC_RULES.IBAN_FORMAT[ibanCountry] = ibanLengthByFour; // eslint-disable-line
      }
    }
  }

  function init() {
    preprocessIbanRules();

    $scope.mean = {};
    $scope.meanAdded = false;
    $scope.titleTypeOfSelect = 'choose'; /* used to build a translation key */


    $scope.loader.means = true;

    return $q.all({
      availableMeans: BillingUser.getAvailableMeans(),
      apiSchema: (BillingMean.isApiSchemaLoaded() ? $q.when() : BillingMean.getApiSchemaPromise()),
    })
      .then(({ availableMeans }) => availableMeans
        .filter(meanType => !!BillingMean.canBeAddedByUser(meanType)))
      .then(meanTypes => setPaymentMeansInScope(meanTypes))
      .then(() => $q.all({
        user: User.getUser(),
        hasDefaultPaymentMean: paymentMethodHelper.hasDefaultPaymentMethod(),
      }))
      .then(({ user, hasDefaultPaymentMean }) => {
        $scope.customerIsFromFrance = user.billingCountry === 'FR';
        $scope.hasDefaultPaymentMean = hasDefaultPaymentMean;
      })
      .catch((error) => {
        Alerter.set('alert-danger', $translate.instant('add_mean_unable_to_get_payment_means'), error);
        $scope.meanIslocked = true;
      })
      .finally(() => {
        $scope.loader.means = false;
      });
  }

  init();
});
/* eslint-enable no-prototype-builtins, no-restricted-syntax */
