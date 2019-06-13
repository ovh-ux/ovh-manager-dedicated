import {
  DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP,
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ROLES,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
  DEDICATEDCLOUD_DATACENTER_ZERTO,
} from './dedicatedCloud-datacenter-drp.constants';

import choiceTemplate from './configuration/dedicatedCloud-datacenter-drp-choice.html';
import component from './dedicatedCloud-datacenter-drp.component';
import controller from './dedicatedCloud-datacenter-drp.controller';
import mainPccStep from './configuration/steps/ovh/mainPcc';
import secondPccStep from './configuration/steps/ovh/secondPcc';
import service from './dedicatedCloud-datacenter-drp.service';
import summary from './summary';
import deleteDrp from './delete';

const componentName = 'dedicatedCloudDatacenterDrp';
const controllerName = 'DedicatedCloudDatacenterDrpCtrl';
const moduleName = 'dedicatedCloudDatacenterDrp';
const serviceName = 'dedicatedCloudDrp';

const ipUsageMacAddressRegExpConstantName = 'DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP';
const optionsConstantName = 'DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS';
const orderOptionsConstantName = 'DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS';
const rolesConstantName = 'DEDICATEDCLOUD_DATACENTER_DRP_ROLES';
const statusConstantName = 'DEDICATEDCLOUD_DATACENTER_DRP_STATUS';
const unavailableIpStatusConstantName = 'DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS';
const zertoConstantName = 'DEDICATEDCLOUD_DATACENTER_ZERTO';

angular
  .module(moduleName, [
    deleteDrp,
    mainPccStep,
    secondPccStep,
    summary,
  ])
  .component(componentName, component)
  .constant(ipUsageMacAddressRegExpConstantName,
    DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP)
  .constant(optionsConstantName, DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS)
  .constant(orderOptionsConstantName, DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS)
  .constant(rolesConstantName, DEDICATEDCLOUD_DATACENTER_DRP_ROLES)
  .constant(statusConstantName, DEDICATEDCLOUD_DATACENTER_DRP_STATUS)
  .constant(unavailableIpStatusConstantName, DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS)
  .constant(zertoConstantName, DEDICATEDCLOUD_DATACENTER_ZERTO)
  .controller(controllerName, controller)
  .service(serviceName, service)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.drp', {
      url: '/drp',
      views: {
        'pccDatacenterView@app.dedicatedClouds.datacenter': 'dedicatedCloudDatacenterDrp',
      },
      params: {
        selectedDrpType: null,
      },
      resolve: {
        disableForUS: /* @ngInject */ ($q, coreConfig) => (coreConfig.getRegion() === 'US' ? $q.reject() : $q.when()),
        datacenterHosts: /* @ngInject */ ($stateParams, DedicatedCloud) => DedicatedCloud
          .getHosts($stateParams.productId, $stateParams.datacenterId),
        datacenterList: /* @ngInject */ ($stateParams, DedicatedCloud) => DedicatedCloud
          .getDatacenters($stateParams.productId).then(({ results }) => results),
        pccList: /* @ngInject */ DedicatedCloud => DedicatedCloud.getAllPccs(),
      },
    })
      .state('app.dedicatedClouds.datacenter.drp.choice', {
        views: {
          'choiceView@app.dedicatedClouds.datacenter.drp': {
            template: choiceTemplate,
          },
        },
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
