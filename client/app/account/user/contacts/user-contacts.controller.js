angular.module('UserAccount')
  .controller('UserAccount.controllers.contactCtrl', class AccountUserContactsController {
    constructor($location, $q, $scope, AccountCreationURLS, Alerter, OvhApiMe) {
      this.$location = $location;
      this.$q = $q;
      this.$scope = $scope;
      this.AccountCreationURLS = AccountCreationURLS;
      this.Alerter = Alerter;
      this.OvhApiMe = OvhApiMe;
    }

    $onInit() {
      this.loaders = {
        init: false,
      };
      this.user = null;
      this.loaders.init = true;
      return this.OvhApiMe.v6().get().$promise
        .then((user) => {
          this.user = user;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(this.$translate.instant('user_account_contacts_error'), err, 'useraccount.alerts.dashboardContacts');
          return this.$q.reject(err);
        })
        .finally(() => {
          this.loaders.init = false;
        });
    }

    getAccountCreationUrl() {
      const subs = _.get(this.user, 'ovhSubsidiary', 'default');
      const languageSpecificSubs = '{$language}_{$subs}';
      const newNicUrl = this.AccountCreationURLS[languageSpecificSubs]
                              || this.AccountCreationURLS[subs];
      return newNicUrl;
    }
  });
