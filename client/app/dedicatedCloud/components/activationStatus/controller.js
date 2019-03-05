import {
  COMPONENT_NAME,
  STATUS,
} from './constants';

export default class {
  $onInit() {
    this.onStatusChange();
  }

  $onChange() {
    this.onStatusChange();
  }

  onStatusChange() {
    this.status = STATUS[this.statusName];

    if (this.status == null) {
      throw new RangeError(`${COMPONENT_NAME}: ${this.statusName} is not a valid activation status`);
    }
  }
}
