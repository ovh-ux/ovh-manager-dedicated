angular
  .module('Billing.controllers')
  .controller('billingAutoRenewUpdateConfirmationCtrl', class BillingAutoRenewUpdateConfirmationCtrl {
    constructor($q, $state, $translate, Alerter, BillingAutoRenew, UserContractService) {
      this.$q = $q;
      this.$state = $state;
      this.$translate = $translate;

      this.Alerter = Alerter;
      this.BillingAutoRenew = BillingAutoRenew;
      this.UserContractService = UserContractService;
    }

    $onInit() {
      if (_(this.serviceTypes).isEmpty()) {
        return this.$state
          .go('app.account.billing.service.autoRenew')
          .then(() => this.Alerter.set('alert-danger', this.$translate.instant('billing_autoRenew_update_error_emptyArguments')));
      }

      this.userMayHaveToSignContracts = _(this.serviceTypes).find(serviceType => _(serviceType.selectedRenewalType).get('isAutomatic', false)) !== undefined;

      if (this.userMayHaveToSignContracts) {
        return this.fetchingContractsToSign();
      }

      this.contractsToSign = [];

      return this.$q.when();
    }

    fetchingContractsToSign() {
      this.isFetchingContractsToSign = true;

      return this.UserContractService
        .getAgreementsToValidate(contract => this.BillingAutoRene
          .getAutorenewContractIds().includes(contract.contractId))
        .then((rawContractsToSign) => {
          this.contractsToSign = rawContractsToSign.map(contract => ({
            name: contract.code,
            url: contract.pdf,
            id: contract.id,
          }));

          this.contractsAreSigned = _(this.contractsToSign).isEmpty();
          this.userMustSignContrats = _(this.contractsToSign).isEmpty();
        })
        .catch(() => {
          this.Alerter.set('alert-danger', this.$translate.instant('autorenew_service_update_step2_error'));
        })
        .finally(() => {
          this.isFetchingContractsToSign = false;
        });
    }

    sendRenewalUpdates() {
      this.isSendingRenewalUpdates = true;

      const servicesToSend = _(this.serviceTypes)
        .chain()
        .filter(serviceType => serviceType.selectedRenewalType)
        .map(serviceType => serviceType.services.map((service) => {
          const renewalIsAutomatic = serviceType.selectedRenewalType.isAutomatic;
          const renewalPeriod = renewalIsAutomatic ? serviceType.selectedRenewalType.value : null;

          const propertiesToUpdate = service.renewalType === 'automaticV2016'
            ? {
              period: renewalPeriod,
              manualPayment: !renewalIsAutomatic,
            }
            : {
              period: renewalPeriod,
              automatic: renewalIsAutomatic,
            };

          const serviceHasSubProducts = _(service.subProducts).isObject();
          if (serviceHasSubProducts) {
            return Object.keys(service.subProducts)
              .map(subServiceTypeName => service.subProducts[subServiceTypeName])
              .map(subService => BillingAutoRenewUpdateConfirmationCtrl
                .convertFromServiceToServiceToSend({ service: subService, propertiesToUpdate }));
          }

          return BillingAutoRenewUpdateConfirmationCtrl
            .convertFromServiceToServiceToSend({ service, propertiesToUpdate });
        }))
        .flattenDeep()
        .value();

      return this.UserContractService
        .acceptAgreements(this.contractsToSign)
        .then(() => this.BillingAutoRenew.updateServices(servicesToSend))
        .then(() => this.BillingAutoRenew.getAutorenew())
        .then(({ active: autoRenewIsAlreadyActive, renewDay }) => (autoRenewIsAlreadyActive
          ? this.$q.when()
          : this.BillingAutoRenew.putAutorenew({
            active: true,
            renewDay: renewDay > 0 && renewDay <= 30 ? renewDay : 1,
          })))
        .then(() => {
          this.Alerter.set('alert-success', this.$translate.instant('billing_autoRenew_update_success'));
        })
        .catch((err) => {
          this.Alerter.set('alert-danger', this.$translate.instant('billing_autoRenew_update_error', {
            t0: err,
          }));
        })
        .finally(() => this.$state.go('app.account.billing.service.autoRenew'));
    }

    static convertFromServiceToServiceToSend({ service, propertiesToUpdate }) {
      return {
        serviceId: service.serviceId,
        serviceType: service.serviceType,
        renew: _(service.renew)
          .chain()
          .clone(true)
          .assign(propertiesToUpdate)
          .value(),
      };
    }
  });
