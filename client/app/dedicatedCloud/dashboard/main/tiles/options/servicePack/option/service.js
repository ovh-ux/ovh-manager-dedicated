import _ from 'lodash';

export default class DedicatedCloudServicePackOption {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    constants,
    OvhHttp,
    DEDICATED_CLOUD_SERVICE_PACK_OPTION,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.constants = constants;
    this.OvhHttp = OvhHttp;
    this.DEDICATED_CLOUD_SERVICE_PACK_OPTION = DEDICATED_CLOUD_SERVICE_PACK_OPTION;
  }

  fetchAllExistingOptionNames(serviceName) {
    return this.OvhHttp
      .get(`/dedicatedCloud/${serviceName}/servicePacks`, {
        rootPath: 'apiv6',
      })
      .then(
        servicePackNames => this.mapServicePackNamesToOptionNames(serviceName, servicePackNames),
      )
      .then(optionNames => _
        .uniq(
          _.flatten(optionNames),
        )
        .sort());
  }

  mapServicePackNamesToOptionNames(serviceName, servicePackNames) {
    return this.$q.all(
      servicePackNames
        .map(servicePackName => this.fetchOptionNames(serviceName, servicePackName)),
    );
  }

  fetchOptionNames(serviceName, servicePackName) {
    return this.OvhHttp
      .get(`/dedicatedCloud/${serviceName}/servicePacks/${servicePackName}`, {
        rootPath: 'apiv6',
      })
      .then(({ options: names }) => names);
  }

  getType(optionName) {
    return _.find(this.DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTIONS, { name: optionName }).type;
  }

  getDiscoverURL(name, subsidiary) {
    return _.get(this.constants.urls, subsidiary, 'FR').presentations[name];
  }

  fetchRawOptions({ serviceName, servicePackName, subsidiary }) {
    return this.fetchOptionNames(serviceName, servicePackName)
      .then(names => this.$q.all(names.map(name => ({
        name,
        descriptionURL: this.getDiscoverURL(name, subsidiary),
      }))));
  }

  fetchOptions({ serviceName, servicePackName, subsidiary }) {
    return this
      .fetchRawOptions({ serviceName, servicePackName, subsidiary })
      .then(options => options.map(option => ({
        ...option,
        type: this.getType(option.name),
      })));
  }
}
