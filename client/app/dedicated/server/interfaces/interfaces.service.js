import _ from 'lodash';
import Interface from './interface.class';

export default class DedicatedServerInterfaceService {
  /* @ngInject */
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
            id: mac,
            name: mac,
            mac,
            type,
            vrack: null,
          }),
        ),
        ..._.map(
          vnis,
          ({
            uuid, name, networkInterfaceController, mode: type, vrack,
          }) => new Interface({
            id: uuid,
            name,
            mac: networkInterfaceController.join(', '),
            type,
            vrack,
          }),
        ),
      ]);
  }
}
