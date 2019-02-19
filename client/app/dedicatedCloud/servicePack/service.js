import _ from 'lodash';

import ServicePack from './model';
import { OPTION_TYPES } from './option/constants';

/* @ngInject */
export default class DedicatedCloudServicePack {
  constructor(
    $q,
    $translate,
    dedicatedCloudServicePackOptionService,
    OvhHttp,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.dedicatedCloudServicePackOptionService = dedicatedCloudServicePackOptionService;
    this.OvhHttp = OvhHttp;
  }

  fetchNamesForService(serviceName) {
    return this.OvhHttp.get(
      `/dedicatedCloud/${serviceName}/servicePacks`,
      { rootPath: 'apiv6' },
    );
  }

  buildAllForService(serviceName, subsidiary) {
    const buildChunkFromName = name => this.dedicatedCloudServicePackOptionService
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
}
