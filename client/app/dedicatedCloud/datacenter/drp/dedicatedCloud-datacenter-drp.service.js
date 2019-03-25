export default class {
  /* @ngInject */
  constructor(
    $q,
    OvhApiDedicatedCloud,
    OvhApiMe,
    OvhApiOrder,
    ovhPaymentMethod,
    DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
    DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS,
    DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  ) {
    this.$q = $q;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiOrder = OvhApiOrder;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
    this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS;
    this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
  }

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
        }))));
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
      .then(state => ({ ...state.data, ...serviceInformations }));
  }

  enableDrp(drpInformations, isLegacy) {
    const isOvhToOvhPlan = drpInformations
      .drpType === this.DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh;

    if (!isLegacy) {
      return isOvhToOvhPlan
        ? this.enableDrpOvh(drpInformations)
        : this.enableDrpOnPremise(drpInformations);
    }

    return isOvhToOvhPlan ? this.enableDrpOvhLegacy(drpInformations)
      : this.enableDrpOnPremiseLegacy(drpInformations);
  }

  /* ================================= */
  /*          PCC Legacy Ovh           */
  /* ================================= */

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
    ovhEndpointIp,
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
      this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.ovh,
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
        productName: this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.productName,
        serviceName: drpInformations.primaryPcc.serviceName,
      }).$promise)
      .then((offers) => {
        const [firstOffer] = offers;
        const [firstPrice] = firstOffer.prices;

        return this.OvhApiOrder.Cart().ServiceOption().v6().post({
          productName: this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.productName,
          serviceName: drpInformations.primaryPcc.serviceName,
        }, {
          cartId: zertoCartId,
          duration: this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.duration,
          planCode: zertoOption,
          pricingMode: firstPrice.pricingMode,
          quantity: this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.quantity,
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
        state: this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toDo,
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
          this.getZertoConfiguration(drpInformations, zertoOption),
        );
      })
      .then(() => this.validateZertoOptionCart(zertoCartId));
  }

  getZertoConfiguration(drpInformations, zertoOption) {
    return zertoOption === this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.ovh
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

  getZertoOptionOrderStatus(orderId) {
    return this.OvhApiMe.Order().v6().getStatus({ orderId }).$promise;
  }

  /* ------- Order ZERTO option ------ */

  disableDrp(drpInformations) {
    return drpInformations.drpType === this.DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh
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
}
