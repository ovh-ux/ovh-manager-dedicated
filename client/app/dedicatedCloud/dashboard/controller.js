import _ from 'lodash';
import { OPTION_TYPES } from '../servicePack/option/constants';

/* @ngInject */
export default class {
  constructor(
    $scope,
    $state,
    $stateParams,
    $timeout,
    $translate,
    $uibModal,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    const currentServicePack = _.find(
      this.servicePacks,
      { name: this.currentService.servicePackName },
    );

    this.optionsTheCurrentServicePackHas = _.filter(
      currentServicePack.options,
      { type: OPTION_TYPES.basicOption },
    );

    this.currentCertification = _.find(
      currentServicePack.options,
      { type: OPTION_TYPES.certification },
    );

    this.orderableServicePacksWithOnlyBasicOptions = _.filter(
      _.reject(this.servicePacks, { name: currentServicePack.name }),
      servicePack => _.every(
        servicePack.options,
        option => _.isEqual(option.type, OPTION_TYPES.basicOption),
      ),
    );

    this.orderableServicePacksWithCertifications = _.filter(
      _.reject(this.servicePacks, { name: currentServicePack.name }),
      servicePack => _.some(
        servicePack.options,
        option => _.isEqual(option.type, OPTION_TYPES.certification),
      ),
    );

    this.setAction = (action, data) => this.$scope.$parent.setAction(action, data);
  }

  openingModaleToEditDescription() {
    return this.$uibModal
      .open({
        animation: true,
        templateUrl: 'components/name-edition/name-edition.html',
        controller: 'NameEditionCtrl',
        controllerAs: '$ctrl',
        resolve: {
          data: () => ({
            contextTitle: 'dedicatedCloud_description',
            productId: this.$stateParams.productId,
            value: this.currentService.description,
          }),
        },
      }).result
      .then(() => this.$state.reload());
  }

  buildDescription() {
    return this.$translate.instant(
      'dedicatedCloud_type_template',
      {
        productName: this.$translate.instant(`dedicatedCloud_type_${this.currentService.solution}`),
        versionDisplayValue: this.currentService.solution === 'VSPHERE' && this.currentService.version ? ` ${this.currentService.version.major}` : '',
      },
    );
  }

  getUserAccessPolicyLabel() {
    const policy = this.currentService.userAccessPolicy;
    const formattedPolicy = _.snakeCase(policy).toUpperCase();

    return _.isString(formattedPolicy) && !_.isEmpty(formattedPolicy)
      ? this.$translate.instant(`dedicatedCloud_user_access_policy_${formattedPolicy}`)
      : '-';
  }
}
