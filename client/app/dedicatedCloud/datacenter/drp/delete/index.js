import controller from './dedicatedCloud-datacenter-drp-delete.controller';
import template from './dedicatedCloud-datacenter-drp-delete.html';

const controllerName = 'DedicatedCloudDatacenterDrpDeleteCtrl';
const templateName = '/client/app/dedicatedCloud/dedicatedCloud-datacenter-drp-delete.html';
const moduleName = 'dedicatedCloudDatacenterDrpDelete';

angular
  .module(moduleName, [])
  .controller(controllerName, controller)
  .run(/* @ngTranslationsInject:json */)
  .run(/* @ngInject */ ($templateCache) => {
    $templateCache.put(templateName, template);
  });

export default moduleName;
