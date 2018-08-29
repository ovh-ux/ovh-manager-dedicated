angular
  .module('Module.otrs.services')
  .service('Module.otrs.services.otrs', [
    'OvhHttp',
    function (OvhHttp) {
      const self = this;
      const cache = {
        models: 'UNIVERS_MODULE_OTRS_MODELS',
        me: 'UNIVERS_MODULE_OTRS_ME',
        vipStatus: 'UNIVERS_MODULE_OTRS_VIP',
        services: 'UNIVERS_MODULE_OTRS_SERVICES',
        services2Api: 'UNIVERS_MODULE_OTRS_SERVICES_2API',
        emails: 'UNIVERS_MODULE_OTRS_EMAILS',
      };

      this.noAvailableService = [];

      // self.createMenu = Menu.init;
      self.isLoaded = false;

      self.init = function () {
        // self.createMenu();
        self.isLoaded = true;
      };

      this.getModels = function () {
        return OvhHttp.get('/support.json', {
          rootPath: 'apiv6',
          cache: cache.models,
        });
      };

      this.getMe = function () {
        return OvhHttp.get('/me', {
          rootPath: 'apiv6',
          cache: cache.me,
        });
      };

      this.isVIP = function () {
        return OvhHttp.get('/me/vipStatus', {
          rootPath: 'apiv6',
          cache: cache.vipStatus,
        });
      };

      this.getServices = function (opts) {
        return OvhHttp.get('/products', {
          rootPath: '2api',
          params: opts,
          cache: cache.services,
          clearCache: opts ? opts.forceRefresh : false,
        });
      };

      this.getTickets = function (filters) {
        if (filters.status === 'archived') {
          _.set(filters, 'status', null);
          _.set(filters, 'archived', true);
        }
        return OvhHttp.get('/support/tickets', {
          rootPath: 'apiv6',
          params: _.pick(filters, _.identity),
        });
      };

      this.getTicket = function (ticketId) {
        return OvhHttp.get('/support/tickets/{ticketId}', {
          rootPath: 'apiv6',
          urlParams: {
            ticketId,
          },
        });
      };

      this.postTicket = function (ticket) {
        return OvhHttp.post('/support/tickets/create', {
          rootPath: 'apiv6',
          data: ticket,
        });
      };

      this.closeTicket = function (ticketId) {
        return OvhHttp.post('/support/tickets/{ticketId}/close', {
          rootPath: 'apiv6',
          urlParams: {
            ticketId,
          },
          data: {},
        });
      };

      this.replyTicket = function (ticketId, body) {
        return OvhHttp.post('/support/tickets/{ticketId}/reply', {
          rootPath: 'apiv6',
          urlParams: {
            ticketId,
          },
          data: {
            body,
          },
        });
      };

      this.getTicketMessages = function (ticketId) {
        return OvhHttp.get('/support/tickets/{ticketId}/messages', {
          rootPath: 'apiv6',
          urlParams: {
            ticketId,
          },
        });
      };

      this.getEmails = function (opts) {
        return OvhHttp.get('/me/notification/email/history', {
          rootPath: 'apiv6',
          cache: cache.emails,
          clearAllCache: opts.forceRefresh,
        });
      };

      this.getEmail = function (emailId) {
        return OvhHttp.get('/me/notification/email/history/{emailId}', {
          rootPath: 'apiv6',
          urlParams: {
            emailId,
          },
        });
      };

      this.getCloudProject = function (serviceName) {
        return OvhHttp.get('/cloud/project/{serviceName}', {
          rootPath: 'apiv6',
          urlParams: {
            serviceName,
          },
        });
      };
    },
  ])
  .constant('VIP_CONSTANTS', {
    VIP_PHONE: {
      FR: '09.72.100.100',
    },
  });
