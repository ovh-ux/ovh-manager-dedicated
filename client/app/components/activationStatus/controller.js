import { ALL_TYPES, CLASS_NAME_TEMPLATE } from './constants';

/* @ngInject */
export default class DedicatedCloudActivationStatus {
  $onInit() {
    this.className = 'pouet';
    this.onStatusChange();
  }

  $onChange() {
    this.onStatusChange();
  }

  onStatusChange() {
    const status = ALL_TYPES[this.statusName];

    if (status == null) {
      throw new Error(`dedicatedCloudActivationStatus: ${this.statusName} is not a valid activation status`);
    }

    this.className = `${CLASS_NAME_TEMPLATE}${status.type}`;
  }
}
