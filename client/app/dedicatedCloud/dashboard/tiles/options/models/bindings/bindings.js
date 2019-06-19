import OptionsDescriptionsService from '../../descriptions/options-description.service';
import { ServicePackOptionService } from '../../../../../service-pack/option/option.service';

import { ACTIVATION_STATUS } from '../../components/activation-status/activation-status.constants';
import { OPTION_TYPES } from '../../../../../service-pack/option/option.constants';
import { ORDER_STATUS } from '../../options.constants';

export default class {
  constructor() {
    this.currentUser = undefined;
    this.isLoading = true;

    this.options = {
      basic: {
        actionMenu: {
          exists: undefined,
          items: {
            activate: {
              exists: undefined,
              stateParams: {
                activationType: undefined,
                orderableServicePacks: undefined,
                servicePacks: undefined,
              },
            },
            switch: {
              exists: undefined,
              stateParams: {
                activationType: undefined,
                orderableServicePacks: undefined,
                servicePacks: undefined,
              },
            },
            payCheckout: {
              exists: undefined,
              url: undefined,
            },
          },
        },
        description: {
          items: undefined,
        },
      },
      certification: {
        description: {
          exists: undefined,
          name: undefined,
          managementInterfaceUrl: undefined,
          presentationUrl: undefined,
          status: undefined,
        },
        actionMenu: {
          exists: undefined,
          items: {
            activate: {
              exists: undefined,
              stateParams: {
                activationType: undefined,
                orderableServicePacks: undefined,
                servicePacks: undefined,
              },
            },
            configure: {
              exists: undefined,
              stateParams: {
                activationType: undefined,
                orderableServicePacks: undefined,
                servicePacks: undefined,
              },
            },
            payCheckout: {
              exists: undefined,
              url: undefined,
            },
          },
        },
      },
    };
  }

  update(model) {
    this.model = model;
    this.currentUser = model.currentUser;

    this.updateOptionsBasic();
    this.updateOptionsCertification();
  }

  updateOptionsBasic() {
    this.updateOptionsBasicDescriptionItems();
    this.updateOptionsBasicActionMenu();
  }

  updateOptionsBasicDescriptionItems() {
    this.options.basic.description.items = this
      .computeOptionsBasicDescriptionItems();
  }

  updateOptionsBasicActionMenu() {
    this.updateOptionsBasicActionMenuItems();
    this.options.basic.actionMenu.exists = this
      .computeOptionsBasicActionMenuExists();
  }

  updateOptionsBasicActionMenuItems() {
    this.options.basic.actionMenu.items.activate = this
      .computeOptionsBasicActionMenuItemsActivate();
    this.options.basic.actionMenu.items.switch = this
      .computeOptionsBasicActionMenuItemsSwitch();
    this.options.basic.actionMenu.items.payCheckout = this
      .computeOptionsBasicActionMenuItemsPayCheckout();
  }

  updateOptionsCertification() {
    this.options.certification.exists = this
      .computeOptionsCertificationExists();
    this.updateOptionsCertificationDescription();
    this.updateOptionsCertificationActionMenu();
  }

  updateOptionsCertificationDescription() {
    this.options.certification.description = this
      .computeOptionsCertificationDescription();
  }

  updateOptionsCertificationActionMenu() {
    this.updateOptionsCertificationActionMenuItems();
    this.options.certification.actionMenu.exists = this
      .computeOptionsCertificationActionMenuExists();
  }

  updateOptionsCertificationActionMenuItems() {
    this.options.certification.actionMenu.items.activate = this
      .computeOptionsCertificationActionMenuItemsActivate();
    this.options.certification.actionMenu.items.configure = this
      .computeOptionsCertificationActionMenuItemsConfigure();
    this.options.certification.actionMenu.items.payCheckout = this
      .computeOptionsCertificationActionMenuItemsPayCheckout();
  }

  computeOptionsBasicDescriptionItems() {
    return _.map(
      this.model.options.basic,
      (option) => {
        const status = OptionsDescriptionsService.computeStatus(
          !!this.model.servicePacks.current.basicOptions[option.name],
          this.model.servicePacks.ordered.exists
            && this.model.servicePacks.ordered.basicOptions[option.name],
          this.model.pendingOrder.exists,
          this.model.pendingOrder.status,
        );

        return {
          ...option,
          presentationUrl: status === ACTIVATION_STATUS.disabled
            && ServicePackOptionService.getPresentationUrl(option.name, this.model.currentUser),
          status,
        };
      },
    );
  }

  computeOptionsBasicActionMenuItemsActivation() {
    const whenThereIsNoPendingOrder = !this.model.pendingOrder.exists
      && !_.isEmpty(this.model.servicePacks.orderable.withOnlyBasicOptions);
    const whenThereIsAPendingOrder = this.model.pendingOrder.exists
      && this.model.pendingOrder.status === ORDER_STATUS.notPaid
      && this.model.servicePacks.orderable.withOnlyBasicOptions.length > 1;

    const exists = whenThereIsNoPendingOrder || whenThereIsAPendingOrder;

    return {
      exists,
      stateParams: {
        activationType: OPTION_TYPES.basic,
        orderableServicePacks: this.model.servicePacks.orderable.withOnlyBasicOptions,
        servicePacks: this.model.servicePacks.all,
      },
    };
  }

  computeOptionsBasicActionMenuItemsActivate() {
    const base = this.computeOptionsBasicActionMenuItemsActivation();

    return {
      ...base,
      exists: base.exists
        && _.isEmpty(_.keys(this.model.servicePacks.current.basicOptions)),
    };
  }

  computeOptionsBasicActionMenuItemsSwitch() {
    const base = this.computeOptionsBasicActionMenuItemsActivation();

    return {
      ...base,
      exists: base.exists
        && !_.isEmpty(_.keys(this.model.servicePacks.current.basicOptions)),
    };
  }

  computeOptionsBasicActionMenuItemsPayCheckout() {
    return {
      exists: this.model.pendingOrder.exists
        && this.model.pendingOrder.status === ORDER_STATUS.notPaid,
      url: this.model.pendingOrder.exists
        && this.model.pendingOrder.url,
    };
  }

  computeOptionsBasicActionMenuExists() {
    return _.some(
      _.map(
        _.values(this.options.basic.actionMenu.items),
        'exists',
      ),
    );
  }

  computeOptionsCertificationExists() {
    return !_.isEmpty(this.model.servicePacks.orderable.withACertification)
    || this.model.servicePacks.current.certification;
  }

  computeOptionsCertificationDescription() {
    const exists = this.model.servicePacks.current.certification != null;
    return {
      exists,
      name: exists && this.model.servicePacks.current.certification.name,
      managementInterfaceUrl: exists && this.model.currentService.certifiedInterfaceUrl,
      presentation: {
        exists: !exists,
        url: ServicePackOptionService.getPresentationUrl('home', this.model.currentUser),
      },
    };
  }

  computeOptionsCertificationActionMenuExists() {
    return _.some(
      _.map(
        _.values(this.options.certification.actionMenu.items),
        'exists',
      ),
    );
  }

  computeOptionsCertificationActionMenuItemsActivate() {
    return {
      exists: !_.isEmpty(this.model.servicePacks.orderable.withACertification)
        && !this.model.servicePacks.current.certification,
      stateParams: {
        activationType: OPTION_TYPES.certification,
        orderableServicePacks: this.model.servicePacks.orderable.withACertification,
        servicePacks: this.model.servicePacks.all,
      },
    };
  }

  computeOptionsCertificationActionMenuItemsConfigure() {
    return {
      exists: _.isString(this.model.pendingOrder.nameOfStepToResume)
        && !_.isEmpty(this.model.pendingOrder.nameOfStepToResume),
      stateParams: {
        activationType: OPTION_TYPES.certification,
        nameOfStepToResume: this.model.pendingOrder.nameOfStepToResume,
        orderableServicePacks: this.model.servicePacks.orderable.withACertification,
        servicePacks: this.model.servicePacks.all,
      },
    };
  }

  computeOptionsCertificationActionMenuItemsPayCheckout() {
    return {
      exists: this.model.pendingOrder.exists
        && this.model.pendingOrder.status === ORDER_STATUS.notPaid,
      url: this.model.pendingOrder.exists
        && this.model.pendingOrder.url,
    };
  }
}
