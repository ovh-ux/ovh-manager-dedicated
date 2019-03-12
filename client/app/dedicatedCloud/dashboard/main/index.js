import {
  COMPONENT_NAME,
  MODULE_NAME,
} from './constants';

import component from './component';
import generalInformationTile from './tiles/generalInformation';
import optionTile from './tiles/options';
import serviceManagementTile from './tiles/serviceManagement';

angular
  .module(MODULE_NAME, [
    generalInformationTile,
    optionTile,
    'oui',
    'pascalprecht.translate',
    serviceManagementTile,
    'ui.router',
  ])
  .component(COMPONENT_NAME, component)
  .run(/* @ngTranslationsInject ./translations */);

export default MODULE_NAME;
