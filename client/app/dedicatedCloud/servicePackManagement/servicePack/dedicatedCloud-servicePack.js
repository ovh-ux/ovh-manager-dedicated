import { uniq } from 'lodash';

export default class ServicePack {
  constructor({
    displayName,
    name,
    options,
  }) {
    this.displayName = displayName;
    this.name = name;
    this.options = options;
  }

  getTypesOfOptions() {
    return uniq(
      this.options.map(option => option.type),
    );
  }
}
