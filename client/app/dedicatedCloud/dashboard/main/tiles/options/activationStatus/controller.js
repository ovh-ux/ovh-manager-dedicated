import {
  ACTIVATION_STATUS,
  COMPONENT_NAME,
} from './constants';

export default class {
  $onInit() {
    this.onStatusChange();
  }

  $onChange() {
    this.onStatusChange();
  }

  onStatusChange() {
    this.status = ACTIVATION_STATUS[this.statusName];

    if (this.status == null) {
      throw new RangeError(`${COMPONENT_NAME}: ${this.statusName} is not a valid activation status`);
    }
  }
}
