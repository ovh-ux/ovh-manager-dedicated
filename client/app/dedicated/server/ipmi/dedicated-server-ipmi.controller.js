angular.module('App').controller('ImpiCtrl', ($scope, $translate, Server, Polling, Alerter, User, $sce, $stateParams, featureAvailability, constants) => {
  $scope.ttl = '5';
  $scope.alert = 'server_tab_ipmi_alert';

  $scope.ipmi = {
    server: null,
    model: null,
    navigatorUrl: null,
  };

  $scope.kvm = {
    canOrderKvm: false,
    features: null,
  };

  $scope.loader = {
    loading: false,
    error: false,
    httpLoading: false,
    httpError: false,
    httpDone: false,
    passwordLoading: false,
    passwordError: false,
    passwordDone: false,
    pingLoading: false,
    pingError: false,
    pingDone: false,

    buttonStart: false,
    navigationLoading: false,
    navigationReady: null,
    javaLoading: false,
    javaReady: false,
    sshLoading: false,
    kvm: false,
  };

  $scope.disable = {
    restartIpmi: false,
    restartSession: false,
    testActive: false,
    testIpmi: false,
    otherTask: true,
    localTask: false,
  };

  $scope.header = {
    XSRFTOKEN: $.cookie('XSRF-TOKEN'),
    XCsid: $.getUrlParam('csid'),
  };

  // Icons Status change
  function setHttpState(load, done, error) {
    $scope.loader.httpLoading = load;
    $scope.loader.httpDone = done;
    $scope.loader.httpError = error;
  }
  function setPasswordState(load, done, error) {
    $scope.loader.passwordLoading = load;
    $scope.loader.passwordDone = done;
    $scope.loader.passwordError = error;
  }
  function setPingState(load, done, error) {
    $scope.loader.pingLoading = load;
    $scope.loader.pingDone = done;
    $scope.loader.pingError = error;
  }

  // ------------Loader------------
  $scope.init = function () {
    User.getUrlOf('dedicatedIpmi').then((link) => {
      $scope.ipmiHelpUrl = link;
    });

    User.getUser().then((user) => {
      $scope.user = user;
    });

    Server.getSelected($stateParams.productId).then((server) => {
      $scope.ipmi.server = server;
      const urlkvm = `api/dedicated/server/${$scope.ipmi.server.name}/ipmi/connections/kvmipJnlp`;
      $scope.ipmi.server.urlkvm = $sce.trustAsResourceUrl(urlkvm);
    });

    isActivated().then(() => {
      if (!$scope.ipmi.model.activated) {
        Server.canOrderKvm($stateParams.productId).then((orderable) => {
          $scope.kvm.canOrderKvm = orderable === 'true' || orderable === true;

          if (!$scope.kvm.canOrderKvm) {
            $scope.loader.loading = true;

            Server.getKvmFeatures($stateParams.productId)
              .then(
                (features) => {
                  $scope.kvm.features = features;
                },
                (err) => {
                  Alerter.alertFromSWS($translate.instant('server_configuration_kvm_error'), err.data, $scope.alert);
                },
              )
              .finally(() => {
                $scope.loader.loading = false;
              });
          }
        });
      }
    });

    getTaskInProgress();
  };

  $scope.$on('$destroy', () => {
    Polling.addKilledScope($scope.$id);
  });

  $scope.$on('dedicated.informations.reboot.done', () => {
    $scope.disable.otherTask = false;
  });

  $scope.$on('dedicated.informations.reboot', () => {
    $scope.disable.otherTask = true;
    $scope.loader.navigationReady = null;
    $scope.loader.javaReady = false;
  });

  function isActivated() {
    $scope.loader.loading = true;
    $scope.loader.error = false;

    return Server.isIpmiActivated($stateParams.productId).then(
      (results) => {
        $scope.ipmi.model = results;
        $scope.loader.loading = false;
      },
      (err) => {
        $scope.loader.loading = false;
        $scope.loader.error = true;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_loading_error'), err, $scope.alert);
      },
    );
  }

  function getTaskInProgress() {
    // Test if serveur reboot is in progress
    Server.getTaskInProgress($stateParams.productId, 'hardReboot').then((taskTab) => {
      if (taskTab.length === 0) {
        // Test if ipmi session reboot is in progress
        Server.getTaskInProgress($stateParams.productId, 'resetIPMISession').then((_taskTab) => {
          if (_taskTab.length > 0) {
            $scope.disable.localTask = true;
            $scope.disable.restartSession = true;
            startIpmiPollSessionsReset(_taskTab[0]);
          }
        });

        // Test if ipmi restart reboot is in progress
        Server.getTaskInProgress($stateParams.productId, 'resetIPMI').then((_taskTab) => {
          if (_taskTab.length > 0) {
            $scope.disable.localTask = true;
            $scope.disable.restartIpmi = true;
            startIpmiPollRestart(_taskTab[0]);
          }
        });

        // Test if ipmi test is in progress
        Server.getTaskInProgress($stateParams.productId, 'testIPMIhttp').then((_taskTab) => {
          if (_taskTab.length > 0) {
            startIpmiPollHttp(_taskTab[0]);
          } else {
            Server.getTaskInProgress($stateParams.productId, 'testIPMIpassword').then((__taskTab) => {
              if (__taskTab.length > 0) {
                startIpmiPollPassword(__taskTab[0]);
              } else {
                Server.getTaskInProgress($stateParams.productId, 'testIPMIping').then((___taskTab) => {
                  if (___taskTab.length > 0) {
                    startIpmiPollPing(___taskTab[0]);
                  }
                });
              }
            });
          }
        });
        $scope.disable.otherTask = false;
      }
    });
  }

  // ------------Start IPMI------------
  // NAVIGATION
  $scope.startIpmiNavigation = function () {
    $scope.loader.navigationLoading = true;
    $scope.loader.buttonStart = true;
    $scope.loader.navigationReady = null;

    Server.ipmiStartConnection({
      serviceName: $stateParams.productId,
      type: 'serialOverLanURL',
      ttl: $scope.ttl,
      ipToAllow: $scope.ipmi.model.clientIp,
    }).then(
      (task) => {
        startIpmiPollNavigation({ id: task.taskId });
      },
      (data) => {
        $scope.loader.navigationLoading = false;
        $scope.loader.buttonStart = false;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_error'), data.data, $scope.alert);
      },
    );
  };

  function startIpmiPollNavigation(task) {
    Server.addTaskFast($stateParams.productId, task, $scope.$id).then(
      (state) => {
        if (Polling.isResolve(state)) {
          getIpmiNavigation();
        } else {
          startIpmiPollNavigation(task);
        }
      },
      (data) => {
        $scope.loader.navigationLoading = false;
        $scope.loader.buttonStart = false;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_error'), data, $scope.alert);
      },
    );
  }

  function getIpmiNavigation() {
    Server.ipmiGetConnection($stateParams.productId, 'serialOverLanURL').then(
      (connect) => {
        $scope.loader.navigationLoading = false;
        $scope.loader.buttonStart = false;
        $scope.loader.navigationReady = connect.value;
        window.open(connect.value, '_blank');
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_success'), true, $scope.alert);
      },
      (data) => {
        $scope.loader.navigationLoading = false;
        $scope.loader.buttonStart = false;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_error'), data.data, $scope.alert);
      },
    );
  }

  // JAVA
  $scope.startIpmiJava = function () {
    $scope.loader.javaReady = false;
    $scope.loader.javaLoading = true;
    $scope.loader.buttonStart = true;
    const withGeolocation = !_.includes(['HIL_1', 'VIN_1'], $scope.server.datacenter) && constants.target === 'US';
    Server.ipmiStartConnection({
      serviceName: $stateParams.productId,
      type: 'kvmipJnlp',
      ttl: $scope.ttl,
      ipToAllow: $scope.ipmi.model.clientIp,
      withGeolocation,
    }).then(
      (task) => {
        startIpmiPollJava({ id: task.taskId });
      },
      (err) => {
        $scope.loader.javaLoading = false;
        $scope.loader.buttonStart = false;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_java_error'), err, $scope.alert);
      },
    );
  };

  function startIpmiPollJava(task) {
    Server.addTaskFast($stateParams.productId, task, $scope.$id).then(
      (state) => {
        if (Polling.isResolve(state)) {
          getIpmiJava();
        } else {
          startIpmiPollJava(task);
        }
      },
      (data) => {
        $scope.loader.javaLoading = false;
        $scope.loader.buttonStart = false;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_java_error'), data, $scope.alert);
      },
    );
  }

  function getIpmiJava() {
    Alerter.alertFromSWS($translate.instant('server_configuration_impi_java_success'), true, $scope.alert);
    $scope.loader.javaLoading = false;
    $scope.loader.buttonStart = false;
    $scope.loader.javaReady = true;

    Server.ipmiGetConnection($stateParams.productId, 'kvmipJnlp').then(
      (data) => {
        const fileName = 'kvm.jnlp';
        const blob = new Blob([data.value], { type: 'application/x-java-jnlp-file' });

        let link;
        let url;

        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          link = document.createElement('a');
          if (link.download !== undefined) {
            url = window.URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            // window.open("data:application/x-java-jnlp-file," + encodeURIComponent(data.value));
            $scope.appletToDownload = encodeURIComponent(data.value);
          }
        }
      },
      (err) => {
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_java_error'), err, $scope.alert);
      },
    );
  }

  $scope.downloadApplet = function () {
    window.open(`data:application/x-java-jnlp-file,${$scope.appletToDownload}`);
  };

  $scope.submitForm = function () {
    $('#formIpmiJava').submit();
  };

  // ------------Test IPMI------------
  $scope.startIpmiTest = function () {
    setHttpState(false, false, false);
    setPasswordState(false, false, false);
    setPingState(false, false, false);
    startIpmiTestHttp();
  };

  function startIpmiTestStatus() {
    $scope.disable.testActive = true;
    $scope.disable.testIpmi = true;
  }

  // HTTP
  function startIpmiTestHttp() {
    startIpmiTestStatus();
    setHttpState(true, false, false);

    Server.ipmiStartTest($stateParams.productId, 'http', $scope.ttl).then(
      (task) => {
        startIpmiPollHttp(task);
      },
      (data) => {
        setHttpState(false, false, false);
        $scope.disable.testIpmi = true;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_loading_error'), data, $scope.alert);
      },
    );
  }

  function startIpmiPollHttp(task) {
    startIpmiTestStatus();
    setHttpState(true, false, false);

    Server.addTaskFast($stateParams.productId, task, $scope.$id).then(
      (state) => {
        if (Polling.isResolve(state)) {
          setHttpState(false, true, false);
          startIpmiTestPassword();
        } else {
          startIpmiPollHttp(task);
        }
      },
      () => {
        $scope.disable.testIpmi = false;
        setHttpState(false, false, true);
      },
    );
  }

  // PASSWORD
  function startIpmiTestPassword() {
    startIpmiTestStatus();
    setHttpState(false, true, false);
    setPasswordState(true, false, false);

    Server.ipmiStartTest($stateParams.productId, 'password', $scope.ttl).then(
      (task) => {
        startIpmiPollPassword(task);
      },
      (data) => {
        $scope.disable.testIpmi = false;
        setPasswordState(false, false, false);
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_loading_error'), data, $scope.alert);
      },
    );
  }

  function startIpmiPollPassword(task) {
    startIpmiTestStatus();
    setHttpState(false, true, false);
    setPasswordState(true, false, false);

    Server.addTaskFast($stateParams.productId, task, $scope.$id).then(
      (state) => {
        if (Polling.isResolve(state)) {
          setPasswordState(false, true, false);
          startIpmiTestPing();
        } else {
          startIpmiPollPassword(task);
        }
      },
      () => {
        $scope.disable.testIpmi = false;
        setPasswordState(false, false, true);
      },
    );
  }

  // PING
  function startIpmiTestPing() {
    startIpmiTestStatus();
    setHttpState(false, true, false);
    setPasswordState(false, true, false);
    setPingState(true, false, false);

    Server.ipmiStartTest($stateParams.productId, 'ping', $scope.ttl).then(
      (task) => {
        startIpmiPollPing(task);
      },
      (data) => {
        $scope.disable.testIpmi = false;
        setPingState(false, false, false);
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_loading_error'), data, $scope.alert);
      },
    );
  }

  function startIpmiPollPing(task) {
    startIpmiTestStatus();
    setHttpState(false, true, false);
    setPasswordState(false, true, false);
    setPingState(true, false, false);

    Server.addTaskFast($stateParams.productId, task, $scope.$id).then(
      (state) => {
        if (Polling.isResolve(state)) {
          setPingState(false, true, false);
          $scope.disable.testIpmi = false;
        } else {
          startIpmiPollPing(task);
        }
      },
      () => {
        $scope.disable.testIpmi = false;
        setPingState(false, false, true);
      },
    );
  }

  // ------------ACTION IPMI------------
  // Interfaces Restart
  $scope.$on('dedicated.ipmi.resetinterfaces', (e, task) => {
    $scope.disable.restartIpmi = true;
    $scope.disable.localTask = true;
    startIpmiPollRestart(task.data || task);
  });

  function startIpmiPollRestart(task) {
    $scope.loader.navigationReady = null;
    $scope.loader.javaReady = false;
    Server.addTaskFast($stateParams.productId, task, $scope.$id).then(
      (state) => {
        if (Polling.isResolve(state)) {
          $scope.disable.restartIpmi = false;
          $scope.disable.localTask = false;
          Alerter.alertFromSWS($translate.instant('server_configuration_impi_restart_success'), true, $scope.alert);
        } else {
          startIpmiPollRestart(task);
        }
      },
      (data) => {
        $scope.disable.restartIpmi = false;
        $scope.disable.localTask = false;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_restart_error_task'), data, $scope.alert);
      },
    );
  }

  // Sessions Reset
  $scope.$on('dedicated.ipmi.resetsessions', (e, task) => {
    $scope.disable.restartSession = true;
    $scope.disable.localTask = true;
    startIpmiPollSessionsReset(task.data || task);
  });

  function startIpmiPollSessionsReset(task) {
    $scope.loader.navigationReady = null;
    $scope.loader.javaReady = false;
    Server.addTaskFast($stateParams.productId, task, $scope.$id).then(
      (state) => {
        if (Polling.isResolve(state)) {
          $scope.disable.restartSession = false;
          $scope.disable.localTask = false;
          Alerter.alertFromSWS($translate.instant('server_configuration_impi_sessions_success'), true, $scope.alert);
        } else {
          startIpmiPollSessionsReset(task);
        }
      },
      (data) => {
        $scope.disable.restartSession = false;
        $scope.disable.localTask = false;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_restart_error_task_session'), data, $scope.alert);
      },
    );
  }

  $scope.hasSOL = () => featureAvailability.hasSerialOverLan();
});
