angular.module('App').controller('MonitoringAddCtrl', function ($rootScope, $scope, $stateParams, $translate, Server, Alerter, $q) {
  const self = this;

  self.validator = validator;
  self.loaders = {
    init: false,
    add: false,
  };

  self.monitoring = {
    challengeText: null,
    enabled: true,
    interval: null,
    ip: '',
    port: null,
    protocol: '',
    url: null,
  };

  self.smsNotifications = [
    {
      smsAccount: null,
      phoneNumberTo: null,
      fromHour: null,
      toHour: null,
      language: null,
    },
  ];

  self.emailNotifications = [
    {
      email: null,
      language: null,
    },
  ];

  self.show = {
    email: false,
    sms: false,
  };

  self.init = function () {
    self.loaders.init = true;
  };

  self.toggle = function (feat) {
    angular.forEach(self.show, (value, key) => {
      if (key !== feat) {
        self.show[key] = false;
      }
    });

    self.show[feat] = !self.show[feat];
  };

  self.addEMailNotification = function () {
    self.emailNotifications.push({
      email: null,
      language: null,
    });
  };

  self.removeEMailNotification = function (notification) {
    self.emailNotifications = _.without(self.emailNotifications, notification);
  };

  self.addSmsNotification = function () {
    self.smsNotifications.push({
      smsAccount: null,
      phoneNumberTo: null,
      fromHour: null,
      toHour: null,
      language: null,
    });
  };

  self.removeSmsNotification = function (notification) {
    self.smsNotifications = _.without(self.smsNotifications, notification);
  };

  function addEMailNotifications(monitoring) {
    const emailNotifications = self.emailNotifications
      .filter(notification => notification.email !== null
        && validator.isEmail(notification.email) && notification.language !== null);
    let promises = [];

    promises = emailNotifications
      .map(notification => Server.addServiceMonitoringNotificationEmail($stateParams.productId, {
        monitoringId: monitoring.monitoringId,
        data: notification,
      }));

    if (promises.length <= 0) {
      return;
    }

    $q.allSettled(promises).catch((errors) => {
      const displayErrors = _.uniq(errors.map(err => err.data));
      Alerter.alertFromSWS($translate.instant('server_tab_MONITORING_notifications_email_add_error'), displayErrors, 'monitoringAlert');
    });
  }

  function addSmsNotifications(monitoring) {
    const smsNotifications = self.smsNotifications.filter(
      notification => notification.smsAccount !== null
        && notification.phoneNumberTo !== null
        && notification.fromHour !== null
        && notification.toHour !== null
        && notification.language !== null,
    );

    const promises = smsNotifications
      .map(notification => Server.addServiceMonitoringNotificationSMS($stateParams.productId, {
        monitoringId: monitoring.monitoringId,
        data: notification,
      }));

    if (promises.length <= 0) {
      return;
    }

    $q.allSettled(promises).catch((errors) => {
      const displayErrors = _.uniq(errors.map(err => err.data));
      Alerter.alertFromSWS($translate.instant('server_tab_MONITORING_notifications_email_add_error'), displayErrors, 'monitoringAlert');
    });
  }

  self.addMonitoring = function () {
    self.loaders.add = true;

    Server.addServiceMonitoring($stateParams.productId, self.monitoring)
      .then(
        (monitoring) => {
          $rootScope.$broadcast('server.monitoring.reload');

          addEMailNotifications(monitoring);
          addSmsNotifications(monitoring);

          Alerter.success($translate.instant('server_tab_MONITORING_add_success'), 'monitoringAlert');
          $scope.$parent.ctrlMonitoring.addMode = false;
        },
        (err) => {
          Alerter.alertFromSWS($translate.instant('server_tab_MONITORING_add_error'), err.data, 'monitoringAlert');
        },
      )
      .finally(() => {
        self.loaders.add = false;
      });
  };

  self.init();
});
