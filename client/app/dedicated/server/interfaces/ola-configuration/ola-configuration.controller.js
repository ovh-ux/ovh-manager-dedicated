import _ from 'lodash';
import Interface from '../interface.class';
import { OLA_MODES } from './ola-configuration.constants';
import { VIRTUAL_TYPE } from '../interfaces.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    OvhApiDedicatedServerOla,
    Poller,
    OvhApiDedicatedServerVirtualInterface,
  ) {
    this.$q = $q;
    this.Ola = OvhApiDedicatedServerOla;
    this.Poller = Poller;
    this.VirtualInterface = OvhApiDedicatedServerVirtualInterface;
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
    return this.disableInterfaces(this.selectedInterfaces)
      .then(() => {
        switch (this.configuration.mode) {
          case OLA_MODES.VRACK_AGGREGATION:
            return this.setPrivateAggregation();
          case OLA_MODES.DEFAULT:
            return this.setDefaultInterfaces();
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

  disableInterfaces(interfaces) {
    return this.$q.all(
      interfaces
        .filter(i => i.enabled === true)
        .map(i => this.VirtualInterface.v6().disable({
          serverName: this.serverName,
          uuid: i.id,
        }, {}).$promise),
    ).then(tasks => this.waitAllTasks(tasks));
  }

  setPrivateAggregation() {
    return this.Ola.v6().group({
      serverName: this.serverName,
    }, {
      name: this.configuration.name,
      virtualNetworkInterfaces: _.map(this.selectedInterfaces, 'id'),
    }).$promise.then(task => this.waitAllTasks([task]));
  }

  setDefaultInterfaces() {
    return this.Ola.v6().ungroup({
      serverName: this.serverName,
    }, {
      virtualNetworkInterface: this.selectedInterfaces[0].id,
    }).$promise
      .then(tasks => this.waitAllTasks(tasks));
  }

  waitAllTasks(tasks) {
    return this.$q.all(tasks.map(task => this.Poller.poll(
      `/dedicated/server/${this.serverName}/task/${task.taskId}`,
      null,
      { namespace: 'dedicated.server.interfaces.ola', method: 'get' },
    )));
  }
}
