import _ from 'lodash';

import ServicePack from './model';
import { OPTION_TYPES } from './option/constants';

/* @ngInject */
export default class DedicatedCloudServicePack {
  constructor(
    $q,
    $translate,
    dedicatedCloudServicePackOption,
    OvhHttp,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.dedicatedCloudServicePackOption = dedicatedCloudServicePackOption;
    this.OvhHttp = OvhHttp;
  }

  fetchNamesForService(serviceName) {
    return this.OvhHttp.get(
      `/dedicatedCloud/${serviceName}/servicePacks`,
      { rootPath: 'apiv6' },
    );
  }

  buildAllForService(serviceName, subsidiary) {
    const buildChunkFromName = name => this.dedicatedCloudServicePackOption
      .buildAllForServicePack({
        serviceName,
        servicePackName: name,
        subsidiary,
      })
      .then(options => ({ name, options }));

    const buildFromChunk = chunk => new ServicePack({
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
      OPTION_TYPES.basicOption,
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
    const methodName = `fetchOrderable${formattedServicePackType}`;
    const methodToCall = this[methodName].bind(this);

    if (!_.isFunction(methodToCall)) {
      throw new Error(`DedicatedCloudServicePack.fetchOrderable: method "${methodName}" does not exist`);
    }

    return methodToCall({
      currentServicePackName,
      serviceName,
      subsidiary,
    });
  }

  fetchOrderableBasicOptions({
    currentServicePackName,
    serviceName,
    subsidiary,
  }) {
    return this.buildAllForService(serviceName, subsidiary)
      .then(servicePacks => DedicatedCloudServicePack
        .keepOnlyOrderableCertificates(servicePacks, currentServicePackName));
  }

  fetchOrderableCertification({
    currentServicePackName,
    serviceName,
    subsidiary,
  }) {
    return this.buildAllForService(serviceName, subsidiary)
      .then(servicePacks => _.filter(
        _.reject(servicePacks, { name: currentServicePackName }),
        servicePack => _.every(
          servicePack.options,
          option => _.isEqual(option.type, OPTION_TYPES.basicOption),
        ),
      ));
  }
}
