angular
  .module('services')
  .service('Products', function productService($rootScope, $http, $q, $stateParams, coreConfig) {
    let products = null;
    let productsByType = null;
    const requests = {
      productsList: null,
    };

    $rootScope.$on('global_display_name_change', (evt, params) => {
      const result = _.find(products, { name: params.serviceName });
      result.displayName = angular.copy(params.displayName);
    });

    function resetCache() {
      products = null;
      productsByType = null;
      requests.productsList = null;
    }

    /*
        * get product by SWS
        */
    this.getProducts = function getProducts(forceRefresh) {
      if (forceRefresh === true) {
        resetCache();
      }

      return $q
        .when(products)
        .then(() => {
          if (!products) {
            if (requests.productsList === null) {
              requests.productsList = $http
                .get('/sws/products', {
                  serviceType: 'aapi',
                  params: {
                    universe: 'DEDICATED',
                    worldPart: coreConfig.getRegion(),
                  },
                })
                .then((result) => {
                  if (result.status < 300) {
                    productsByType = result.data;

                    if (!products) {
                      products = [];
                    }

                    ['dedicatedServers', 'dedicatedClouds', 'vps', 'exchanges', 'networks'].forEach((type) => {
                      products = products.concat(productsByType[type]);
                    });
                    return products;
                  }
                  return $q.reject(result);
                });
            }

            return requests.productsList;
          }
          return products;
        })
        .then(() => products, reason => $q.reject(reason));
    };

    /*
        * Get the selected product
        */
    this.getSelectedProduct = function getSelectedProduct(productId) {
      return $q.when({
        displayName: productId,
        name: productId,
      });
    };
  });
