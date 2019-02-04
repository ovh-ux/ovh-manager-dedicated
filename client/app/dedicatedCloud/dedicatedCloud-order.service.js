angular
  .module('services')
  .service(
    'dedicatedCloudOrder',
    class {
      /* @ngInject */
      constructor(
        OvhHttp,
        User,
      ) {
        this.OvhHttp = OvhHttp;
        this.User = User;
      }

      retrievingCatalog() {
        return this.User
          .getUser()
          .then(({ ovhSubsidiary }) => this.OvhHttp.get(
            '/order/catalog/formatted/privateCloud',
            {
              rootPath: 'apiv6',
              params: { ovhSubsidiary },
            },
          ));
      }
    },
  );
