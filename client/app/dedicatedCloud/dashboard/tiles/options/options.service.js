import { OPTION_TYPES, OPTIONS } from '../../../service-pack/option/option.constants';

export const name = 'ovhManagerPccDashboardOptionsService';

export const OptionsService = class OptionsService {
  /* @ngInject */
  constructor(
    $q,
    ovhManagerPccDashboardOptionsOrder,
    ovhManagerPccServicePackService,
  ) {
    this.$q = $q;
    this.ovhManagerPccDashboardOptionsOrder = ovhManagerPccDashboardOptionsOrder;
    this.ovhManagerPccServicePackService = ovhManagerPccServicePackService;
  }

  static computeServicePackCurrent(allServicePacks, currentServicePackName) {
    return _.find(
      allServicePacks,
      { name: currentServicePackName },
    );
  }

  static computeServicePacksOrderable(allServicePacks, currentServicePackName) {
    // all service packs are orderable except the current one
    const orderableServicePacks = _.reject(
      allServicePacks,
      { name: currentServicePackName },
    );

    return {
      withACertification: _.filter(
        orderableServicePacks,
        orderableServicePack => orderableServicePack.certification,
      ),
      withOnlyBasicOptions: _.filter(
        orderableServicePacks,
        orderableServicePack => !orderableServicePack.certification,
      ),
    };
  }

  static computeServicePacksOrdered(allServicePacks, currentServicePackName) {
    const matchingServicePack = _.find(
      allServicePacks,
      { name: currentServicePackName },
    );

    return {
      ...matchingServicePack,
      exists: matchingServicePack != null,
    };
  }

  static computeOptionsBasic() {
    return _.filter(
      OPTIONS,
      option => option.type === OPTION_TYPES.basic,
    );
  }

  getPendingOrder(serviceName) {
    return this
      .ovhManagerPccDashboardOptionsOrder
      .getServicePackOrder(serviceName);
  }

  getServicePacks(serviceName, ovhSubsidiary) {
    return this
      .ovhManagerPccServicePackService
      .getServicePacksForDashboardOptions(serviceName, ovhSubsidiary);
  }

  getInitialData(serviceName, ovhSubsidiary, currentServicePackName) {
    return this
      .$q
      .all({
        pendingOrder: this.getPendingOrder(serviceName),
        servicePacks: this.getServicePacks(serviceName, ovhSubsidiary),
      })
      .then(({
        pendingOrder,
        servicePacks,
      }) => {
        const model = {
          options: {
            basic: OptionsService.computeOptionsBasic(),
          },
          pendingOrder,
          servicePacks: {
            all: servicePacks,
            current: OptionsService.computeServicePackCurrent(
              servicePacks,
              currentServicePackName,
            ),
            ordered: OptionsService.computeServicePacksOrdered(
              servicePacks,
              pendingOrder.name,
            ),
          },
        };

        model.servicePacks.orderable = OptionsService.computeServicePacksOrderable(
          servicePacks,
          model.servicePacks.current,
        );

        return model;
      });
  }
};

export default {
  name,
  OptionsService,
};
