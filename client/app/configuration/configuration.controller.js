angular
  .module('App')
  .controller(
    'configurationCtrl',
    class ConfigurationCtrl {
      constructor(
        $q,
        $translate,

        constants,
        DedicatedCloud,
      ) {
        this.$q = $q;
        this.$translate = $translate;

        this.constants = constants;
        this.DedicatedCloud = DedicatedCloud;
      }

      $onInit() {
        this.urlToAllGuides = this.getURLFromSection(this.constants.TOP_GUIDES.all);

        return this.buildingGuideURLs();
      }

      getURLFromSection(section) {
        const currentLanguage = this.$translate.use();
        const fallbackLanguage = this.$translate.fallbackLanguage();

        return section[currentLanguage] || section[fallbackLanguage];
      }

      buildingGuideURLs() {
        return this.fetchingGuideSectionNames()
          .then((sectionNames) => {
            this.sections = sectionNames.reduce(
              (sections, sectionName) => ({
                ...sections,
                [sectionName]: {
                  name: sectionName,
                  links: this.getURLFromSection(this.constants.TOP_GUIDES[sectionName]),
                },
              }),
            );
          });
      }

      fetchingGuideSectionNames() {
        const sectionNames = ['sd'];

        if (this.constants.target === 'US') {
          return this.DedicatedCloud
            .getDescription()
            .then((ids) => {
              if (_.isArray(ids) && !_.isEmpty(ids)) {
                return sectionNames;
              }

              return [];
            });
        }

        sectionNames.push('pcc');
        return this.$q.when(sectionNames);
      }
    },
  );
