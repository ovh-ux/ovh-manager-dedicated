import { OLA_MODES } from './ola.constants';

export default class {
  $onInit() {
    this.olaModes = OLA_MODES;

    this.configuration = {
      mode: this.olaModes[0],
    };

    this.selectedInterfaces = [];
  }

  onRowSelect(selectedRows) {
    this.selectedInterfaces = selectedRows;
  }
}
