angular
  .module('App')
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.datastores', {
      reloadOnSearch: false,
      translations: ['../../../dedicated/server'],
      url: '/datastores',
      views: {
        pccDatacenterView: {
          controller: 'DedicatedCloudSubDatacentersDatastoreCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'dedicatedCloud/datacenter/datastore/dedicatedCloud-datacenter-datastore.html',
        },
      },
    });

    $stateProvider.state('app.dedicatedClouds.datacenter.datastores.orderUS', {
      resolve: {
        datacenterId: /* @ngInject */ $stateParams => $stateParams.datacenterId,
        serviceName: /* @ngInject */ $stateParams => $stateParams.productId,
      },
      url: '/order',
      views: {
        'pccDatacenterView@app.dedicatedClouds.datacenter': {
          controller: 'DedicatedCloudDatacentersDatastoreOrderUSCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'dedicatedCloud/datacenter/datastore/orderUS/dedicatedCloud-datacenter-datastore-orderUS.html',
        },
      },
    });
  });
