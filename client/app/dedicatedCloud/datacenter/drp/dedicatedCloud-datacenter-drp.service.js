import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_PCC_UNAVAILABLE_CODES,
  DEDICATEDCLOUD_DATACENTER_ZERTO,
} from './dedicatedCloud-datacenter-drp.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    OvhApiDedicatedCloud,
    OvhApiMe,
    OvhApiOrder,
    ovhPaymentMethod,
    ovhUserPref,
  ) {
    this.$q = $q;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiOrder = OvhApiOrder;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.ovhUserPref = ovhUserPref;
  }

  /* ================================= */
  /*       Information Getters         */
  /* ================================= */


  getPccIpAddresses(serviceName) {
    return this.OvhApiDedicatedCloud.Ip().v6().query({
      serviceName,
    }).$promise
      .then(ipAddresses => ipAddresses
        .map(ipAddress => this.OvhApiDedicatedCloud.Ip().v6()
          .get({
            serviceName,
            network: ipAddress,
          }).$promise));
  }

  getPccDrpPlan(serviceName) {
    return this.OvhApiDedicatedCloud.Datacenter().v6().query({
      serviceName,
    }).$promise
      .then(datacenters => this.$q.all(datacenters
        .map(datacenterId => this.getDrpState({
          serviceName,
          datacenterId,
        }))))
      .catch(error => (DEDICATEDCLOUD_DATACENTER_PCC_UNAVAILABLE_CODES.includes(error.status)
        ? this.$q.when([]) : this.$q.reject(error)));
  }

  getPccIpAddressesDetails(serviceName) {
    return this.OvhApiDedicatedCloud.Ip().v6().query({
      serviceName,
    }).$promise
      .then(ipAddresses => this.$q.all(ipAddresses
        .map(ipAddress => this.OvhApiDedicatedCloud.Ip().Details()
          .v6()
          .get({
            serviceName,
            network: ipAddress,
          }).$promise))
        .then(ipAddressesDetails => _.flatten(ipAddressesDetails)));
  }

  getDrpState(serviceInformations) {
    return this.OvhApiDedicatedCloud
      .Datacenter().Zerto().v6().state(serviceInformations, null).$promise
      .then(state => ({ ...state, ...serviceInformations }));
  }

  getDefaultLocalVraNetwork(serviceInformations) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().Single().v6()
      .getDefaultLocalVraNetwork(serviceInformations).$promise
      .then(({ value: defaultLocalVraNetwork }) => defaultLocalVraNetwork);
  }

  /* ---- END Information Getters ---- */

  /* ================================= */
  /*          PCC Legacy Ovh           */
  /* ================================= */

  enableDrp(drpInformations, isLegacy) {
    const isOvhToOvhPlan = drpInformations
      .drpType === DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh;

    if (!isLegacy) {
      return isOvhToOvhPlan
        ? this.enableDrpOvh(drpInformations)
        : this.enableDrpOnPremise(drpInformations);
    }

    return isOvhToOvhPlan ? this.enableDrpOvhLegacy(drpInformations)
      : this.enableDrpOnPremiseLegacy(drpInformations);
  }

  enableDrpOvhLegacy({
    primaryPcc,
    primaryDatacenter,
    primaryEndpointIp,
    secondaryPcc,
    secondaryDatacenter,
    secondaryEndpointIp,
  }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().v6().enable({
      serviceName: primaryPcc.serviceName,
      datacenterId: primaryDatacenter.id,
    }, {
      primaryEndpointIp,
      secondaryServiceName: secondaryPcc.serviceName,
      secondaryDatacenterId: secondaryDatacenter.id,
      secondaryEndpointIp,
    }).$promise;
  }

  enableDrpOnPremiseLegacy({
    primaryPcc,
    primaryDatacenter,
    localVraNetwork,
    primaryEndpointIp: ovhEndpointIp,
    remoteVraNetwork,
  }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().Single().v6()
      .enable({
        serviceName: primaryPcc.serviceName,
        datacenterId: primaryDatacenter.id,
      }, {
        localVraNetwork,
        ovhEndpointIp,
        remoteVraNetwork,
      }).$promise;
  }

  /* ------ END PCC Legacy OVH ------- */

  /* ================================= */
  /*        Order ZERTO option         */
  /* ================================= */

  enableDrpOvh(drpInformations) {
    return this.orderZertoOption(
      drpInformations,
      DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.ovh,
    );
  }

  createZertoOptionCart(drpInformations, zertoOption) {
    let zertoCartId;
    return this.OvhApiMe.v6().get().$promise
      .then(({ ovhSubsidiary }) => this.OvhApiOrder.Cart().v6().post({}, { ovhSubsidiary })
        .$promise)
      .then(({ cartId }) => {
        zertoCartId = cartId;
        return this.OvhApiOrder.Cart().v6().assign({ cartId }).$promise;
      })
      .then(() => this.OvhApiOrder.Cart().ServiceOption().v6().get({
        productName: DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.productName,
        serviceName: drpInformations.primaryPcc.serviceName,
      }).$promise)
      .then((offers) => {
        const [firstOffer] = offers;
        const [firstPrice] = firstOffer.prices;

        return this.OvhApiOrder.Cart().ServiceOption().v6().post({
          productName: DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.productName,
          serviceName: drpInformations.primaryPcc.serviceName,
        }, {
          cartId: zertoCartId,
          duration: DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.duration,
          planCode: zertoOption,
          pricingMode: firstPrice.pricingMode,
          quantity: DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.quantity,
        }).$promise;
      });
  }

  validateZertoOptionCart(cartId) {
    let autoPayWithPreferredPaymentMethod;
    return this.$q.all({
      availableAutomaticPaymentsMean:
        this.OvhApiMe.AvailableAutomaticPaymentMeans().v6().get().$promise,
      allPaymentMethods:
        this.ovhPaymentMethod.getAllPaymentMethods({ onlyValid: true, transform: true }),
    })
      .then(({ availableAutomaticPaymentsMean, allPaymentMethods }) => {
        const availablePaymentType = _(allPaymentMethods).map('paymentType').flatten().value();
        autoPayWithPreferredPaymentMethod = availablePaymentType
          .some(({ value }) => _.get(availableAutomaticPaymentsMean, _.camelCase(value)));

        return this.OvhApiOrder.Cart().v6().checkout({
          cartId,
        }, {
          autoPayWithPreferredPaymentMethod,
          waiveRetractationPeriod: false,
        }).$promise;
      })
      .then(({ orderId, url }) => ({
        hasAutoPay: autoPayWithPreferredPaymentMethod,
        orderId,
        url,
        state: DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toDo,
      }));
  }

  orderZertoOption(drpInformations, zertoOption) {
    let zertoCartId;
    return this.createZertoOptionCart(drpInformations, zertoOption)
      .then(({ cartId, itemId }) => {
        zertoCartId = cartId;
        return this.addCartZertoOptionConfiguration(
          cartId,
          itemId,
          this.constructor.getZertoConfiguration(drpInformations, zertoOption),
        );
      })
      .then(() => this.validateZertoOptionCart(zertoCartId));
  }

  addCartZertoOptionConfiguration(cartId, itemId, drpInformations) {
    const parametersToSet = _.keys(drpInformations);

    return this.$q.all(parametersToSet
      .map(parameter => this.OvhApiOrder.Cart().Item().Configuration().v6()
        .post({
          cartId,
          itemId,
          label: parameter,
          value: _.get(drpInformations, parameter),
        }).$promise));
  }

  checkForZertoOptionOrder(pccId) {
    let storedZertoOption;

    const { splitter } = DEDICATEDCLOUD_DATACENTER_ZERTO;
    const [, ...[formattedServiceName]] = pccId.split(splitter);
    const preferenceKey = `${DEDICATEDCLOUD_DATACENTER_ZERTO.title}_${formattedServiceName.replace(/-/g, '')}`;

    return this.ovhUserPref.getValue(preferenceKey)
      .then(({ drpInformations, zertoOptionOrderId }) => {
        if (drpInformations != null
            && drpInformations.primaryPcc.serviceName === pccId) {
          storedZertoOption = drpInformations;
          return this.getZertoOptionOrderStatus(zertoOptionOrderId);
        }

        return this.$q.when({});
      })
      .then(({ status: zertoOrderStatus }) => {
        const pendingOrderStatus = [
          DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering,
          DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered,
        ].find(status => status === zertoOrderStatus);

        return pendingOrderStatus != null
          ? { ...storedZertoOption, state: pendingOrderStatus }
          : this.$q.when(null);
      })
      .catch(error => (error.status === 404 ? this.$q.when(null) : this.$q.reject(error)));
  }

  getZertoOptionOrderStatus(orderId) {
    return this.OvhApiMe.Order().v6().getStatus({ orderId }).$promise;
  }

  /* ------- Order ZERTO option ------ */

  disableDrp(drpInformations) {
    return drpInformations.drpType === DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh
      ? this.disableDrpOvh(drpInformations)
      : this.disableDrpOnPremise(drpInformations);
  }

  disableDrpOvh({
    primaryPcc,
    primaryDatacenter,
    secondaryPcc,
    secondaryDatacenter,
  }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().v6()
      .disable({
        serviceName: primaryPcc.serviceName,
        datacenterId: primaryDatacenter.id,
      }, {
        secondaryServiceName: secondaryPcc.serviceName,
        secondaryDatacenterId: secondaryDatacenter.id,
      }).$promise;
  }

  disableDrpOnPremise({ primaryPcc, primaryDatacenter }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().Single().v6()
      .disable({
        serviceName: primaryPcc.serviceName,
        datacenterId: primaryDatacenter.id,
      }, null).$promise;
  }

  regenerateZsspPassword({ primaryPcc, primaryDatacenter }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().v6()
      .generateZsspPassword({
        serviceName: primaryPcc.serviceName,
        datacenterId: primaryDatacenter.id,
      }, null).$promise;
  }

  configureVpn({
    primaryPcc,
    primaryDatacenter,
    preSharedKey,
    remoteEndpointInternalIp,
    remoteEndpointPublicIp,
    remoteVraNetwork,
    remoteZvmInternalIp,
  }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().Single().v6()
      .configureVpn({
        serviceName: primaryPcc.serviceName,
        datacenterId: primaryDatacenter.id,
      }, {
        preSharedKey,
        remoteEndpointInternalIp,
        remoteEndpointPublicIp,
        remoteVraNetwork,
        remoteZvmInternalIp,
      }).$promise;
  }

  static formatDrpInformations(
    {
      datacenterId, drpType, localSiteInformation, remoteSiteInformation, serviceName, state,
    },
    pccList, datacenterList,
  ) {
    const currentPccInformations = _.find(pccList, { serviceName });
    const currentDatacenterInformations = datacenterList.find(({ id }) => id === datacenterId);

    let primaryPcc;
    let primaryDatacenter;
    let secondaryPcc;
    let secondaryDatacenter;

    if (localSiteInformation && remoteSiteInformation) {
      if (localSiteInformation.role === this.DEDICATEDCLOUD_DATACENTER_DRP_ROLES.primary) {
        primaryPcc = {
          serviceName: currentPccInformations.serviceName,
        };
        primaryDatacenter = {
          id: currentDatacenterInformations.id,
          formattedName: currentDatacenterInformations.formattedName,
        };
        secondaryPcc = {
          serviceName: remoteSiteInformation.serviceName,
        };
        secondaryDatacenter = {
          id: remoteSiteInformation.datacenterId,
          formattedName: remoteSiteInformation.datacenterName,
        };
      } else {
        primaryPcc = {
          serviceName: remoteSiteInformation.serviceName,
        };
        primaryDatacenter = {
          id: remoteSiteInformation.datacenterId,
          formattedName: remoteSiteInformation.datacenterName,
        };
        secondaryPcc = {
          serviceName: currentPccInformations.serviceName,
        };
        secondaryDatacenter = {
          id: currentDatacenterInformations.id,
          formattedName: currentDatacenterInformations.formattedName,
        };
      }
    }

    return {
      drpType,
      state,
      primaryPcc,
      primaryDatacenter,
      secondaryPcc,
      secondaryDatacenter,
    };
  }

  static formatStatus(status) {
    switch (status) {
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered:
        return DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered;
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering:
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.provisionning:
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toProvision:
        return DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering;
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabling:
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toDisable:
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toUnprovision:
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.unprovisionning:
        return DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabling;
      default:
        return DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabled;
    }
  }

  static getZertoConfiguration(drpInformations, zertoOption) {
    return zertoOption === DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.ovh
      ? {
        datacenter_id: drpInformations.primaryDatacenter.id,
        primaryEndpointIp: drpInformations.primaryEndpointIp,
        secondaryEndpointIp: drpInformations.secondaryEndpointIp,
        secondaryServiceName: drpInformations.secondaryPcc.serviceName,
        secondaryDatacenterId: drpInformations.secondaryDatacenter.id,
      }
      : {
        datacenter_id: drpInformations.primaryDatacenter.id,
        ovhEndpointIp: drpInformations.ovhEndpointIp,
        localVraNetwork: drpInformations.localVraNetwork,
        remoteVraNetwork: drpInformations.remoteVraNetwork,
      };
  }
}
