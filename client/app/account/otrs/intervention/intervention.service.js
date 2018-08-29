angular.module('Module.otrs.services').service('Module.otrs.services.Intervention', function ($q, OvhHttp, User, constants) {
  const self = this;

  const cacheServer = {
    all: 'UNIVERS_DEDICATED_SERVER',
  };

  self.sendDiskReplacement = function (serviceName, disk) {
    const diskToSend = _.assign({}, disk);
    if (!diskToSend.comment) {
      diskToSend.comment = 'No message';
    }
    return OvhHttp.post('/dedicated/server/{serviceName}/support/replace/hardDiskDrive', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName: serviceName.serviceName,
      },
      data: diskToSend,
    });
  };

  function getServerInfo(serviceName) {
    return OvhHttp.get('/dedicated/server/{serviceName}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      cache: cacheServer.all,
    });
  }

  function getHardwareInfo(serviceName) {
    return OvhHttp.get('/dedicated/server/{serviceName}/specifications/hardware', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  }

  function hasMegaRaidCard(hardwareInfo) {
    return _.some(hardwareInfo.diskGroups, { raidController: 'MegaRaid' });
  }

  function canHotSwap(serverInfo, hardwareInfo) {
    return serverInfo.commercialRange.toUpperCase() === 'HG' && _.includes(['2U', '4U'], hardwareInfo.formFactor.toUpperCase());
  }

  function slotInfo(serverInfo, hardwareInfo) {
    const canUseSlotId = serverInfo.commercialRange.toUpperCase() === 'HG';
    const slotsCount = hardwareInfo.formFactor.toUpperCase() === '4U' ? 24 : 12;
    return {
      canUseSlotId,
      slotsCount,
    };
  }

  self.getServerInterventionInfo = function (serviceName) {
    return $q
      .all({
        serverInfo: getServerInfo(serviceName),
        hardwareInfo: getHardwareInfo(serviceName),
      })
      .then(results => ({
        canHotSwap: canHotSwap(results.serverInfo, results.hardwareInfo),
        hasMegaRaid: hasMegaRaidCard(results.hardwareInfo),
        slotInfo: slotInfo(results.serverInfo, results.hardwareInfo),
      }));
  };

  self.getGuidesForDiskIntervention = function () {
    return User.getUser().then((user) => {
      if (user && _.has(constants.urls, [user.ovhSubsidiary, 'guides'])) {
        return {
          diskSerial: constants.urls[user.ovhSubsidiary].guides.diskSerial
            || constants.urls.FR.guides.diskSerial,
          noMegaRaidLED: constants.urls[user.ovhSubsidiary].guides.noMegaRaidLED
            || constants.urls.FR.guides.noMegaRaidLED,
          megaRaidLED: constants.urls[user.ovhSubsidiary].guides.megaRaidLED
            || constants.urls.FR.guides.megaRaidLED,
        };
      }
      return null;
    });
  };
});
