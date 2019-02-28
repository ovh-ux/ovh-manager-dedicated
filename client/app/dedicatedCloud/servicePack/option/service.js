import _ from 'lodash';
import { OPTIONS } from './constants';

export default class DedicatedCloudServicePackOption {
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

  fetchAvailableOptionNames({ serviceName, servicePackName }) {
    return this.OvhHttp
      .get(`/dedicatedCloud/${serviceName}/servicePacks/${servicePackName}`, {
        rootPath: 'apiv6',
      })
      .then(({ options: names }) => names);
  }

  static getType(optionName) {
    return _.find(OPTIONS, { name: optionName }).type;
  }

  getDescriptionURL(name, subsidiary) {
    return _.get(this.constants.urls, subsidiary, 'FR').guides[name];
  }

  fetchRawOptions({ serviceName, servicePackName, subsidiary }) {
    return this.fetchAvailableOptionNames({ serviceName, servicePackName })
      .then(names => this.$q.all(names.map(name => ({
        name,
        descriptionURL: this.getDescriptionURL(name, subsidiary),
      }))));
  }

  fetchOptions({ serviceName, servicePackName, subsidiary }) {
    return this
      .fetchRawOptions({ serviceName, servicePackName, subsidiary })
      .then(options => options.map(option => ({
        ...option,
        displayName: this.$translate.instant(`dedicatedCloud_options_name_${option.name}`),
        mensualCost: 100,
        type: DedicatedCloudServicePackOption.getType(option.name),
      })));
  }
}
