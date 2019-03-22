import { ORDER_STATUS } from './constants';
import { OPTION_TYPES } from './servicePack/option/constants';

import PendingOrderService from './pendingOrderService';

export default class OptionTile {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $translate,
    servicePackService,
    servicePackOptionService,
    pendingOrderService,
    preferenceService,
    ACTIVATION_STATUS,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.servicePackService = servicePackService;
    this.servicePackOptionService = servicePackOptionService;
    this.pendingOrderService = pendingOrderService;
    this.preferenceService = preferenceService;
    this.ACTIVATION_STATUS = ACTIVATION_STATUS;
  }

  $onInit() {
    this.bindings = {};

    return this.handleInitialData();
  }

  handleStatus() {
    const fetchOrderAndMergeWithPreference = preference => this.pendingOrderService
      .fetchOrder(preference.id)
      .then(order => ({
        ...preference,
        ...order,
      }));

    return this.preferenceService
      .doesPreferenceExists(this.currentService.serviceName)
      .then((exists) => {
        if (!exists) {
          return this.$q.reject({ status: 'ODE' });
        }

        return this.preferenceService
          .fetchPreference(this.currentService.serviceName);
      })
      .then(fetchOrderAndMergeWithPreference)
      .then((mergeResult) => {
        const orderHasBeenDelivered = mergeResult.orderedServicePackName
          === this.currentService.servicePackName;

        if (orderHasBeenDelivered) {
          return this.preferenceService.removePreference(this.currentService.serviceName);
        }

        this.pendingOrder = mergeResult;

        return null;
      })
      .catch((error) => {
        if (error.status === 'ODE') {
          this.pendingOrder = null;
        }

        return error;
      });
  }

  handleInitialData() {
    this.bindings.isLoading = true;

    return this.$q
      .all([
        this.handleOptionNames(),
        this.handleServicePacks(),
        this.handleStatus(),
      ])
      .then(() => {
        this.currentServicePack = _.find(
          this.servicePacks,
          { name: this.currentService.servicePackName },
        );

        this.orderableServicePacksWithOnlyBasicOptions = _.filter(
          _.reject(this.servicePacks, { name: this.currentService.servicePack }),
          servicePack => _.every(
            servicePack.options,
            option => _.isEqual(option.type, OPTION_TYPES.basic),
          ),
        );

        this.buildDataAfterFetching();
      })
      .catch((error) => {
        this.$scope.$broadcast('dedicatedCloud.setMessage', {
          message: error.data.message,
          type: 'error',
        });
      })
      .finally(() => {
        this.bindings.isLoading = false;
      });
  }

  handleOptionNames() {
    return this.servicePackOptionService
      .fetchAllExistingOptionNames(this.currentService.serviceName)
      .then((optionNames) => {
        this.optionNames = optionNames;
      });
  }

  handleServicePacks() {
    return this.servicePackService
      .buildAllForService(this.currentService.serviceName, this.currentUser.ovhSubsidiary)
      .then((servicePacks) => {
        this.servicePacks = servicePacks;
      });
  }

  buildStatusForOption({ name, typeName }) {
    const orderIsInProgress = this.pendingOrder != null;
    const optionIsPartOfCurrentServicePack = _.some(
      this.currentServicePack.options,
      { name },
    );

    if (
      !orderIsInProgress
      || (orderIsInProgress && this.pendingOrder.activationType !== typeName)
    ) {
      return optionIsPartOfCurrentServicePack
        ? this.ACTIVATION_STATUS.enabled
        : this.ACTIVATION_STATUS.disabled;
    }

    if (this.pendingOrder.status === ORDER_STATUS.unknown) {
      return this.ACTIVATION_STATUS.unknown;
    }

    return PendingOrderService
      .mapOrderStatusToActivationStatus(this.pendingOrder.status);
  }

  isDiscoverLinkDisplayed(status) {
    return status.name === this.ACTIVATION_STATUS.disabled.name;
  }

  buildBasicOptions() {
    return this.optionNames
      .filter(optionName => this.servicePackOptionService.getType(optionName)
        === OPTION_TYPES.basic)
      .map((optionName) => {
        const status = this.buildStatusForOption({
          name: optionName,
          typeName: OPTION_TYPES.basic,
        });

        return {
          discoverURL: this.servicePackOptionService
            .getDiscoverURL(optionName, this.currentUser.ovhSubsidiary),
          displayDiscoverLink: this.isDiscoverLinkDisplayed(status),
          name: optionName,
          status,
        };
      });
  }

  orderCanBeChangedOrPassed() {
    return this.pendingOrder == null || this.pendingOrder.status === ORDER_STATUS.notPaid;
  }

  isBasicMenuDisplayed() {
    return this.isBasicActionMenuModifyDisplayed()
      || this.isBasicActionMenuValidateActivationDisplayed();
  }

  isBasicActionMenuModifyDisplayed() {
    return this.orderableServicePacksWithOnlyBasicOptions.length > 1
      && this.orderCanBeChangedOrPassed();
  }

  isBasicActionMenuValidateActivationDisplayed() {
    return this.orderCanBeChangedOrPassed();
  }

  buildDataAfterFetching() {
    Object.assign(
      this.bindings,
      {
        isLoading: false,
        basic: {
          options: this.buildBasicOptions(),
          actionMenu: {
            isDisplayed: this.isBasicMenuDisplayed(),
            modify: {
              text: this.buildBasicMenuModifyText(),
              isDisplayed: this.isBasicActionMenuModifyDisplayed(),
              stateParams: {
                activationType: OPTION_TYPES.basic,
                orderableServicePacks: this.orderableServicePacksWithOnlyBasicOptions,
                servicePacks: this.servicePacks,
              },
            },
            validateActivation: {
              isDisplayed: this.isBasicActionMenuValidateActivationDisplayed(),
              url: _.get(this.pendingOrder, 'url'),
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
              stateParams: {
                activationType: OPTION_TYPES.certification,
                orderableServicePacks: this.orderableServicePacksWithCertifications,
                servicePacks: this.servicePacks,
              },
            },
          },
        },
      },
    );
  }

  getCertificationDescription() {
    return this.$translate.instant(this.certification != null
      ? `dedicatedCloudDashboardTilesOptions_certification_description_name_${this.currentService.servicePackName}`
      : this.$translate.instant('dedicatedCloudDashboardTilesOptions_certification_description_noCertification'));
  }

  isCertificationActionMenuDisplayed() {
    return this.orderCanBeChangedOrPassed();
  }

  buildBasicMenuModifyText() {
    return this.$translate.instant(this.buildBasicOptions().length === 0
      ? 'dedicatedCloudDashboardTilesOptions_basic_actionMenu_activateOptions'
      : 'dedicatedCloudDashboardTilesOptions_basic_actionMenu_modifyOptions');
  }
}
