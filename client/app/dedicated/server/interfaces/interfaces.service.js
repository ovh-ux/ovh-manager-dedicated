import Interface from './interface.class';

export default class DedicatedServerInterfaceService {
  constructor(
    $q,
    OvhApiDedicatedServerNic,
    OvhApiDedicatedServerVni,
  ) {
    this.$q = $q;
    this.OvhApiDedicatedServerNic = OvhApiDedicatedServerNic;
    this.OvhApiDedicatedServerVni = OvhApiDedicatedServerVni;
  }

  getInterfaces(serverName) {
    let nics;
    return this.OvhApiDedicatedServerNic
      .v6()
      .query({ serverName })
      .$promise
      .then(macs => this.$q.all(
        macs.map(mac => this.OvhApiDedicatedServerNic.v6().get({ serverName, mac }).$promise),
      ))
      .then((results) => {
        nics = [...results];

        const vniUUids = _.uniq(
          _.map(
            nics.filter(
              ({ virtualNetworkInterface }) => virtualNetworkInterface !== null,
            ),
            'virtualNetworkInterface',
          ),
        );

        return this.$q.all(
          _.map(
            vniUUids,
            uuid => this.OvhApiDedicatedServerVni
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
}
