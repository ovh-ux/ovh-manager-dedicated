angular.module('UserAccount').controller('UserAccount.controllers.update', [
  'UserAccount.services.Contacts',
  '$scope',
  '$stateParams',
  '$q',
  '$location',
  '$timeout',
  '$translate',
  'AVAILABLE_LANGUAGE',
  'Alerter',
  function (Contacts, $scope, $stateParams, $q, $location, $timeout, $translate,
    AVAILABLE_LANGUAGE, Alerter) {
    $scope.languages = AVAILABLE_LANGUAGE;
    $scope.forms = {};
    $scope.today = new Date();
    $scope.alerts = {
      updateOwner: 'update_owner',
    };
    $scope.owner = {};
    $scope.ownerModel = {};
    $scope.edit = {
      value: false,
    };
    $scope.currentDomain = $stateParams.currentDomain;

    $scope.loaders = {
      owner: false,
      update: false,
    };
    $scope.controls = {};
    $scope.fieldsInError = $location.search()['fields[]'];
    $scope.updateOwnerName = false;

    function displayErrors() {
      $scope.fieldsInError = Array.isArray($scope.fieldsInError)
        ? $scope.fieldsInError
        : [$scope.fieldsInError];
      $scope.fieldsInError.forEach((field) => {
        try {
          $scope.form.accountForm[_.camelCase(field)].$setValidity('badInfos', false);
          $scope.form.accountForm[_.camelCase(field)].$setDirty(true);
        } catch (err) {
          console.log('field : ', field);
        }
      });
    }

    function updateKeyValidity(key, value) {
      if (value !== $scope.owner[key]
        && $scope.form
        && $scope.form.accountForm
        && $scope.form.accountForm[key]
        && $scope.form.accountForm[key].$error
        && $scope.form.accountForm[key].$error.badInfos) {
        try {
          $scope.form.accountForm[_.camelCase(key)].$setValidity('badInfos', true);
        } catch (err) {
          console.log('field : ', key);
        }
      }
    }

    function updateValidity() {
      angular.forEach($scope.ownerModel, (value, key) => {
        if (_.isPlainObject(value)) {
          angular.forEach(value, (childValue, childKey) => {
            updateKeyValidity(childKey, childValue);
          });
        } else {
          updateKeyValidity(key, value);
        }
      });
    }

    $scope.setFormScope = (scope) => {
      $scope.form = scope;
    };

    $scope.cancel = () => {
      $scope.edit.value = false;
      $scope.updateOwnerName = false;
    };

    $scope.edit = (errorsFlag) => {
      $scope.ownerModel = angular.copy($scope.owner);
      $scope.edit.value = true;

      $timeout(() => {
        if (errorsFlag) {
          displayErrors();
        }
      }, 1000);
    };

    $scope.getLanguageName = (code) => {
      const idx = _.findIndex($scope.languages, item => item.value === code);

      if (idx > -1) {
        return $scope.languages[idx].name;
      }

      return '-';
    };

    $scope.isMandatory = (field) => {
      if ($scope.fields && _.find($scope.fields, { fieldName: field })) {
        return _.find($scope.fields, { fieldName: field }).mandatory;
      }
      return false;
    };
    $scope.isReadonly = (field) => {
      if ($scope.fields && _.find($scope.fields, { fieldName: field })) {
        return _.find($scope.fields, { fieldName: field }).readOnly;
      }
      return false;
    };

    $scope.getOwner = () => {
      $scope.loaders.owner = true;

      return $q
        .all([
          Contacts.getLegalFormEnum().then((legalforms) => {
            $scope.controls.legalforms = legalforms;
          }),
          Contacts.getCountryEnum().then((countries) => {
            $scope.controls.countries = countries;
          }),
          Contacts.getGendersEnum().then((genders) => {
            $scope.controls.genders = genders;
          }),
          Contacts.getContactInfo($stateParams.contactId).then((contact) => {
            $scope.owner = contact;
            $scope.ownerModel = contact;
          }),
          Contacts.getContactFields($stateParams.contactId).then((fields) => {
            $scope.fields = fields;
          }),
          Contacts.getDomainsByOwner($stateParams.contactId).then((domains) => {
            $scope.domainsOwner = domains;
          }),
          $scope.currentDomain
            ? Contacts.getOrderServiceOption($scope.currentDomain).then((opts) => {
              $scope.hasTrade = _.find(opts, opt => opt.family === 'trade');
            })
            : $q.when(true),
        ])
        .then(
          () => {
            $scope.loaders.owner = false;
          },
          (err) => {
            $scope.domainsOwner = [];
            Alerter.alertFromSWS($translate.instant('user_account_info_error'), err, $scope.alerts.updateOwner);
          },
        );
    };

    $scope.save = () => {
      $scope.loaders.update = true;

      if ($scope.ownerModel.legalForm === 'individual') {
        $scope.ownerModel.organisationName = null;
        $scope.ownerModel.organisationType = null;
        $scope.ownerModel.vat = null;
      }

      return Contacts.updateContact($scope.ownerModel)
        .then(
          (newOwnerData) => {
            $scope.owner = angular.copy(newOwnerData);
            Alerter.success($translate.instant('useraccount_contacts_owner_success'), $scope.alerts.updateOwner);
          },
          (err) => {
            Alerter.alertFromSWS($translate.instant('useraccount_contacts_owner_error'), err, $scope.alerts.updateOwner);
          },
        )
        .finally(() => {
          $scope.loaders.update = false;
          $scope.edit.value = false;
          $scope.updateOwnerName = false;
        });
    };

    $scope.init = () => {
      $q
        .all({
          changeOwnerUrl: Contacts.getUrlOf('changeOwner'),
          domainOrderTradeUrl: Contacts.getUrlOf('domainOrderTrade'),
          owner: $scope.getOwner(),
        })
        .then(({ changeOwnerUrl, domainOrderTradeUrl }) => {
          $scope.changeOwnerUrl = changeOwnerUrl;
          $scope.domainOrderTradeUrl = domainOrderTradeUrl.replace('{domain}', $scope.currentDomain);

          if ($scope.hasTrade && $scope.isReadonly('email')) {
            $scope.changeOwnerUrl = $scope.domainOrderTradeUrl;
          }
          if ($scope.fieldsInError) {
            $scope.edit(true);
          }
        });
    };

    $scope.$watch(
      'ownerModel',
      _.debounce((newValue) => {
        $scope.updateOwnerName = newValue.firstName !== $scope.owner.firstName
          || newValue.lastName !== $scope.owner.lastName;

        $scope.$apply(() => {
          updateValidity();
        });
      }, 100),
      true,
    );
  },
]);
