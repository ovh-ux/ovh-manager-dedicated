import _ from 'lodash';
import Interface from '../interface.class';
import { OLA_MODES } from './ola-configuration.constants';
import { VIRTUAL_TYPE } from '../interfaces.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    DedicatedServerInterfacesService,
    OvhApiDedicatedServerVirtualInterface,
  ) {
    this.$q = $q;
    this.VirtualInterface = OvhApiDedicatedServerVirtualInterface;
    this.InterfaceService = DedicatedServerInterfacesService;
  }

  $onInit() {
    this.olaModes = Object.values(OLA_MODES);

    this.configuration = {
      mode: this.ola.getCurrentMode() === OLA_MODES.DEFAULT
        ? OLA_MODES.VRACK_AGGREGATION
        : OLA_MODES.DEFAULT,
    };

    this.fakeInterfaces = [
      new Interface({ name: 'xx:xx:xx:xx:xx:xx', type: VIRTUAL_TYPE.public }),
      new Interface({ name: 'yy:yy:yy:yy:yy:yy', type: VIRTUAL_TYPE.vrack }),
    ];

    this.selectedInterfaces = [];
    this.notAllowedInterfaces = _.remove(
      this.interfaces,
      item => item.hasFailoverIps() || item.hasVrack(),
    );
  }

  isGrouping() {
    return this.configuration.mode === OLA_MODES.VRACK_AGGREGATION;
  }

  isSelectionValid() {
    const selectableAmount = this.isGrouping() ? 2 : 1;
    return !!this.selectedInterfaces.length && this.selectedInterfaces.length === selectableAmount;
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
    return this.InterfaceService.disableInterfaces(
      this.serverName,
      this.selectedInterfaces,
    )
      .then(() => {
        switch (this.configuration.mode) {
          case OLA_MODES.VRACK_AGGREGATION:
            return this.InterfaceService.setPrivateAggregation(
              this.serverName,
              this.configuration.name,
              this.selectedInterfaces,
            );
          case OLA_MODES.DEFAULT:
            return this.InterfaceService.setDefaultInterfaces(
              this.serverName,
              this.selectedInterfaces[0],
            );
          default:
            return this.$q.when();
        }
      })
      .then(() => {
        this.VirtualInterface.v6().resetCache();
        if (this.isGrouping()) {
          this.goBack({ configStep: 2 });
        } else {
          this.goBack();
        }
      });
  }
}
