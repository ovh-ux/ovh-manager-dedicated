import config from '../../../../../config/config';

import { ACTIVATION_STATUS } from '../components/activation-status/activation-status.constants';
import { ORDER_STATUS } from '../options.constants';

export default class OptionsDescriptionsService {
  static computePresentationUrl(ovhSubsidiary, optionName) {
    const urls = config.constants.URLS;
    return _.get(urls, ovhSubsidiary, urls.FR).presentations[optionName];
  }

  static computeStatus(
    currentServicePackHasOption,
    orderedServicePackHasOption,
    thereIsAPendingOrder,
    pendingOrderStatus,
  ) {
    // If there is no pending order
    if (!thereIsAPendingOrder) {
      return currentServicePackHasOption
        ? ACTIVATION_STATUS.enabled
        : ACTIVATION_STATUS.disabled;
    }

    // If there is a pending order

    // If the API doesn't know the status of the pending order
    if (pendingOrderStatus === ORDER_STATUS.unknown) {
      return ACTIVATION_STATUS.unknown;
    }

    // If the API knows the status of the pending order

    // - The current service pack already has the option
    // - The ordered service pack will have it too
    if (currentServicePackHasOption && orderedServicePackHasOption) {
      return ACTIVATION_STATUS.enabled;
    }

    // - The current service pack doesn't have the option
    // - The ordered service pack won't have it too
    if (!currentServicePackHasOption && !orderedServicePackHasOption) {
      return ACTIVATION_STATUS.disabled;
    }

    // The option will either:
    // - be installed
    // - be uninstalled
    //
    // If the current service pack doesn't have the option, then it will be installed
    const willBeInstalled = !currentServicePackHasOption;

    if ([
      ORDER_STATUS.documentsRequested,
      ORDER_STATUS.notPaid,
    ].includes(pendingOrderStatus)) {
      return ACTIVATION_STATUS.pendingActivation;
    }

    if ([
      ORDER_STATUS.cancelling,
    ].includes(pendingOrderStatus)) {
      return ACTIVATION_STATUS.cancelling;
    }

    if ([
      ORDER_STATUS.checking,
      ORDER_STATUS.delivering,
    ].includes(pendingOrderStatus)) {
      return willBeInstalled
        ? ACTIVATION_STATUS.beingActivated
        : ACTIVATION_STATUS.beingDeactivated;
    }

    if ([
      ORDER_STATUS.delivered,
    ].includes(pendingOrderStatus)) {
      return ACTIVATION_STATUS.enabled;
    }

    return ACTIVATION_STATUS.unknown;
  }
}
