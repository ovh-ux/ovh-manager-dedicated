export default class {
  /* @ngInject */
  constructor($q, OvhApiDedicatedCloud, DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS) {
    this.$q = $q;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
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

  enableDrp(drpInformations) {
    return drpInformations.drpType === this.DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh
      ? this.enableDrpOvh(drpInformations)
      : this.enableDrpOnPremise(drpInformations);
  }

  enableDrpOvh({
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

  enableDrpOnPremise({
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