import { ORDER_STATUSES } from './constants';

export default class OptionTile {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    dedicatedCloudServicePack,
    servicePackOptionService,
    optionTile,
    User,
    DEDICATED_CLOUD_ACTIVATION_STATUS,
    DEDICATED_CLOUD_SERVICE_PACK_OPTION,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.dedicatedCloudServicePack = dedicatedCloudServicePack;
    this.servicePackOptionService = servicePackOptionService;
    this.optionTile = optionTile;
    this.User = User;
    this.ACTIVATION_STATUS = DEDICATED_CLOUD_ACTIVATION_STATUS;
    this.OPTION_TYPES = DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTION_TYPES;
  }

  fetchCurrentUser() {
    return this.User
      .getUser();
  }

  fetchOptionNames() {
    return this.servicePackOptionService
      .fetchAllExistingOptionNames(this.currentService.serviceName);
  }

  fetchPendingOrder() {
    return this.optionTile
      .fetchPendingServicePackOrder();
  }

  fetchServicePacks() {
    return this.dedicatedCloudServicePack
      .buildAllForService(this.currentService.serviceName, this.currentUser.ovhSubsidiary);
  }

  buildDataBeforeFetching() {
    this.bindings = {};
  }

  fetchInitialData() {
    this.bindings.isLoading = true;

    return this.$q
      .all({
        currentUser: this.fetchCurrentUser(),
        optionNames: this.fetchOptionNames(),
        pendingOrder: this.fetchPendingOrder(),
      })
      .then(({
        currentUser,
        optionNames,
        pendingOrder,
      }) => {
        this.currentUser = currentUser;
        this.optionNames = optionNames;
        this.pendingOrder = pendingOrder;

        return this.fetchServicePacks();
      })
      .then((servicePacks) => {
        this.servicePacks = servicePacks;

        this.orderableServicePacksWithOnlyBasicOptions = _.filter(
          _.reject(this.servicePacks, { name: this.currentService.servicePack }),
          servicePack => _.every(
            servicePack.options,
            option => _.isEqual(option.type, this.OPTION_TYPES.basic),
          ),
        );

        return this.optionTile.removeServicePackOrderPreferencesIfNeeded();
      })
      .then(() => {
        this.buildDataAfterFetching();
      })
      .catch((error) => {
        this.a = error;
      })
      .finally(() => {
        this.bindings.isLoading = false;
      });
  }

  buildStatusForOption({ name, typeName }) {
    const orderIsInProgress = this.pendingOrder != null;

    if (
      !orderIsInProgress
      || (orderIsInProgress && this.pendingOrder.activationType !== typeName)
    ) {
      return this.currentServicePack.name === name
        ? this.ACTIVATION_STATUS.enabled
        : this.ACTIVATION_STATUS.disabled;
    }

    if (this.pendingOrder.order.status === ORDER_STATUSES.delivered
        && this.currentServicePack.name !== name) {
      throw new Error('optionTile.buildStatusForOption: the ordered service pack should be already delivered');
    }

    if (this.pendingOrder.order.status === ORDER_STATUSES.unknown) {
      return this.ACTIVATION_STATUS.unknown;
    }

    return this.optionTile.mapOrderStatusToActivationStatus(this.pendingOrder.order.status);
  }

  isDiscoverLinkDisplayed(status) {
    return status.name === this.ACTIVATION_STATUS.disabled.name;
  }

  buildBasicOptions() {
    return this.optionNames
      .filter(optionName => this.servicePackOptionService.getType(optionName)
        === this.OPTION_TYPES.basic)
      .map((optionName) => {
        const status = this.buildStatusForOption({
          name: optionName,
          typeName: this.OPTION_TYPES.basic.name,
        });

        return {
          discoverURL: this.servicePackOptionService
            .getDiscoverURL(optionName, this.currentUser.ovhSubsidiary),
          displayDiscoverLink: this.isDiscoverLinkDisplayed(status),
          name: optionName,
          status,
        };
      });

    // return _.sortBy(
    //   this.servicePacks
    //     .reduce((previousValue, currentValue) => [...previousValue, ...currentValue.options], [])
    //     .reduce((previousValue, currentValue) =>
    // (_.some(previousValue, { name: currentValue.name })
    //       ? previousValue
    //       : [...previousValue, currentValue]), [])
    //     .filter(option => option.type === this
    //       .DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTION_TYPES.basic)
    //     .map(option => ({
    //       ...option,
    //       status: _.map(currentServicePack.options, 'name').includes(option.name)
    //         ? this.DEDICATED_CLOUD_ACTIVATION_STATUS.enabled
    //         : this.DEDICATED_CLOUD_ACTIVATION_STATUS.disabled,
    //     })),
    //   'name',
    // );
  }

  isBasicActionMenuDisplayed() {
    return this.isBasicActionMenuModifyDisplayed()
      || this.isBasicActionMenuValidateActivationDisplayed();
  }

  isBasicActionMenuModifyDisplayed() {
    return this.orderableServicePacksWithOnlyBasicOptions.length > 1 && !this.pendingOrder;
  }

  isBasicActionMenuValidateActivationDisplayed() {
    return this.pendingOrder.order.status === ORDER_STATUSES.notPaid;
  }

  buildDataAfterFetching() {
    Object.assign(
      this.bindings,
      {
        isLoading: false,
        basic: {
          options: this.buildBasicOptions(),
          actionMenu: {
            isDisplayed: this.isBasicActionMenuDisplayed(),
            modify: {
              text: this.buildBasicTitle(),
              isDisplayed: this.isBasicActionMenuModifyDisplayed(),
              stateOptions: {
                activationType: this.OPTION_TYPES.basic.name,
                orderableServicePacks: this.orderableServicePacksWithOnlyBasicOptions,
                servicePacks: this.servicePacks,
              },
            },
            validateActivation: {
              isDisplayed: this.isBasicActionMenuValidateActivationDisplayed(),
              url: _.get(this.pendingOrder, 'order.url'),
            },
          },
        },
        certification: {
          description: this.getCertificationDescription(),
          interface: {
            isDisplayed: this.certification != null,
            url: this.currentService.certifiedInterfaceUrl,
          },
          actionMenu: {
            isDisplayed: this.isCertificationActionMenuDisplayed(),
            activate: {
              stateOptions: {
                activationType: this.OPTION_TYPES.certification.name,
                orderableServicePacks: this.orderableServicePacksWithCertifications,
                servicePacks: this.servicePacks,
              },
            },
          },
        },
      },
    );

    this.a = 'tr';
  }

  getCertificationDescription() {
    return this.$translate.instant(this.certification != null
      ? `certification_description_name_${this.currentService.servicePackName}`
      : this.$translate.instant('certification_description_noCertification'));
  }

  isCertificationActionMenuDisplayed() {
    return this.pendingOrder == null
      || (this.pendingOrder != null
      && this.pendingOrder.order.status === ORDER_STATUSES.notPaid);
  }

  $onInit() {
    // const currentServicePack = _.find(
    //   this.servicePacks,
    //   { name: this.currentService.servicePackName },
    // );

    // this.optionsTheCurrentServicePackHas = _.filter(
    //   this.DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTIONS,
    //   { type: this.DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTION_TYPES.basic },
    // );

    // this.allExistingOptions = _.sortBy(
    //   this.servicePacks
    //     .reduce((previousValue, currentValue) => [...previousValue, ...currentValue.options], [])
    //     .reduce((previousValue, currentValue) =>
    // (_.some(previousValue, { name: currentValue.name })
    //       ? previousValue
    //       : [...previousValue, currentValue]), [])
    //     .filter(option => option.type === this
    //       .DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTION_TYPES.basic)
    //     .map(option => ({
    //       ...option,
    //       status: _.map(currentServicePack.options, 'name').includes(option.name)
    //         ? this.DEDICATED_CLOUD_ACTIVATION_STATUS.enabled
    //         : this.DEDICATED_CLOUD_ACTIVATION_STATUS.disabled,
    //     })),
    //   'name',
    // );

    // this.numberOfActiveOptions = this.allExistingOptions
    //   .filter(option => option.status === this.DEDICATED_CLOUD_ACTIVATION_STATUS.enabled).length;

    // this.currentCertification = _.find(
    //   currentServicePack.options,
    //   { type: this.DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTION_TYPES.certification },
    // );

    // this.orderableServicePacksWithOnlyBasicOptions = _.filter(
    //   _.reject(this.servicePacks, { name: currentServicePack.name }),
    //   servicePack => _.every(
    //     servicePack.options,
    //     option => _.isEqual(option.type, this
    //       .DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTION_TYPES.basic),
    //   ),
    // );

    // this.orderableServicePacksWithCertifications = _.filter(
    //   _.reject(this.servicePacks, { name: currentServicePack.name }),
    //   servicePack => _.some(
    //     servicePack.options,
    //     option => _.isEqual(option.type, this
    //       .DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTION_TYPES.certification),
    //   ),
    // );

    // this.buildBasicOption();

    this.buildDataBeforeFetching();
    return this.fetchInitialData();
  }

  buildBasicTitle() {
    return this.$translate.instant(this.numberOfActiveOptions === 0
      ? 'dedicatedCloud_dashboard_options_basicOptions_menu_changeOption_noOption'
      : 'dedicatedCloud_dashboard_options_basicOptions_menu_changeOption_atLeastOneOption');
  }

  isOrderFor(optionType) {
    return _.get(this.pendingServicePackOrder, 'activationType') !== optionType.name;
  }

  canChangeBasicOptions() {
    return this.isOrderFor(this.DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTION_TYPES.basic);
  }

  canValidateCheckout() {
    return this.isOrderFor(this.DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTION_TYPES.basic)
      && this.pendingServicePackOrder.order.status === 'notPaid';
  }
}
