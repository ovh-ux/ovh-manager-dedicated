import _ from 'lodash';

import { OPTION_TYPES } from '../../../option/option.constants';

export const name = 'UpgradeBasicOptionsService';

export const UpgradeBasicOptionsService = class {
  /* @ngInject */
  constructor(
    $translate,
    ovhManagerPccServicePackService,
  ) {
    this.$translate = $translate;
    this.ovhManagerPccServicePackService = ovhManagerPccServicePackService;
  }

  async getOrderableServicePacks(serviceName, subsidiary, currentServicePackName) {
    const allServicePacks = await this
      .ovhManagerPccServicePackService
      .getServicePacks(serviceName, subsidiary);

    const allServicePacksExceptCurrent = _.reject(
      allServicePacks,
      { name: currentServicePackName },
    );

    return _.filter(
      allServicePacksExceptCurrent,
      servicePack => _.every(
        servicePack.options,
        option => _.isEqual(option.type, OPTION_TYPES.basic),
      ),
    );
  }

  getSelectionHeader() {
    return this.$translate('ovhManagerPccServicePackUpgradeBasicOptions_selection_header');
  }

  getSelectionSubHeader() {
    return this.$translate('ovhManagerPccServicePackUpgradeBasicOptions_selection_header');
  }
};

export default {
  name,
  UpgradeBasicOptionsService,
};
