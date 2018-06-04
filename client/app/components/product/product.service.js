angular.module("services").service("Products", function ($rootScope, $http, $q, $stateParams, constants) {
    let products = null;
    let productsByType = null;
    const requests = {
        productsList: null
    };

    $rootScope.$on("global_display_name_change", (evt, params) => {
        const result = _.find(products, { name: _.get(params, "serviceName") });
        result.displayName = angular.copy(_.get(params, "displayName"));
    });

    function resetCache () {
        products = null;
        productsByType = null;
        requests.productsList = null;
    }

    /*
        * get product by SWS
        */
    this.getProducts = function (forceRefresh) {
        if (forceRefresh === true) {
            resetCache();
        }

        return $q
            .when(products)
            .then(() => {
                if (!products) {
                    if (requests.productsList === null) {
                        requests.productsList = $http
                            .get("/sws/products", {
                                serviceType: "aapi",
                                params: {
                                    universe: "DEDICATED",
                                    worldPart: constants.target
                                }
                            })
                            .then((result) => {
                                if (result.status < 300) {
                                    productsByType = result.data;

                                    if (!products) {
                                        products = [];
                                    }

                                    ["dedicatedServers", "dedicatedClouds", "vps", "exchanges", "networks"].forEach((type) => {
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
            .then(() => products, (reason) => $q.reject(reason));
    };

    /*
        * Get list of products orderBy Type
        */
    this.getProductsByType = function () {
        return this.getProducts().then(() => productsByType);
    };

    /*
        * Get the selected product
        */
    this.getSelectedProduct = function (productId, forceRefresh) {
        if (!_.isString(productId)) {
            if (_.isBoolean(productId)) {
                return this.getSelectedProductFromWeb(productId);
            }
            return this.getSelectedProductFromWeb();
        }

        return this.getProducts(forceRefresh).then((productsList) => _.find(productsList, { name: productId }));
    };

    this.getSelectedProductFromWeb = function (forceRefresh) {
        return this.getProducts(forceRefresh).then((productsList) => {

            const name = $stateParams.productId ? $stateParams.productId : "";
            const type = $rootScope.currentSectionInformation ? $rootScope.currentSectionInformation.toUpperCase() : null;

            let p = null;

            _.forEach(productsList, (product) => {
                if (product.name === name && product.type === type) {
                    p = product;
                }
                if (product.hasSubComponent === true && !p) {
                    p = _.find(product.subProducts, { name, type });
                }
            });

            return p;
        });
    };

    /**
     * Get working-status for the specified product
     */
    this.getWorks = function (category, affiliated, active) {
        return $http
            .get(`${constants.aapiRootPath}working-status/${category}`, {
                params: {
                    affiliated,
                    active
                }
            })
            .then((resp) => resp.data);
    };

    this.getProducts(true);
});
