import ServicePack from './dedicatedCloud-servicePack';

/* @ngInject */
export default class DedicatedCloudServicePackService {
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
}
