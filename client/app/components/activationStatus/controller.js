import _ from 'lodash';
import { ALL_TYPES, CLASS_NAME_TEMPLATE } from './constants';

/* @ngInject */
export default class DedicatedCloudActivationStatus {
  $onInit() {
    this.onStatusChange();
  }

  $onChange() {
    this.onStatusChange();
  }

  onStatusChange() {
    const status = _.invert(ALL_TYPES)[this.status];

    if (status == null) {
      throw new Error(`dedicatedCloudActivationStatus: ${_.get(this.status, 'name')} is not a valid activation status`);
    }

    this.className = `${CLASS_NAME_TEMPLATE}${this.status.type}`;
  }
}
