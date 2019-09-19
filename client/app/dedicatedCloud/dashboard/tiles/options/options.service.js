import _ from 'lodash';

import { DELIVERY_STATUS } from '../../../service-pack/service-pack.constants';

import {
  OPTIONS,
  OPTION_TYPES,
} from '../../../service-pack/option/option.constants';

import { ORDER_STATUS } from './options.constants';

export const name = 'ovhManagerPccDashboardOptionsService';

export const OptionsService = class OptionsService {
  /* @ngInject */
  constructor(
    $q,
    OvhApiDedicatedCloud,
    ovhManagerPccDashboardOptionsOrderService,
    ovhManagerPccDashboardOptionsUserService,
    ovhManagerPccServicePackService,
  ) {
    this.$q = $q;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.ovhManagerPccDashboardOptionsOrderService = ovhManagerPccDashboardOptionsOrderService;
    this.ovhManagerPccDashboardOptionsUserService = ovhManagerPccDashboardOptionsUserService;
    this.ovhManagerPccServicePackService = ovhManagerPccServicePackService;
  }

  static computeServicePackCurrent(
    allServicePacks,
    computedPendingOrder,
    currentServicePackName,
  ) {
    const matchingServicePack = _.find(
      allServicePacks,
      {
        name: (
          computedPendingOrder.exists && computedPendingOrder.nameOfServicePackBeforeOrder
        ) || currentServicePackName,
      },
    );

    if (computedPendingOrder.isInitialOrder) {
      matchingServicePack.certification = { exists: false };
    }

    return matchingServicePack;
  }

  static computeServicePacksOrderable(
    allServicePacks,
    currentServicePackName,
    orderedServicePackName,
  ) {
    // all service packs are orderable except the current one
    const orderableServicePacks = _.reject(
      allServicePacks,
      { name: currentServicePackName },
    );

    return {
      withACertification: _.reject(
        _.filter(orderableServicePacks, servicePack => servicePack.certification.exists),
        { name: orderedServicePackName },
      ),
      withOnlyBasicOptions: _.reject(
        _.filter(orderableServicePacks, servicePack => !servicePack.certification.exists),
        { name: orderedServicePackName },
      ),
    };
  }

  static computeServicePacksOrdered(
    allServicePacks,
    pendingOrder,
    currentOrFutureServicePack,
  ) {
    const matchingServicePackName = (pendingOrder && pendingOrder.orderedServicePackName)
      || (
        currentOrFutureServicePack.state !== DELIVERY_STATUS.ACTIVE
        && currentOrFutureServicePack.name
      );

    const matchingServicePack = _.find(
      allServicePacks,
      { name: matchingServicePackName },
    );

    const exists = matchingServicePack != null;

    return {
      ...matchingServicePack,
      exists,
      certification: {
        ...(exists && matchingServicePack.certification),
        exists: exists && matchingServicePack.certification.exists,
      },
      mustBeConfigured: currentOrFutureServicePack.state === DELIVERY_STATUS.WAITING_FOR_CUSTOMER,
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
      .ovhManagerPccDashboardOptionsOrderService
      .getServicePackOrder(serviceName);
  }

  getCurrentOrFutureServicePack(serviceName) {
    this
      .OvhApiDedicatedCloud
      .v6()
      .resetCache();

    return this
      .OvhApiDedicatedCloud
      .v6()
      .servicePack({ serviceName }).$promise;
  }

  getServicePacks(serviceName, ovhSubsidiary) {
    return this
      .ovhManagerPccServicePackService
      .getServicePacksForDashboardOptions(serviceName, ovhSubsidiary);
  }

  getInitialData(serviceName, ovhSubsidiary, currentServicePackName) {
    return this
      .$q
      .when(this
        .getPendingOrder(serviceName)
        .then(pendingOrder => (moment(pendingOrder.expirationDate).isBefore(moment())
          ? this
            .ovhManagerPccDashboardOptionsOrderService
            .deleteServicePackOrder(serviceName)
          : null)))
      .then(() => this
        .$q
        .all({
          pendingOrder: this
            .getPendingOrder(serviceName),
          currentOrFutureServicePack: this
            .getCurrentOrFutureServicePack(serviceName),
          servicePacks: this
            .getServicePacks(serviceName, ovhSubsidiary),
        }))
      .then(({
        pendingOrder,
        currentOrFutureServicePack,
        servicePacks,
      }) => {
        const model = {
          options: {},
          pendingOrder: OptionsService.computePendingOrder(
            pendingOrder,
            currentOrFutureServicePack,
          ),
          servicePacks: {
            all: servicePacks,
          },
        };

        model.options.basic = OptionsService.computeOptionsBasic();

        model.servicePacks.ordered = OptionsService.computeServicePacksOrdered(
          servicePacks,
          model.pendingOrder,
          currentOrFutureServicePack,
        );

        model.servicePacks.current = OptionsService.computeServicePackCurrent(
          servicePacks,
          model.pendingOrder,
          currentServicePackName,
        );

        model.servicePacks.orderable = OptionsService.computeServicePacksOrderable(
          servicePacks,
          model.servicePacks.current.name,
          model.pendingOrder.exists && model.pendingOrder.orderedServicePackName,
        );

        if (!model.pendingOrder.exists) {
          this
            .ovhManagerPccDashboardOptionsOrderService
            .deleteServicePackOrder(serviceName);
        }

        return model;
      });
  }

  static computePendingOrder(
    pendingOrder,
    currentOrFutureServicePack,
  ) {
    const exists = OptionsService
      .computePendingOrderExists(currentOrFutureServicePack, pendingOrder);

    return {
      ...pendingOrder,
      exists,
      isInError: currentOrFutureServicePack.state === DELIVERY_STATUS.ERROR,
      isInitialOrder: !pendingOrder.exists && exists,
      needsConfiguration: OptionsService
        .computePendingOrderNeedsConfiguration(currentOrFutureServicePack),
      orderedServicePackName: exists && (
        pendingOrder.orderedServicePackName || currentOrFutureServicePack.name
      ),
    };
  }

  static computePendingOrderExists(currentOrFutureServicePack, pendingOrder) {
    return currentOrFutureServicePack.state !== DELIVERY_STATUS.ACTIVE
      // tasks can take up to 5 minutes to be created
      || (pendingOrder.exists && (
        pendingOrder.status === ORDER_STATUS.notPaid
        || moment().isBefore(moment(pendingOrder.date).add(5, 'minutes')))
      );
  }

  // user ordered through funnel and arrsived before task creation
  static computePendingOrderNeedsConfiguration(currentOrFutureServicePack) {
    return currentOrFutureServicePack.state === DELIVERY_STATUS.WAITING_FOR_CUSTOMER;
  }
};

export default {
  name,
  OptionsService,
};
