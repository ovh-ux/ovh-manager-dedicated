angular
  .module('App')
  .controller('ovhManagerPccLicenseEnable', class {
    /* @ngInject */
    constructor(
      $state,
      $stateParams,
      $translate,
      Alerter,
      ovhManagerPccLicenseEnableService,
      User,
    ) {
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.ovhManagerPccLicenseEnableService = ovhManagerPccLicenseEnableService;
      this.User = User;
    }

    $onInit() {
      this.bindings = {
        contracts: {
          areSigned: undefined,
          value: undefined,
        },
        form: {
          isValid: undefined,
        },
        offers: {
          selected: undefined,
          value: undefined,
        },
      };

      this.serviceName = this.$stateParams.productId;
      this.selectedOffer = null;

      this.loading = true;

      return this.fetchInitialData();
    }

    fetchInitialData() {
      this.bindings.isLoading = true;

      return this.fetchExpressOrderURL()
        .then(() => this.fetchOVHSubsidiary())
        .then(() => this.fetchOffers())
        .then(() => this.fetchContracts())
        .catch((error) => {
          this.Alerter.error(this.$translate.instant('dedicatedCloud_tab_licences_active_spla_load_fail'), error);

          return this.$state.go('^');
        })
        .finally(() => {
          this.bindings.isLoading = false;
        });
    }

    fetchExpressOrderURL() {
      return this.User
        .getUrlOf('express_order')
        .then((url) => {
          this.expressOrderUrl = url;
        });
    }

    fetchOVHSubsidiary() {
      return this.User
        .getUser()
        .then(({ ovhSubsidiary }) => {
          this.ovhSubsidiary = ovhSubsidiary;
        });
    }

    fetchOffers() {
      return this.ovhManagerPccLicenseEnableService
        .fetchOffers(this.serviceName)
        .then((offers) => {
          this.bindings.offers = {
            value: offers,
          };
        });
    }

    fetchContracts() {
      return this.ovhManagerPccLicenseEnableService
        .fetchContracts(_.first(this.bindings.offers.value), this.serviceName, this.ovhSubsidiary)
        .then((contracts) => {
          this.bindings.contracts.value = contracts;
        });
    }

    onOrderClick() {
      return this.$state.go('^');
    }

    isOrderButtonAvailable() {
      return this.bindings.offers.selected != null && this.bindings.contracts.areSigned;
    }

    getOrderUrl() {
      if (!this.isOrderButtonAvailable()) {
        return undefined;
      }

      const price = _.first(this.bindings.offers.selected.prices);

      return `${this.expressOrderUrl}review?products=${JSURL.stringify([{
        productId: 'privateCloud',
        serviceName: this.serviceName,
        planCode: this.bindings.offers.selected.planCode,
        duration: price.duration,
        pricingMode: price.pricingMode,
        quantity: 1,
      }])}`;
    }

    onCancelBtnClick() {
      return this.$state.go('^');
    }
  });
