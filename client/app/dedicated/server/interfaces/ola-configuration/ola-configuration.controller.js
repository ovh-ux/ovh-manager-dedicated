import _ from 'lodash';
import { OLA_MODES } from './ola-configuration.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    DedicatedServerInterfacesService,
    OvhApiDedicatedServerPhysicalInterface,
    OvhApiDedicatedServerVirtualInterface,
  ) {
    this.$q = $q;
    this.InterfaceService = DedicatedServerInterfacesService;
    this.PhysicalInterface = OvhApiDedicatedServerPhysicalInterface;
    this.VirtualInterface = OvhApiDedicatedServerVirtualInterface;
  }

  $onInit() {
    this.olaModes = Object.values(OLA_MODES);

    this.loading = true;
    this.taskPolling.promise.then(() => {
      this.loading = false;
    });

    this.configuration = {
      mode: this.ola.getCurrentMode() === OLA_MODES.DEFAULT
        ? OLA_MODES.VRACK_AGGREGATION
        : OLA_MODES.DEFAULT,
    };

    this.selectedInterfaces = [];
    this.notAllowedInterfaces = _.filter(
      this.interfaces,
      item => item.hasFailoverIps() || item.hasVrack(),
    );
    this.allowedInterfaces = this.interfaces.filter(i => !this.notAllowedInterfaces.includes(i));
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

    if (this.configuration.mode === OLA_MODES.DEFAULT) {
      this.networkInterfaces = _.flatten(_.map(
        this.selectedInterfaces,
        ({ mac }) => mac.split(','),
      ));
    }
  }

  onFinish() {
    this.loading = true;
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
        this.PhysicalInterface.v6().resetCache();
        this.VirtualInterface.v6().resetCache();
        if (this.isGrouping()) {
          this.goBack({ configStep: 2 }, { reload: true });
        } else {
          this.goBack({}, { reload: true });
        }
      });
  }
}