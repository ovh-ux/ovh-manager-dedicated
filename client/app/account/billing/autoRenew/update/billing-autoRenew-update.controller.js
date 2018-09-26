
angular
  .module('Billing.controllers')
  .controller('billingAutoRenewUpdateCtrl', class BillingAutoRenewUpdateCtrl {
    constructor($filter, $q, $state, $translate, Alerter) {
      this.$filter = $filter;
      this.$q = $q;
      this.$state = $state;
      this.$translate = $translate;

      this.Alerter = Alerter;
    }

    $onInit() {
      if (_(this.servicesToChangeRenewalOf).isEmpty()) {
        return this.$state
          .go('app.account.billing.service.autoRenew')
          .then(() => this.Alerter.set('alert-danger', this.$translate.instant('billing_autoRenew_update_error_emptyArguments')));
      }

      this.serviceTypes = this.convertServicesToServiceTypes(this.servicesToChangeRenewalOf);
      this.contractsToSign = [];

      return this.$q.when();
    }

    convertServicesToServiceTypes(services) {
      if (!_(services).isArray()) {
        throw new TypeError(`[billingAutoRenewUpdateCtrl.convertServicesToServiceTypes] Argument services (${services}) is not an array`);
      }

      return services
        .map(BillingAutoRenewUpdateCtrl.flattenServicesAndSubServices)
        .reduce((previousValues, currentValue) => previousValues.concat(currentValue), [])
        .reduce((previousValues, currentService) => {
          const searchResult = BillingAutoRenewUpdateCtrl
            .searchIfArrayContainsItem(previousValues, { name: currentService.serviceType });

          if (searchResult.wasSuccessful) {
            const alreadyExistingServiceType = searchResult.item.value;
            const updatedServiceType = this.pushServiceIntoServiceType(
              currentService,
              alreadyExistingServiceType,
            );

            return BillingAutoRenewUpdateCtrl.replaceServiceTypeInServiceTypes({
              serviceTypes: previousValues,
              serviceTypeToReplace: alreadyExistingServiceType,
              replacingServiceType: updatedServiceType,
            });
          }

          const newServiceType = BillingAutoRenewUpdateCtrl.createServiceType({
            name: currentService.serviceType,
          });
          const updatedServiceType = this.pushServiceIntoServiceType(
            currentService,
            newServiceType,
          );

          return [...previousValues, updatedServiceType];
        }, []);
    }

    static searchIfArrayContainsItem(array, item) {
      const index = _(array).findIndex(arrayItem => arrayItem.name === item.name);
      const searchWasSuccessful = index !== -1;

      return {
        wasSuccessful: searchWasSuccessful,
        item: searchWasSuccessful
          ? {
            value: _(array[index]).clone(true),
            index,
          }
          : null,
      };
    }

    static flattenServicesAndSubServices(service) {
      return _(service.subProducts).isObject()
        ? Object.keys(service.subProducts)
          .map(subServiceName => service.subProducts[subServiceName])
        : service;
    }

    pushServiceIntoServiceType(service, serviceType) {
      BillingAutoRenewUpdateCtrl.testIsServiceTypeValid(serviceType);

      const services = [...serviceType.services, service];
      return this.updateServicesForServiceTypes(services, serviceType);
    }

    deleteServiceFromServiceType(service, serviceType) {
      BillingAutoRenewUpdateCtrl.testIsServiceTypeValid(serviceType);

      const services = serviceType.services
        .filter(currentService => currentService.serviceId !== service.serviceId);
      return _(services).isEmpty()
        ? null
        : this.updateServicesForServiceTypes(services, serviceType);
    }

    updateServicesForServiceTypes(services, serviceType) {
      const possibleRenewPeriods = services
        .reduce((previousValues, service) => (_(previousValues).isEmpty()
          ? service.possibleRenewPeriod
          : _(previousValues).intersection(service.possibleRenewPeriod).value()), []);

      const defaultManualRenewalType = {
        displayValue: this.$translate.instant('autorenew_service_renew_manuel'),
        value: 'MANUAL',
        isAutomatic: false,
      };

      const availableRenewalTypes = [
        defaultManualRenewalType,
        ...possibleRenewPeriods
          .map(availableRenewalType => ({
            displayValue: this.$translate.instant(this.$filter('renewFrequence')(availableRenewalType)),
            value: availableRenewalType,
            isAutomatic: true,
          }))];

      const allowsRenewalChange = services
        .every(service => BillingAutoRenewUpdateCtrl.doesServiceAllowsRenewalChange(service));
      const propertiesToUpdate = {
        services, allowsRenewalChange, availableRenewalTypes, possibleRenewPeriods,
      };

      return BillingAutoRenewUpdateCtrl
        .updateServiceTypeProperties(serviceType, propertiesToUpdate);
    }

    static testIsServiceTypeValid(serviceType) {
      const inputServiceTypeHasNameProperty = !_(serviceType).chain()
        .get('name')
        .isEmpty()
        .value();

      if (!inputServiceTypeHasNameProperty) {
        throw new Error(`[billingAutoRenewUpdateCtrl] input serviceType (${serviceType}) requires a name property`);
      }
    }

    static updateServiceTypeProperties(serviceType, properties) {
      return _(serviceType).chain()
        .clone(true)
        .assign(properties)
        .value();
    }

    static replaceServiceTypeInServiceTypes({
      serviceTypes,
      serviceTypeToReplace,
      replacingServiceType,
    }) {
      const searchResult = BillingAutoRenewUpdateCtrl.searchIfArrayContainsItem(serviceTypes, {
        name: serviceTypeToReplace.name,
      });

      if (!searchResult.wasSuccessful) {
        throw new Error(`[billingAutoRenewUpdateCtrl.buildNewServiceTypeArrayWithUpdatedServiceType] Can't find input serviceTypeToReplace ${serviceTypeToReplace} in input serviceTypes ${serviceTypes}`);
      }

      const serviceTypesClone = serviceTypes.slice();
      serviceTypesClone[searchResult.item.index] = replacingServiceType;
      return serviceTypesClone;
    }

    static createServiceType({ name }) {
      if (!_(name).isString()) {
        throw new TypeError(`[billingAutoRenewUpdateCtrl.newServiceType] Argument name (${name}) is not a string`);
      }

      return {
        name,
        services: [],
      };
    }

    static doesServiceAllowsRenewalChange(service) {
      if (!_(service.possibleRenewPeriod).isArray()) {
        throw new TypeError(`[billingAutoRenewUpdateCtrl.doesServiceAllowsRenewalChange]: input service.possibleRenewPeriod ${service.possibleRenewPeriod} should be an Array`);
      }

      const canBeRenewed = !service.renew.forced
        && !_(service.possibleRenewPeriod).isEmpty()
        && !service.renew.deleteAtExpiration;
      const onlyManualRenewalIsAllowed = _(service.possibleRenewPeriod).last() === 0;

      return canBeRenewed && !onlyManualRenewalIsAllowed;
    }

    onClickOnServiceChipCloseButton(service, serviceType) {
      const updatedServiceType = this.deleteServiceFromServiceType(service, serviceType);

      if (updatedServiceType === null) {
        this.serviceTypes = this.serviceTypes
          .filter(currentServiceType => currentServiceType.name !== serviceType.name);
      } else {
        this.serviceTypes = BillingAutoRenewUpdateCtrl.replaceServiceTypeInServiceTypes({
          serviceTypes: this.serviceTypes,
          serviceTypeToReplace: serviceType,
          replacingServiceType: updatedServiceType,
        });
      }

      this.updateConfirmationButtonAvailability();
    }

    updateConfirmationButtonAvailability() {
      const serviceTypesThatAllowRenewalChanges = this.serviceTypes
        .filter(serviceType => serviceType.allowsRenewalChange);

      this.confirmationButtonIsAvailable = !_(serviceTypesThatAllowRenewalChanges).isEmpty()
          && serviceTypesThatAllowRenewalChanges
            .every(serviceType => serviceType.selectedRenewalType);
    }
  });
