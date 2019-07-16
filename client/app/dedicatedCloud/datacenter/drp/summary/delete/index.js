import component from './dedicatedCloud-datacenter-drp-summary-delete.component';

const moduleName = 'dedicatedCloudDatacenterDrpSummaryDeleteModule';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('app.dedicatedClouds.datacenter.drp.summary.deleteDrp', {
        url: '/deleteDrp',
        views: {
          modal: {
            component: component.name,
          },
        },
        layout: 'modal',
        resolve: {
          drpInformations: /* @ngInject */ (currentDrp, dedicatedCloudDrp) => dedicatedCloudDrp
            .constructor.getPlanServiceInformations(currentDrp),
        },
      });
  });

export default moduleName;
