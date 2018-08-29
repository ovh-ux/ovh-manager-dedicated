angular.module('UserAccount').service('UserAccount.services.Contacts', function (OvhHttp, constants, Poller, $rootScope) {
  const self = this;
  const apiChangeContact = '/me/task/contactChange';
  const cache = {
    models: 'UNIVERS_USER_CONTACTS_MODELS',
    me: 'UNIVERS_USER_CONTACTS_ME',
    services: 'UNIVERS_USER_CONTACTS_SERVICES',
    servicesInfos: 'UNIVERS_USER_CONTACTS_SERVICES_INFOS',
  };

  self.noAvailableService = ['IP', 'VRACK'];
  self.availableService = [
    'CLOUD',
    'DOMAIN',
    'HOSTING',
    'HOSTING_RESELLER',
    'PRIVATE_DATABASE',
    'EMAIL_DOMAIN',
    'DEDICATED',
    'NAS',
    'NASHA',
    'OVER_THE_BOX',
    'PRIVATE_CLOUD',
    'VPS',
    'PACK_XDSL',
    'XDSL',
    'ZONE',
    'FAILOVER',
    'PACK_SIP_TRUNK',
    'LOAD_BALANCER',
  ];
  self.excludeNics = [/^ovhtel-[0-9]+/];

  self.getMe = function () {
    return OvhHttp.get('/me', { rootPath: 'apiv6', cache: cache.me });
  };

  self.getContactChangeTasks = function (params) {
    return OvhHttp.get(apiChangeContact, {
      rootPath: 'apiv6',
      params,
    });
  };

  self.getContactChangeTaskDetail = function (id) {
    return OvhHttp.get([apiChangeContact, '{id}'].join('/'), {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
    });
  };

  self.acceptRequest = function (opts) {
    return OvhHttp.post([apiChangeContact, '{id}', 'accept'].join('/'), {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
      data: {
        token: opts.token,
      },
      broadcast: 'useraccount.contact.request.changed',
    });
  };

  self.refuseRequest = function (opts) {
    return OvhHttp.post([apiChangeContact, '{id}', 'refuse'].join('/'), {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
      data: {
        token: opts.token,
      },
      broadcast: 'useraccount.contact.request.changed',
    });
  };

  self.resendRequest = function (opts) {
    return OvhHttp.post(`${apiChangeContact}/{id}/resendEmail`, {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
      broadcast: 'useraccount.contact.request.changed',
    });
  };

  self.getServices = function (forceRefresh) {
    return OvhHttp.get('/sws/ovhProduct/services', {
      rootPath: '2api',
      clearAllCache: forceRefresh,
      cache: cache.services,
      params: {
        universe: null,
        worldpart: constants.target,
      },
    });
  };

  self.getServiceInfos = function (opts) {
    return OvhHttp.get([opts.path, '/{serviceName}/serviceInfos'].join(''), {
      rootPath: 'apiv6',
      cache: cache.servicesInfos,
      urlParams: {
        serviceName: opts.serviceName,
      },
    });
  };

  self.changeContact = function (opts) {
    return OvhHttp.post([opts.service.path, '/{serviceName}/changeContact'].join(''), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName: opts.service.serviceName,
      },
      data: {
        contactAdmin: opts.contactAdmin,
        contactBilling: opts.contactBilling,
        contactTech: opts.contactTech,
      },
      clearAllCache: cache.servicesInfos,
      broadcast: 'useraccount.contact.changed',
    });
  };

  self.getPendingChanges = function (opts) {
    let ret = null;
    const pendingChanges = angular.fromJson(window.localStorage.getItem(opts.key) || []);
    if (Array.isArray(pendingChanges)) {
      ret = pendingChanges;
    }
    return ret;
  };

  /* eslint-disable no-unused-vars */
  self.addPendingChange = function (opts) {
    let ret = true;
    try {
      const pendingChanges = angular.fromJson(window.localStorage.getItem(opts.key) || []);
      if (Array.isArray(pendingChanges) && pendingChanges.indexOf(opts.data) === -1) {
        pendingChanges.push(opts.data);
        window.localStorage.setItem(opts.key, angular.toJson(pendingChanges));
      }
    } catch (err) {
      ret = false;
    }

    return ret;
  };

  self.removePendingChange = function (opts) {
    let ret = true;
    try {
      let pendingChanges = angular.fromJson(window.localStorage.getItem(opts.key) || []);
      if (Array.isArray(pendingChanges) && pendingChanges.indexOf(opts.data) !== -1) {
        pendingChanges = _.without(pendingChanges, opts.data);
        if (pendingChanges.length > 0) {
          window.localStorage.setItem(opts.key, angular.toJson(pendingChanges));
        } else {
          window.localStorage.removeItem(opts.key);
        }
      }
    } catch (err) {
      ret = false;
    }

    return ret;
  };

  self.pollState = function (opts) {
    if (!opts.id) {
      return $rootScope.$broadcast(`${opts.namespace}.error`, '');
    }

    if (!Array.isArray(opts.successSates)) {
      _.set(opts, 'successSates', [opts.successSates]);
    }

    $rootScope.$broadcast(`${opts.namespace}.start`, opts.id);
    return Poller.poll([`apiv6${apiChangeContact}`, opts.id].join('/'), null, {
      interval: 5000,
      successRule: {
        state(task) {
          return opts.successSates.indexOf(task.state) !== -1;
        },
      },
      namespace: opts.namespace,
    }).then(
      (pollObject, task) => {
        $rootScope.$broadcast(`${opts.namespace}.done`, pollObject, task);
      },
      (err) => {
        $rootScope.$broadcast(`${opts.namespace}.error`, err, opts);
      },
    );
  };

  self.killAllPolling = function (opts) {
    Poller.kill({ namespace: opts.namespace });
  };

  self.getUrlOf = function (link) {
    return self.getMe().then((data) => {
      try {
        return constants.urls[data.ovhSubsidiary][link];
      } catch (exception) {
        return constants.urls.FR[link];
      }
    });
  };
  /* eslint-enable no-unused-vars */

  self.getLegalFormEnum = function () {
    return OvhHttp.get('/me.json', {
      rootPath: 'apiv6',
      cache: cache.me,
    }).then(schema => schema.models['nichandle.LegalFormEnum'].enum);
  };

  self.getCountryEnum = function () {
    return OvhHttp.get('/me.json', {
      rootPath: 'apiv6',
      cache: cache.me,
    }).then(schema => schema.models['nichandle.CountryEnum'].enum);
  };

  self.getGendersEnum = function () {
    return OvhHttp.get('/me.json', {
      rootPath: 'apiv6',
      cache: cache.me,
    }).then(schema => schema.models['nichandle.GenderEnum'].enum);
  };

  self.getLanguageEnum = function () {
    return OvhHttp.get('/me.json', {
      rootPath: 'apiv6',
      cache: cache.me,
    }).then(schema => schema.models['nichandle.LanguageEnum'].enum);
  };

  self.getTaskStateEnum = function () {
    return OvhHttp.get('/me.json', {
      rootPath: 'apiv6',
      cache: cache.me,
    }).then(schema => schema.models['nichandle.changeContact.TaskStateEnum'].enum);
  };

  self.getContactsId = function () {
    return OvhHttp.get('/me/contact', {
      rootPath: 'apiv6',
    });
  };

  self.getContactInfo = function (contactId) {
    return OvhHttp.get(['/me/contact', contactId].join('/'), {
      rootPath: 'apiv6',
    });
  };

  self.getContactFields = function (contactId) {
    return OvhHttp.get(['/me/contact', contactId, 'fields'].join('/'), {
      rootPath: 'apiv6',
    });
  };

  self.getOrderServiceOption = domain => OvhHttp.get('/order/cartServiceOption/domain/{serviceName}', {
    rootPath: 'apiv6',
    urlParams: {
      serviceName: window.encodeURIComponent(domain),
    },
  });

  self.updateContact = function (userData) {
    const dataToSend = angular.copy(userData);
    const contactId = dataToSend.contactId || dataToSend.id;

    if (contactId) {
      delete dataToSend.contactId;
      return OvhHttp.put(['/me/contact', contactId].join('/'), {
        rootPath: 'apiv6',
        data: dataToSend,
      });
    }
    return OvhHttp.post(['/me/contact'].join('/'), {
      rootPath: 'apiv6',
      data: dataToSend,
    });
  };

  this.deleteContact = function (contactId) {
    return OvhHttp.delete('/me/contact/{contactId}', {
      rootPath: 'apiv6',
      urlParams: {
        contactId,
      },
      broadcast: 'useraccount.contact.changed',
    });
  };

  this.getDomainsByOwner = function (contactId) {
    return OvhHttp.get('/domain', {
      rootPath: 'apiv6',
      params: {
        whoisOwner: contactId,
      },
    });
  };
});
