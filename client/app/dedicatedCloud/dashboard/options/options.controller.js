import {
  CERTIFICATIONS_PRESENTATION_CONSTANTS_ID,
  NO_PENDING_ORDER_ERROR_STATUS,
  ORDER_STATUS,
} from './options.constants';
import { OPTION_TYPES } from './servicePack/option/option.constants';
import { ACTIVATION_STATUS } from './activationStatus/activationStatus.constants';
import { OvhManagerPccDashboardOptions } from './options.service';
import { OvhManagerPccServicePackOptionService } from './servicePack/option/option.service';


export default class OptionTile {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $translate,
    coreConfig,
    dedicatedCloudDrp,
    ovhManagerPccDashboardOptions,
    ovhManagerPccDashboardOptionsPreference,
    ovhManagerPccServicePackService,
    ovhManagerPccServicePackOptionService,
    DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.ovhManagerPccDashboardOptions = ovhManagerPccDashboardOptions;
    this.ovhManagerPccDashboardOptionsPreference = ovhManagerPccDashboardOptionsPreference;
    this.ovhManagerPccServicePackService = ovhManagerPccServicePackService;
    this.ovhManagerPccServicePackOptionService = ovhManagerPccServicePackOptionService;
    this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
  }

  $onInit() {
    this.bindings = {};

    return this.handleInitialData();
  }

  handleStatus() {
    const fetchOrderAndMergeWithPreference = preference => this.ovhManagerPccDashboardOptions
      .fetchOrder(preference.id)
      .then(order => ({
        ...preference,
        ...order,
      }));

    return this.ovhManagerPccDashboardOptionsPreference
      .doesPreferenceExists(this.currentService.serviceName)
      .then((exists) => {
        if (!exists) {
          return this.$q.reject({ status: NO_PENDING_ORDER_ERROR_STATUS });
        }

        return this.ovhManagerPccDashboardOptionsPreference
          .fetchPreference(this.currentService.serviceName);
      })
      .then(fetchOrderAndMergeWithPreference)
      .then((pendingOrder) => {
        const orderHasBeenDelivered = pendingOrder.orderedServicePackName
          === this.currentService.servicePackName;

        const checkoutHasExpired = moment().isAfter(pendingOrder.expirationDate);

        this.activationNeedsConfiguration = this.pendingOrder.needsConfiguration;

        if ((orderHasBeenDelivered || checkoutHasExpired) && !this.needsConfiguration) {
          this.pendingOrder = null;

          return this.ovhManagerPccDashboardOptionsPreference
            .removePreference(this.currentService.serviceName);
        }

        this.pendingOrder = pendingOrder;

        return null;
      })
      .catch((error) => {
        if (error.status === NO_PENDING_ORDER_ERROR_STATUS) {
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
        this.handleSecurityOptions(),
        this.handleServicePacks(),
      ])
      .then(() => this.handleStatus())
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
    return this.ovhManagerPccServicePackOptionService
      .fetchAllExistingOptionNames(this.currentService.serviceName)
      .then((optionNames) => {
        this.optionNames = optionNames;
      });
  }

  handleSecurityOptions() {
    return this.dedicatedCloudDrp.checkForZertoOptionOrder(this.currentService.name)
      .then((storedDrpInformations) => {
        let storedDrpStatus = this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabled;
        if (storedDrpInformations) {
          storedDrpStatus = this.dedicatedCloudDrp.constructor
            .formatStatus(storedDrpInformations.status);
        }

        this.drpStatus = [this.currentDrp.state, storedDrpStatus]
          .find(status => status !== this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabled)
          || this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabled;
      })
      .catch((error) => {
        this.Alerter.error(
          `${this.$translate.instant('dedicatedCloud_datacenter_drp_get_state_error')} ${_.get(error, 'data.message', error.message)}`,
          'dedicatedCloudDatacenterAlert',
        );
      });
  }

  handleServicePacks() {
    return this.ovhManagerPccServicePackService
      .buildAllForService(this.currentService.serviceName, this.currentUser.ovhSubsidiary)
      .then((servicePacks) => {
        this.servicePacks = servicePacks;
      });
  }

  buildStatusForOption(optionName) {
    const orderIsInProgress = this.pendingOrder != null;
    const currentServicePackHasOption = _.some(
      this.currentServicePack.options,
      { name: optionName },
    );

    if (!orderIsInProgress) {
      return currentServicePackHasOption
        ? ACTIVATION_STATUS.enabled
        : ACTIVATION_STATUS.disabled;
    }

    if (this.pendingOrder.status === ORDER_STATUS.unknown) {
      return ACTIVATION_STATUS.unknown;
    }

    const orderedServicePackHasOption = _.some(
      _.get(
        _.find(
          this.servicePacks,
          { name: this.pendingOrder.orderedServicePackName },
        ),
        'options',
      ),
      { name: optionName },
    );

    if (currentServicePackHasOption && orderedServicePackHasOption) {
      return ACTIVATION_STATUS.enabled;
    }

    if (!currentServicePackHasOption && !orderedServicePackHasOption) {
      return ACTIVATION_STATUS.disabled;
    }

    const isAddingOption = !currentServicePackHasOption && orderedServicePackHasOption;
    return OvhManagerPccDashboardOptions
      .mapOrderStatusToActivationStatus(this.pendingOrder.status, isAddingOption);
  }

  static isDiscoverLinkDisplayed(status) {
    return status.name === ACTIVATION_STATUS.disabled.name;
  }

  buildBasicOptions() {
    return this.optionNames
      .filter(
        optionName => OvhManagerPccServicePackOptionService
          .getType(optionName) === OPTION_TYPES.basic,
      )
      .map((optionName) => {
        const status = this.buildStatusForOption(optionName);

        return {
          discoverURL: this.ovhManagerPccServicePackOptionService
            .constructor.getDiscoverURL(optionName, this.currentUser.ovhSubsidiary),
          displayDiscoverLink: OptionTile.isDiscoverLinkDisplayed(status),
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
    return this.doesCurrentServicePackHoldACertification()
      && this.buildStatusForOption(this.currentServicePack.name);
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
     && (!this.thereIsAPendingOrder()
      || (this.thereIsAPendingOrder()
      && this.pendingOrderIsNotPaid()));
  }

  isBasicMenuDisplayed() {
    return this.isOrderable(OPTION_TYPES.basic)
      || this.pendingOrderIsNotPaid();
  }

  isBasicMenuActionMenuModifyDisplayed() {
    const optionType = OPTION_TYPES.basic;
    const thereIsAtLeastOneOrderableOption = this.thereIsAtLeastOneOrderableItem(optionType);
    const thereIsAtLeastTwoOrderableOptions = this.orderables[optionType].length > 1;
    const thereIsAPendingOrder = this.thereIsAPendingOrder();
    const pendingOrderIsNotPaid = this.pendingOrderIsNotPaid();

    return (!thereIsAPendingOrder && thereIsAtLeastOneOrderableOption)
      || (thereIsAPendingOrder && pendingOrderIsNotPaid && thereIsAtLeastTwoOrderableOptions);
  }

  buildDataAfterFetching() {
    this.bindings = {
      ...this.bindings,
      isLoading: false,
      basic: {
        options: this.buildBasicOptions(),
        actionMenu: {
          isDisplayed: this.coreConfig.getRegion() !== 'US'
            && this.isBasicMenuDisplayed(),
          modify: {
            text: this.buildBasicMenuModifyText(),
            isDisplayed: this.isBasicMenuActionMenuModifyDisplayed(),
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
        isDisplayed: this.thereIsAtLeastOneOrderableItem(OPTION_TYPES.certification)
          || this.doesCurrentServicePackHoldACertification(),
        description: {
          links: {
            managementInterface: {
              isDisplayed: this.doesCurrentServicePackHoldACertification()
                && !this.thereIsAPendingOrder(),
              url: this.currentService.certifiedInterfaceUrl,
            },
            website: {
              isDisplayed: !this.doesCurrentServicePackHoldACertification(),
              url: this.ovhManagerPccServicePackOptionService
                .constructor
                .getDiscoverURL(
                  CERTIFICATIONS_PRESENTATION_CONSTANTS_ID,
                  this.currentUser.ovhSubsidiary,
                ),
            },
          },
          name: this.getCertificationDescription(),
          status: this.buildCertificationDescription(),
        },
        actionMenu: {
          isDisplayed: (
            this.isOrderable(OPTION_TYPES.certification) || this.pendingOrderIsNotPaid()
          )
          && !this.activationNeedsConfiguration
          && this.coreConfig.getRegion() !== 'US',
          activate: {
            isDisplayed: this.isOrderable(OPTION_TYPES.certification),
            stateParams: {
              activationType: OPTION_TYPES.certification,
              orderableServicePacks: this.orderables[OPTION_TYPES.certification],
              servicePacks: this.servicePacks,
            },
          },
          configurate: {
            isDisplayed: this.activationNeedsConfiguration,
            stateParams: {
              activationType: OPTION_TYPES.certification,
              orderableServicePacks: this.orderables[OPTION_TYPES.certification],
              goToConfiguration: true,
              servicePacks: this.servicePacks,
            },
          },
          validateActivation: {
            isDisplayed: this.pendingOrderIsNotPaid(),
            url: _.get(this.pendingOrder, 'url'),
          },
        },
      },
      security: {
        zerto: {
          title: this.$translate.instant('dedicatedCloudDashboardTilesOptions_security_zerto_name'),
          status: this.drpStatus,
          actionMenu: {
            isDisplayed: this.isZertoActionMenuDisplayed(),
            addConfiguration: {
              isDisplayed: this.isZertoVPNConfigurationAvailable(),
              text: this.$translate.instant('ovhManagerPccDashboardOptions_security_zerto_action_add_configuration'),
              sref: 'app.dedicatedClouds.datacenter.drp.onPremise.vpnConfiguration',
            },
            install: {
              isDisplayed: this.isZertoInstallationAvailable(),
              text: this.$translate.instant('ovhManagerPccDashboardOptions_security_zerto_action_install'),
              sref: 'app.dedicatedClouds.datacenter.drp({ datacenterId: $ctrl.currentDrp.datacenterId })',
            },
            delete: {
              isDisplayed: this.isZertoDeletionAvailable(),
              text: this.$translate.instant('ovhManagerPccDashboardOptions_security_zerto_action_delete'),
            },
          },
        },
      },
    };
  }

  isZertoActionMenuDisplayed() {
    return ![
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering,
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabling,
    ].includes(this.dprStatus);
  }

  isZertoVPNConfigurationAvailable() {
    return this.drpStatus === this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.waitingConfiruration;
  }

  isZertoInstallationAvailable() {
    return this.drpStatus === this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabled;
  }

  isZertoDeletionAvailable() {
    return this.drpStatus === this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered;
  }

  getCertificationDescription() {
    return this.doesCurrentServicePackHoldACertification()
      ? `ovhManagerPccDashboardOptions_certification_description_name_${this.currentService.servicePackName}`
      : this.$translate.instant('ovhManagerPccDashboardOptions_certification_description_noCertification');
  }

  buildBasicMenuModifyText() {
    return this.$translate.instant(
      _.filter(
        this.buildBasicOptions(),
        { status: ACTIVATION_STATUS.enabled },
      ).length === 0
        ? 'ovhManagerPccDashboardOptions_basic_actionMenu_activateOptions'
        : 'ovhManagerPccDashboardOptions_basic_actionMenu_modifyOptions',
    );
  }
}
