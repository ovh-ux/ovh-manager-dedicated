import _ from 'lodash';
import { OLA_MODES } from './ola-configuration.constants';

export default class {
  $onInit() {
    this.olaModes = OLA_MODES;

    this.configuration = {};

    this.selectedInterfaces = [];
    this.notAllowedInterfaces = _.remove(
      this.interfaces,
      item => item.hasFailoverIps() || item.hasVrack(),
    );
  }

  isModeDisabled(mode) {
    return this.ola.getCurrentMode() === mode;
  }

  hasObsoleteBandwithOption() {
    return this.specifications.bandwidth.type !== 'included';
  }

  onRowSelect(selectedRows) {
    this.selectedInterfaces = selectedRows;
  }

  onFinish() {
    // TODO: API call for OLA configuration
    this.goBack({
      isOlaActivated: true, // For mockup
      configStep: 2,
    });
  }
}
