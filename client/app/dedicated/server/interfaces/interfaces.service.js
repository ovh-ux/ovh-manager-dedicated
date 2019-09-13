import _ from 'lodash';
import Interface from './interface.class';

export default class DedicatedServerInterfaceService {
  constructor(
    $q,
    OvhApiDedicatedServerPhysicalInterface,
    OvhApiDedicatedServerVirtualInterface,
  ) {
    this.$q = $q;
    this.PhysicalInterface = OvhApiDedicatedServerPhysicalInterface;
    this.VirtualInterface = OvhApiDedicatedServerVirtualInterface;
  }

  getInterfaces(serverName) {
    let nics;
    return this.PhysicalInterface
      .v6()
      .query({ serverName })
      .$promise
      .then(macs => this.$q.all(
        macs.map(mac => this.PhysicalInterface.v6().get({ serverName, mac }).$promise),
      ))
      .then((results) => {
        nics = [...results];

        const vniUUids = _.uniq(
          _.map(
            nics.filter(
              ({ virtualNetworkInterface }) => _.isString(virtualNetworkInterface),
            ),
            'virtualNetworkInterface',
          ),
        );

        return this.$q.all(
          _.map(
            vniUUids,
            uuid => this.VirtualInterface
              .v6()
              .get({
                serverName,
                uuid,
              })
              .$promise,
          ),
        );
      })
      .then(vnis => [
        ..._.map(
          _.filter(
            nics,
            ({ mac }) => !_.some(
              vnis,
              ({ networkInterfaceController }) => _.includes(networkInterfaceController, mac),
            ),
          ),
          ({ mac, linkType: type }) => new Interface({
            name: mac,
            mac,
            type,
            vrack: null,
          }),
        ),
        ..._.map(
          vnis,
          ({
            name, networkInterfaceController, mode: type, vrack,
          }) => new Interface({
            name,
            mac: networkInterfaceController.join(', '),
            type,
            vrack,
          }),
        ),
      ]);
  }

  getOlaInfos() {
    // TODO
    console.log('getOlaInfos', this);

    return {
      isAvailable: true,
      isActivated: false,
      isConfigured: false,
    };
  }
}
