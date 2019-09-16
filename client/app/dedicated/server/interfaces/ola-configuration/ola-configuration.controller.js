import _ from 'lodash';
import { OLA_MODES } from './ola-configuration.constants';

export default class {
  $onInit() {
    this.olaModes = OLA_MODES;

    this.configuration = {
      mode: this.olaModes[0],
    };

    this.selectedInterfaces = [];
    this.notAllowedInterfaces = _.remove(
      this.interfaces,
      item => item.hasFailoverIps() || item.hasVrack(),
    );
  }

  hasObsoleteBandwithOption() {
    return this.bandwidth.bandwidth.type !== 'included';
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
