import _ from 'lodash';

import { PRODUCT_TYPES } from './ip-ip-agoraOrder.constant';

angular
  .module('Module.ip.services')
  .service('IpAgoraOrder', class {
    constructor(
      $q,
      OvhHttp,
    ) {
      this.$q = $q;
      this.OvhHttp = OvhHttp;
    }

    handleErrorOrServices({ errors, results }) {
      if (_.isArray(errors) && !_.isEmpty(errors)) {
        return this.$q.reject(errors);
      }

      return _.get(results, '[0].services', []);
    }

    fetchProducts(product) {
      return this.OvhHttp
        .get('/products', {
          rootPath: '2api',
          params: {
            product,
          },
        });
    }

    getServices() {
      return this.$q
        .all([
          this.fetchProducts(PRODUCT_TYPES.privateCloud.apiTypeName)
            .then(this.handleErrorOrServices),
          this.fetchProducts(PRODUCT_TYPES.dedicatedServer.apiTypeName)
            .then(this.handleErrorOrServices),
        ])
        .then(([privateClouds, dedicatedServers]) => [
          ...privateClouds.map(privateCloud => ({
            ...privateCloud,
            type: PRODUCT_TYPES.privateCloud.typeName,
          })),
          ...dedicatedServers.map(dedicatedServer => ({
            ...dedicatedServer,
            type: PRODUCT_TYPES.dedicatedServer.typeName,
          })),
        ]);
    }

    getIpOffers(ovhSubsidiary = 'US') {
      return this.OvhHttp
        .get('/order/catalog/formatted/ip', {
          rootPath: 'apiv6',
          params: {
            ovhSubsidiary,
          },
        })
        .then(({ plans }) => plans);
    }
  });
