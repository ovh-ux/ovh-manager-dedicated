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
    CERTIFICATIONS_OPTION_NAME,
    UNEXISTING_PREFERENCE_ORDER,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.servicePackService = servicePackService;
    this.servicePackOptionService = servicePackOptionService;
    this.pendingOrderService = pendingOrderService;
    this.preferenceService = preferenceService;
    this.ACTIVATION_STATUS = ACTIVATION_STATUS;
    this.CERTIFICATIONS_OPTION_NAME = CERTIFICATIONS_OPTION_NAME;
    this.UNEXISTING_PREFERENCE_ORDER = UNEXISTING_PREFERENCE_ORDER;
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
          return this.$q.reject({ status: this.UNEXISTING_PREFERENCE_ORDER });
        }

        return this.preferenceService
          .fetchPreference(this.currentService.serviceName);
      })
      .then(fetchOrderAndMergeWithPreference)
      .then((pendingOrder) => {
        const orderHasBeenDelivered = pendingOrder.orderedServicePackName
          === this.currentService.servicePackName;

        const checkoutHasExpired = moment().isAfter(pendingOrder.expirationDate);

        if (orderHasBeenDelivered || checkoutHasExpired) {
          this.pendingOrder = null;

          return this.preferenceService.removePreference(this.currentService.serviceName);
        }

        this.pendingOrder = pendingOrder;

        return null;
      })
      .catch((error) => {
        if (error.status === this.UNEXISTING_PREFERENCE_ORDER) {
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

        this.orderables = {
          [OPTION_TYPES.basic]: _.filter(
            _.reject(this.servicePacks, { name: this.currentService.servicePackName }),
            servicePack => _.every(
              servicePack.options,
              option => _.isEqual(option.type, OPTION_TYPES.basic),
            ),
          ),
          [OPTION_TYPES.certification]: _.filter(
            _.reject(this.servicePacks, { name: this.currentService.servicePackName }),
            servicePack => _.some(
              servicePack.options,
              option => _.isEqual(option.type, OPTION_TYPES.certification),
            ),
          ),
        };

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

  doesCurrentServicePackHoldACertification() {
    return _.find(
      this.currentServicePack.options,
      { type: OPTION_TYPES.certification },
    ) != null;
  }

  buildCertificationDescription() {
    return this.doesCurrentServicePackHoldACertification() && this.buildStatusForOption({
      name: this.currentServicePack.name,
      typeName: OPTION_TYPES.basic,
    });
  }

  thereIsAtLeastOneOrderableItem(optionType) {
    return !_.isEmpty(this.orderables[optionType]);
  }

  thereIsAPendingOrder() {
    return this.pendingOrder != null;
  }

  pendingOrderIsNotPaid() {
    return this.thereIsAPendingOrder() && this.pendingOrder.status === ORDER_STATUS.notPaid;
  }

  isOrderable(optionType) {
    return this.thereIsAtLeastOneOrderableItem(optionType)
     && (!this.thereIsAPendingOrder() || this.pendingOrderIsNotPaid());
  }

  isBasicMenuDisplayed() {
    return this.isOrderable(OPTION_TYPES.basic)
      || this.pendingOrderIsNotPaid();
  }

  buildDataAfterFetching() {
    this.bindings = {
      ...this.bindings,
      isLoading: false,
      basic: {
        options: this.buildBasicOptions(),
        actionMenu: {
          isDisplayed: this.isBasicMenuDisplayed(),
          modify: {
            text: this.buildBasicMenuModifyText(),
            isDisplayed: this.isOrderable(OPTION_TYPES.basic),
            stateParams: {
              activationType: OPTION_TYPES.basic,
              orderableServicePacks: this.orderables[OPTION_TYPES.basic],
              servicePacks: this.servicePacks,
            },
          },
          validateActivation: {
            isDisplayed: this.pendingOrderIsNotPaid(),
            url: _.get(this.pendingOrder, 'url'),
          },
        },
      },
      certification: {
        description: {
          links: {
            managementInterface: {
              isDisplayed: this.doesCurrentServicePackHoldACertification()
                && !this.thereIsAPendingOrder(),
              url: this.currentService.certifiedInterfaceUrl,
            },
            website: {
              isDisplayed: !this.doesCurrentServicePackHoldACertification(),
              url: this.servicePackOptionService
                .getDiscoverURL(this.CERTIFICATIONS_OPTION_NAME, this.currentUser.ovhSubsidiary),
            },
          },
          name: this.getCertificationDescription(),
          status: this.buildCertificationDescription(),
        },
        actionMenu: {
          isDisplayed: this.isOrderable(OPTION_TYPES.certification) || this.pendingOrderIsNotPaid(),
          activate: {
            isDisplayed: this.isOrderable(OPTION_TYPES.certification),
            stateParams: {
              activationType: OPTION_TYPES.certification,
              orderableServicePacks: this.orderables[OPTION_TYPES.certification],
              servicePacks: this.servicePacks,
            },
          },
          validateActivation: {
            isDisplayed: this.pendingOrderIsNotPaid(),
            url: _.get(this.pendingOrder, 'url'),
          },
        },
      },
    };

    this.a = 'pouet';
  }

  getCertificationDescription() {
    return this.doesCurrentServicePackHoldACertification()
      ? `dedicatedCloudDashboardTilesOptions_certification_description_name_${this.currentService.servicePackName}`
      : this.$translate.instant('dedicatedCloudDashboardTilesOptions_certification_description_noCertification');
  }

  buildBasicMenuModifyText() {
    return this.$translate.instant(this.buildBasicOptions().length === 0
      ? 'dedicatedCloudDashboardTilesOptions_basic_actionMenu_activateOptions'
      : 'dedicatedCloudDashboardTilesOptions_basic_actionMenu_modifyOptions');
  }
}
