angular.module('App').controller('ServerInstallationGabaritCtrl', ($rootScope, $scope, $q, $translate, Server, $filter, Alerter, $stateParams) => {
  $scope.installation = {
    server: angular.copy($scope.currentActionData),
    familyType: [],
    distributionList: null,

    selectFamily: null,
    selectGabarit: null,
    selectLanguage: null,

    diskGroupId: null,
    hasData: false,
    deleteGabarit: null,
    nbDiskUse: null, // if nbPhysicalDisk > 2 user can select nb disk to use

    options: {
      saveGabarit: false,
      gabaritNameSave: null,
      changeLog: null,
      customHostname: null,
      postInstallationScriptLink: null,
      postInstallationScriptReturn: null,
      sshKeyName: null,
      useDistributionKernel: false,
      installSqlServer: false,
      useSpla: false,
      validForm: true,
    },
  };

  // Nb of disk use for partitionning.
  // If server has Raid controller, nbDisk = 1, nbPhysicalDisk = n
  $scope.informations = {
    nbDisk: 0,
    hardwareRaid: null,
    hardwareRaidCompatible: true,
  };

  $scope.errorGab = {
    ws: false,
  };

  $scope.countFilter = [];

  $scope.loader = {
    loading: false,
  };

  $scope.load = function () {
    $scope.loader.loading = true;
    $scope.installation.selectGabarit = null;
    $scope.installation.selectFamily = null;
    $scope.installation.selectLanguage = null;
    $scope.installation.deleteGabarit = null;

    Server.getPersonalTemplates($stateParams.productId)
      .then((templateList) => {
        $scope.installation.familyType = templateList.family;
        $scope.installation.distributionList = templateList.templates.results;
        $scope.informations.nbDisk = $scope.installation.server.nbDisk;
        $scope.installation.nbDiskUse = $scope.installation.server.nbDisk;
      })
      .catch((data) => {
        $scope.resetAction();
        Alerter.alertFromSWS($translate.instant('server_configuration_installation_ovh_fail_os', { t0: $scope.installation.server.name }), data.data, 'server_dashboard_alert');
      })
      .finally(() => {
        $scope.loader.loading = false;
      });
  };

  $scope.getCountFilter = function (itemFamily) {
    const tab = $filter('filter')($scope.installation.distributionList, { family: itemFamily });
    $scope.countFilter[itemFamily] = tab.length;

    if ($scope.countFilter[itemFamily] > 0) {
      if (!$scope.installation.selectFamily) {
        $scope.installation.selectFamily = itemFamily;
      }
      $scope.installation.hasData = true;
    }
    return tab;
  };

  $scope.setSelectGabarit = function (gabarit) {
    $scope.installation.selectGabarit = gabarit;
    $scope.installation.selectLanguage = $scope.installation.selectGabarit.defaultLanguage;
  };

  $scope.clearErrorPersonalTemplate = function () {
    $scope.errorGab.ws = null;
  };

  function getDisks(disks) {
    if (disks && disks[0].indexOf('[') > -1) {
      return _.chain(disks)
        .map((_elem) => {
          const elem = _elem.replace(/\[|\]/g, '');
          return elem.split(',');
        })
        .flatten()
        .value();
    }
    return disks;
  }

  // call after select gabarit
  $scope.loadStep2 = function () {
    let tempHardwareRaid;
    $scope.loader.loading = true;
    $scope.informations.hardwareRaid = null;
    $scope.informations.hardwareRaidCompatible = true;
    $scope.installation.options = {
      saveGabarit: false,
      gabaritNameSave: null,
      changeLog: $scope.installation.selectGabarit.changeLog,
      customHostname: $scope.installation.selectGabarit.customHostname,
      postInstallationScriptLink: $scope.installation.selectGabarit.postInstallationScriptLink,
      postInstallationScriptReturn: $scope.installation.selectGabarit.postInstallationScriptReturn,
      sshKeyName: $scope.installation.selectGabarit.sshKeyName,
      useDistributionKernel: $scope.installation.selectGabarit.useDistributionKernel,
      installSqlServer: false,
      useSpla: false,
      validForm: true,
    };

    Server
      .getHighestPriorityPartitionScheme(
        $stateParams.productId,
        $scope.installation.selectGabarit.id,
      )
      .then(response => Server.getPartitionSchemeHardwareRaid(
        $stateParams.productId,
        $scope.installation.selectGabarit.id,
        response.name,
      ))
      .then((response) => {
        if (response) {
          tempHardwareRaid = response;
          return Server.getHardwareRaidProfile($stateParams.productId);
        }
        return null;
      })
      .catch((error) => {
        if (Server.isHardRaidLocationError(error)) {
          $scope.errorGab.ws = $translate.instant('server_configuration_installation_ovh_step1_hardwareRaid_wrong_location');
          $scope.informations.hardwareRaidCompatible = false;
        } else if (Server.isHardRaidUnavailableError(error)) {
          $scope.errorGab.ws = $translate.instant('server_configuration_installation_gabarit_step2_hardwareRaid_incompatible_noHardwareRaid');
          $scope.informations.hardwareRaidCompatible = false;
        } else {
          $q.reject(error);
        }
      })
      .then(() => {
        if (tempHardwareRaid) {
          $scope.informations.hardwareRaid = tempHardwareRaid;
          if (!$scope.installation.server.raidController) {
            $scope.errorGab.ws = $translate.instant('server_configuration_installation_gabarit_step2_hardwareRaid_incompatible_noHardwareRaid');
            $scope.informations.hardwareRaidCompatible = false;
          } else {
            $scope.informations.hardwareRaid.disks = getDisks($scope.informations
              .hardwareRaid.disks);
            if ($scope.installation.server.nbPhysicalDisk < $scope.informations.hardwareRaid
              .disks.length) {
              $scope.errorGab.ws = $translate.instant('server_configuration_installation_gabarit_step2_hardwareRaid_incompatible_disks', {
                t0: $scope.installation.server.nbPhysicalDisk,
                t1: $scope.informations.hardwareRaid.disks.length,
              });
              $scope.informations.hardwareRaidCompatible = false;
            }
          }
        }
      })
      .catch((error) => {
        $scope.resetAction();
        Alerter.alertFromSWS($translate.instant('server_configuration_installation_ovh_fail_partition_schemes', { t0: $scope.installation.server.name }), error, 'server_dashboard_alert');
      })
      .finally(() => {
        $scope.loader.loading = false;
      });
  };

  // Call after delete gabarit
  $scope.$on('dedicated.installation.gabarit.refresh', () => {
    $scope.load();
  });

  $scope.deleteGabarit = function () {
    $scope.loader.loading = true;

    Server.deleteGabarit($stateParams.productId, $scope.installation.deleteGabarit.id).then(
      () => {
        $scope.errorGab.ws = null;
        $scope.installation.deleteGabarit = null;
      },
      (data) => {
        $scope.errorGab.ws = $translate.instant('server_configuration_installation_gabarit_step1_delete_fail', {
          t0: $scope.installation.deleteGabarit.displayName,
          t1: data.data.message,
        });
      },
    );
  };

  // ------INSTALL------

  function startInstall() {
    $scope.loader.loading = true;
    Server.startInstallation($stateParams.productId, $scope.installation.selectGabarit.id, {
      language: _.camelCase($scope.installation.selectLanguage),
      customHostname: $scope.installation.options.customHostname,
      installSqlServer: $scope.installation.options.installSqlServer,
      postInstallationScriptLink: $scope.installation.options.postInstallationScriptLink,
      postInstallationScriptReturn: $scope.installation.options.postInstallationScriptReturn,
      sshKeyName: $scope.installation.options.sshKeyName,
      useDistribKernel: $scope.installation.options.useDistributionKernel,
      useSpla: $scope.installation.options.useSpla,
      softRaidDevices: $scope.informations.nbDisk > 2 && $scope.installation.nbDiskUse > 1
        ? $scope.installation.nbDiskUse
        : null,
      noRaid: $scope.installation.nbDiskUse === 1 && !$scope.informations.raidController,
    })
      .then(
        (task) => {
          _.set(task, 'id', task.taskId);
          $scope.setMessage(null);
          $rootScope.$broadcast('dedicated.informations.reinstall', task);
          $scope.setAction('installation/progress/dedicated-server-installation-progress', $scope.installation.server);
        },
        (data) => {
          $scope.errorGab.ws = $translate.instant('server_configuration_installation_gabarit_step2_error', {
            t0: $scope.installation.selectGabarit.displayName,
            t1: $scope.installation.server.name,
            t2: $scope.installation.selectLanguage,
            t3: data.message,
          });
        },
      )
      .finally(() => {
        $scope.loader.loading = false;
      });
  }

  $scope.install = function () {
    if ($scope.installation.options.saveGabarit) {
      $scope.loader.loading = true;
      Server
        .putSetGabarit(
          $stateParams.productId,
          $scope.installation.selectGabarit.id,
          $scope.installation.options.gabaritNameSave,
          {
            changeLog: $scope.installation.options.changeLog,
            customHostname: $scope.installation.options.customHostname,
            postInstallationScriptLink: $scope.installation.options.postInstallationScriptLink,
            postInstallationScriptReturn: $scope.installation.options.postInstallationScriptReturn,
            sshKeyName: $scope.installation.options.sshKeyName,
            useDistributionKernel: $scope.installation.options.useDistributionKernel,
          },
        )
        .then(
          () => {
            $scope.installation.selectGabarit.displayName = angular.copy($scope.installation
              .options.gabaritNameSave);
            $scope.installation.selectGabarit.id = angular.copy($scope.installation
              .options.gabaritNameSave);
            startInstall();
          },
          (data) => {
            $scope.loader.loading = false;
            $scope.errorGab.ws = $translate.instant('server_configuration_installation_error_save', { t0: data.data.message });
          },
        );
    } else {
      startInstall();
    }
  };

  $scope.$on('dedicated.informations.reinstall.form.update', (e, validForm) => {
    $scope.installation.options.validForm = validForm;
  });

  // return range between 1 and nbdisque of server if > 1
  $scope.getNbDisqueList = function (nbdisk) {
    if (nbdisk > 1) {
      return _.range(1, nbdisk + 1);
    }
    return [nbdisk];
  };
});
