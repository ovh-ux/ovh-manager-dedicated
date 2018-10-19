angular.module('App').controller('ConfigurationCtrl', class ConfigurationCtrl {
  constructor($q, $scope, $state, $stateParams, $translate, featureAvailability, constants,
    DedicatedCloud, User) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.featureAvailability = featureAvailability;
    this.constants = constants;
    this.DedicatedCloud = DedicatedCloud;
    this.User = User;
  }

  $onInit() {
    this.$scope.guide = {
      sections: ['sd'],
      links: [],
      all: null,
    };
    this.hasError = false;
    this.fallbackLanguage = 'en_GB';
    return this.getSections().then((sections) => {
      const selectedLanguage = this.getSelectedLanguage();
      _.each(sections, (section) => {
        if (this.constants.TOP_GUIDES[section][selectedLanguage]) {
          this.$scope.guide.links[section] = this.constants.TOP_GUIDES[section][selectedLanguage];
        } else {
          this.$scope.guide.links[section] = this.constants
            .TOP_GUIDES[section][this.fallbackLanguage];
        }
      });
      this.$scope.guide.all = this.constants.TOP_GUIDES.all[selectedLanguage]
        || this.constants.TOP_GUIDES.all[this.fallbackLanguage];
    });
  }

  /**
   * Get sections where guides are available.
   * @return {Promise}
   */
  getSections() {
    const deferred = this.$q.defer();
    this.hasError = false;
    if (this.featureAvailability.hasPCC()) {
      // special case: do not display private cloud guide tab
      // for US customer if he has no dedicated cloud product
      if (this.constants.target === 'US') {
        this.DedicatedCloud.getDescription()
          .then((ids) => {
            if (ids && ids.length > 0) {
              // TODO: uncomment when all guides are available on ovhcloud.com.
              // this.$scope.guide.sections.push("pcc");
              deferred.resolve(this.$scope.guide.sections);
            }
          })
          .catch((err) => {
            this.hasError = true;
            deferred.reject(err);
          });
      } else {
        this.$scope.guide.sections.push('pcc');
        deferred.resolve(this.$scope.guide.sections);
      }
    }
    return deferred.promise;
  }

  getSelectedLanguage() {
    return this.$translate.use();
  }
});
