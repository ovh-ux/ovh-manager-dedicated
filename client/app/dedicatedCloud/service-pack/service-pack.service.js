import _ from 'lodash';

import { OPTION_TYPES } from './option/option.constants';

export const name = 'ovhManagerPccServicePackService';

export const ServicePackService = class ServicePack {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    DedicatedCloud,
    OvhApiDedicatedCloud,
    OvhApiOrder,
    ovhManagerPccServicePackOptionService,
    ovhUserPref,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.OvhApiOrder = OvhApiOrder;
    this.ovhManagerPccServicePackOptionService = ovhManagerPccServicePackOptionService;
    this.ovhUserPref = ovhUserPref;
  }

  getNamesForService(serviceName) {
    return this
      .OvhApiDedicatedCloud
      .ServicePacks()
      .v6()
      .query({ serviceName }).$promise;
  }

  getServicePacksForDashboardOptions(serviceName, subsidiary) {
    return this
      .getServicePacks(serviceName, subsidiary)
      .then(servicePacks => servicePacks
        .map(servicePack => ServicePack.turnRawServicePackToServicePackForDashboard(servicePack)));
  }

  static turnRawServicePackToServicePackForDashboard(servicePack) {
    return {
      ...servicePack,
      basicOptions: _.reduce(
        ServicePack.keepOnlyBasicOptions(servicePack.options),
        (prev, curr) => ({
          ...prev,
          [curr.name]: curr,
        }),
        {},
      ),
      certification: ServicePack.keepOnlyCertification(servicePack.options),
    };
  }

  static keepOnlyBasicOptions(options) {
    return _.filter(
      options,
      option => _.isEqual(option.type, OPTION_TYPES.basic),
    );
  }

  static keepOnlyCertification(options) {
    const matchingCertification = _.find(
      options,
      option => _.isEqual(option.type, OPTION_TYPES.certification),
    );

    return matchingCertification
      ? {
        ...matchingCertification,
        exists: true,
      }
      : { exists: false };
  }

  getServicePacks(serviceName, subsidiary) {
    const buildChunkFromName = servicePackName => this
      .ovhManagerPccServicePackOptionService
      .getOptions({
        serviceName,
        servicePackName,
        subsidiary,
      })
      .then(options => ({
        name: servicePackName,
        options,
      }));

    const buildFromChunk = chunk => ({
      ...chunk,
      displayName: this.$translate.instant(`dedicatedCloudDashboardTilesOptionsServicePack_name_${chunk.name}`),
      description: this.$translate.instant(`dedicatedCloudDashboardTilesOptionsServicePack_description_${chunk.name}`),
    });

    return this
      .getNamesForService(serviceName)
      .then(names => this.$q.all(names.map(buildChunkFromName)))
      .then(chunks => chunks.map(buildFromChunk));
  }

  static removeCurrentServicePack(servicePacks, currentServicePackName) {
    return _.reject(servicePacks, { name: currentServicePackName });
  }

  static keepOnlyCertainOptionType(servicePacks, optionTypeToKeep) {
    return _.filter(
      servicePacks,
      servicePack => _.some(
        servicePack.options,
        option => _.isEqual(option.type, optionTypeToKeep),
      ),
    );
  }

  static keepOnlyOrderableCertificates(servicePacks, currentServicePackName) {
    return this.keepOnlyCertainOptionType(
      this.removeCurrentServicePack(servicePacks, currentServicePackName),
      OPTION_TYPES.certification,
    );
  }

  static keepOnlyOrderableBasicOptions(servicePacks, currentServicePackName) {
    return this.keepOnlyCertainOptionType(
      this.removeCurrentServicePack(servicePacks, currentServicePackName),
      OPTION_TYPES.basic,
    );
  }

  getPrices(ovhSubsidiary, hostFamilies, servicePacks) {
    return this
      .OvhApiOrder
      .CatalogFormatted()
      .v6()
      .get({
        catalogName: 'privateCloud',
        ovhSubsidiary,
      }).$promise
      .then((catalog) => {
        const addonsFamily = _.find(catalog.plans[0].addonsFamily, { family: 'host' });

        return servicePacks.map((product) => {
          let price = null;
          const sum = _.sum(
            _.map(
              Object.entries(hostFamilies),
              ([familyName, numberOfHosts]) => {
                const familyData = _.find(
                  addonsFamily.addons,
                  addon => addon.plan.planCode === familyName,
                );

                const localPrice = familyData.plan.details.pricings[`pcc-servicepack-${product.name}`][0].price;
                price = localPrice;

                return numberOfHosts * localPrice.value;
              },
            ),
          );

          return {
            ...product,
            price: {
              ...price,
              value: sum,
            },
          };
        });
      });
  }

  getHostFamilies(serviceName) {
    return this.DedicatedCloud
      .getDatacentersInformations(serviceName)
      .then(datacenters => datacenters.list.results
        .reduce((accumulator, { hostFamilies }) => ({ ...accumulator, ...hostFamilies }), {}));
  }
};

export default {
  name,
  ServicePackService,
};
