angular
  .module('services')
  .service(
    'dedicatedCloudOptions',
    class {
      /* @ngInject */
      constructor($q, DedicatedCloud, OvhHttp) {
        this.$q = $q;
        this.DedicatedCloud = DedicatedCloud;
        this.OvhHttp = OvhHttp;
      }

      async retrievingAvailableServicePackName(serviceName) {
        return this.OvhHttp.get(
          `/dedicatedCloud/${serviceName}/servicePacks`,
          { rootPath: 'apiv6' },
        );
      }

      async retrievingServicePackOptionNames(serviceName, servicePackName) {
        const { options } = await this.OvhHttp.get(
          `/dedicatedCloud/${serviceName}/servicePacks/${servicePackName}`,
          { rootPath: 'apiv6' },
        );

        return options;
      }

      async retrievingServicePacks({ serviceName, servicePackAssociatedToService }) {
        const actualAssociatedServicePack = servicePackAssociatedToService
          || await this.DedicatedCloud
            .getDescription(serviceName)
            .then(({ servicePackName }) => servicePackName);

        return this.$q.all((await this.retrievingAvailableServicePackName(serviceName))
          .map(servicePackName => this
            .retrievingServicePackOptionNames(
              serviceName,
              servicePackName,
            )
            .then(servicePackOptions => ({
              isAssociatedToService: servicePackName === actualAssociatedServicePack,
              name: servicePackName,
              options: servicePackOptions,
            }))));
      }
    },
  );
