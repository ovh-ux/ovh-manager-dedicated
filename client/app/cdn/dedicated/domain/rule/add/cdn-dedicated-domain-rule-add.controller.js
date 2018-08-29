angular.module('App').controller('CacherulesCreateCtrl', ($scope, $stateParams, $translate, CdnDomain, Alerter) => {
  $scope.alert = 'cdn_domain_tab_rules_alert';
  $scope.infos = null;
  $scope.entry = {};

  $scope.$watch('entry.cacheType', (newCacheType) => {
    if (newCacheType === 'NO_CACHE') {
      $scope.entry.ttl = 0;
    }
  });

  $scope.loadCacheRulesInfos = function () {
    CdnDomain.getCacheRulesGeneralInformations().then(
      (data) => {
        $scope.infos = data;
      },
      (data) => {
        Alerter.alertFromSWS($translate.instant('cdn_domain_configuration_cacherule_create_fail'), data, $scope.alert);
      },
    );
  };

  $scope.isValidRule = function () {
    const areFieldsValid = $scope.entry.ttl >= 0
      && $scope.entry.cacheType
      && $scope.entry.fileMatch
      && $scope.entry.fileType;
    let isFileTypeValid = false;

    if (areFieldsValid && $scope.entry.fileType && $scope.entry.fileMatch) {
      switch ($scope.entry.fileType) {
        case 'EXTENSION':
          isFileTypeValid = $scope.entry.fileMatch.match(/^([*]*)+\.\w{2,4}(\?[\w\W]*)?$/);
          break;
        case 'FILE':
          isFileTypeValid = $scope.entry.fileMatch.match(/^([\/])[-\w\d\:\/\._]+\.\w{2,4}([\w\W]*)?$/); // eslint-disable-line
          break;
        case 'FOLDER':
          isFileTypeValid = $scope.entry.fileMatch.match(/^([\/]+)+([-\w\d\:\/\.]+)*([\/]*)$/); // eslint-disable-line
          break;
        default:
          break;
      }
    }
    return areFieldsValid && isFileTypeValid;
  };

  $scope.create = function () {
    $scope.resetAction();
    CdnDomain
      .createCacherule(
        $stateParams.productId,
        $stateParams.domain,
        $scope.entry.cacheType,
        $scope.entry.fileMatch,
        $scope.entry.fileType,
        $scope.entry.ttl,
      )
      .then(() => Alerter.alertFromSWS($translate.instant('cdn_domain_configuration_cacherule_create_success'), true, $scope.alert))
      .catch(data => Alerter.alertFromSWS($translate.instant('cdn_domain_configuration_cacherule_create_fail'), data, $scope.alert));
  };
});
