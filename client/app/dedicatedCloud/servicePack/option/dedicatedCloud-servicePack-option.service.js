import { ALL_EXISTING_OPTIONS } from './dedicatedCloud-servicePack-option.constants';
import ServicePackOption from './dedicatedCloud-servicePack-option';

export default class DedicatedCloudServicePackOptionService {
  constructor(
    $q,
    $translate,
    constants,
    OvhHttp,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.constants = constants;
    this.OvhHttp = OvhHttp;
  }

  fetchNamesForServicePack({ serviceName, servicePackName }) {
    return this.OvhHttp
      .get(
        `/dedicatedCloud/${serviceName}/servicePacks/${servicePackName}`,
        { rootPath: 'apiv6' },
      )
      .then(({ options: names }) => names);
  }

  static getTypeFromName(name) {
    return ALL_EXISTING_OPTIONS[name].type;
  }

  getDescriptionURL(name, subsidiary) {
    return _.get(this.constants.urls, subsidiary, 'FR').guides[name];
  }

  buildAllForServicePack({ serviceName, servicePackName, subsidiary }) {
    const buildFromChunk = chunk => new ServicePackOption({
      ...chunk,
      displayName: this.$translate.instant(`dedicatedCloud_options_name_${chunk.name}`),
      mensualCost: 100,
      type: DedicatedCloudServicePackOptionService.getTypeFromName(chunk.name),
    });

    return this.fetchNamesForServicePack({ serviceName, servicePackName })
      .then(names => this.$q.all(names.map(name => ({
        name,
        descriptionURL: this.getDescriptionURL(name, subsidiary),
      }))))
      .then(chunks => chunks.map(buildFromChunk));
  }
}
