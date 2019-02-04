import { OPTION_TYPES } from '../dedicatedCloud-option.constants';

/* @ngInject */
export default class DedicatedCloudOptionActivationCtrl {
  constructor(
    $translate,
  ) {
    this.$translate = $translate;
  }

  $onInit() {
    this.allOptions = this.allServicePacks
      .filter(servicePack => _.isEqual(servicePack.getTypesOfOptions(), [OPTION_TYPES.option]))
      .map((servicePack) => {
        this.a = 'pouet';

        return {
          value: servicePack.name,
          displayValue: this.$translate.instant(`dedicatedCloud_options_name_${servicePack.name}`),
          descriptionUrl: servicePack.descriptionUrl,
        };
      });

    this.allOptions = [
      {
        value: 'nxs',
        displayValue: 'NSX',
        descriptionUrl: 'http',
        costDifferenceWithCurrentOffer: 100,
      },
      {
        value: 'vrops',
        displayValue: 'vROps',
        descriptionUrl: 'http',
        costDifferenceWithCurrentOffer: 200,
      },
      {
        value: 'nxs-and-vrops',
        displayValue: 'NSX et vROps',
        costDifferenceWithCurrentOffer: -300,
      },
    ];
  }
}
