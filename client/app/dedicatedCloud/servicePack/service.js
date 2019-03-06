import _ from 'lodash';

import { OPTION_TYPES } from './option/constants';

/* @ngInject */
export default class DedicatedCloudServicePack {
  constructor(
    $q,
    $translate,
    DedicatedCloud,
    servicePackOptionService,
    OvhHttp,
    ovhUserPref,
    SERVICE_PACK_USER_PREFERENCES_KEY,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.servicePackOptionService = servicePackOptionService;
    this.OvhHttp = OvhHttp;
    this.ovhUserPref = ovhUserPref;
    this.SERVICE_PACK_USER_PREFERENCES_KEY = SERVICE_PACK_USER_PREFERENCES_KEY;
  }

  fetchNamesForService(serviceName) {
    return this.OvhHttp.get(`/dedicatedCloud/${serviceName}/servicePacks`, {
      rootPath: 'apiv6',
    });
  }

  buildAllForService(serviceName, subsidiary) {
    const buildChunkFromName = name => this.servicePackOptionService
      .fetchOptions({
        serviceName,
        servicePackName: name,
        subsidiary,
      })
      .then(options => ({ name, options }));

    const buildFromChunk = chunk => ({
      ...chunk,
      displayName: this.$translate.instant(`dedicatedCloud_options_name_${chunk.name}`),
    });

    return this
      .fetchNamesForService(serviceName)
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

  fetchOrderable({
    activationType,
    currentServicePackName,
    serviceName,
    subsidiary,
  }) {
    const servicePackTypeCamelCase = _.camelCase(activationType);
    const formattedServicePackType = `${servicePackTypeCamelCase[0].toUpperCase()}${servicePackTypeCamelCase.slice(1)}`;
    const methodToCallName = `fetchOrderable${formattedServicePackType}`;
    const methodToCall = this[methodToCallName].bind(this);

    if (!_.isFunction(methodToCall)) {
      throw new Error(`DedicatedCloudServicePack.fetchOrderable: method "${methodToCallName}" does not exist`);
    }

    return methodToCall({
      currentServicePackName,
      serviceName,
      subsidiary,
    });
  }

  fetchOrderableCertification({
    currentServicePackName,
    serviceName,
    subsidiary,
  }) {
    return this.buildAllForService(serviceName, subsidiary)
      .then(servicePacks => DedicatedCloudServicePack
        .keepOnlyOrderableCertificates(servicePacks, currentServicePackName));
  }

  fetchOrderableBasic({
    currentServicePackName,
    serviceName,
    subsidiary,
  }) {
    return this.buildAllForService(serviceName, subsidiary)
      .then(servicePacks => _.filter(
        _.reject(servicePacks, { name: currentServicePackName }),
        servicePack => _.every(
          servicePack.options,
          option => _.isEqual(option.type, OPTION_TYPES.basic),
        ),
      ));
  }

  fetchPrices(ovhSubsidiary, hostFamilies, servicePacks) {
    return this.OvhHttp
      .get('/order/catalog/formatted/privateCloud', {
        rootPath: 'apiv6',
        params: { ovhSubsidiary },
      })
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

  fetchHostFamilies(serviceName) {
    return this.DedicatedCloud
      .getDatacentersInformations(serviceName)
      .then(datacenters => datacenters.list.results
        .reduce((accumulator, { hostFamilies }) => ({ ...accumulator, ...hostFamilies }), {}));
  }

  savePendingOrder(serviceName, { id, url }, orderedServicePackName) {
    return this.ovhUserPref
      .assign(this.SERVICE_PACK_USER_PREFERENCES_KEY, {
        [serviceName]: {
          orderedServicePackName,
          order: {
            id,
            url,
          },
        },
      });
  }
}
