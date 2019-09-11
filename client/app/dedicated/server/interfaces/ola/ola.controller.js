import { OLA_MODES } from './ola.constants';

export default class {
  $onInit() {
    this.olaModes = OLA_MODES;

    this.configuration = {
      mode: this.olaModes[0],
    };

    this.interfaces = [{
      name: '7C:32:04:48:c2:02',
      mode: 'public',
      offer: 'ultimate',
      bandwidth: {
        incoming: {
          unit: 'Mbps',
          value: 10000,
        },
        outgoing: {
          unit: 'Mbps',
          value: 2000,
        },
      },
    }, {
      name: '7C:32:04:48:c2:03',
      mode: 'private',
      offer: 'included',
      bandwidth: {
        incoming: {
          unit: 'Mbps',
          value: 3000,
        },
        outgoing: {
          unit: 'Mbps',
          value: 3000,
        },
      },
    }];

    this.selectedInterfaces = [];
  }

  onRowSelect(selectedRows) {
    this.selectedInterfaces = selectedRows;
  }
}
