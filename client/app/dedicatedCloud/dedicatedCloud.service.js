angular
  .module('services')
  .service(
    'DedicatedCloud',
    class {
      /* @ngInject */
      constructor(
        $cacheFactory,
        $http,
        $q,
        $rootScope,

        constants,
        OvhApiDedicatedCloud,
        OvhHttp,
        Poll,
        Poller,
        Products,

        DEDICATED_CLOUD_CONSTANTS,
        VM_ENCRYPTION_KMS,
      ) {
        this.$cacheFactory = $cacheFactory;
        this.$http = $http;
        this.$q = $q;
        this.$rootScope = $rootScope;

        this.constants = constants;
        this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
        this.OvhHttp = OvhHttp;
        this.Poll = Poll;
        this.Poller = Poller;
        this.Products = Products;

        this.DEDICATED_CLOUD_CONSTANTS = DEDICATED_CLOUD_CONSTANTS;
        this.VM_ENCRYPTION_KMS = VM_ENCRYPTION_KMS;

        this.dedicatedCloudCache = {
          all: 'UNIVERS_DEDICATED_CLOUD',
          datacenters: $cacheFactory('UNIVERS_DEDICATED_CLOUD_DATACENTERS'),
          user: $cacheFactory('UNIVERS_DEDICATED_CLOUD_USER'),
          security: 'UNIVERS_DEDICATED_CLOUD_SECURITY',
          price: $cacheFactory('UNIVERS_DEDICATED_CLOUD_PRICE'),
          subdatacenters: $cacheFactory('UNIVERS_DEDICATED_CLOUD_SUB_DATACENTERS'),
          subdatacentershost: $cacheFactory('UNIVERS_DEDICATED_CLOUD_SUB_DATACENTERS_HOST'),
          subdatacentersfiler: $cacheFactory('UNIVERS_DEDICATED_CLOUD_SUB_DATACENTERS_FILER'),
          subdatacentersveeam: $cacheFactory('UNIVERS_DEDICATED_CLOUD_SUB_DATACENTERS_VEEAM'),
          subdatacenterslicences: $cacheFactory('UNIVERS_DEDICATED_CLOUD_SUB_DATACENTERS_LICENCES'),
        };

        this.availableOptions = _.flatten(['nsx', 'vrops', DEDICATED_CLOUD_CONSTANTS.securityOptions]);
      }

      /* ------- INFORMATIONS ------- */
      getSelected(
        serviceName,
        forceRefresh,
      ) {
        return this.OvhHttp
          .get('/sws/dedicatedCloud/{serviceName}',
            {
              rootPath: '2api',
              urlParams: { serviceName },
              cache: this.dedicatedCloudCache.all,
              clearAllCache: forceRefresh,
            });
      }


      getDescription(serviceName) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
            },
          );
      }

      updateDescription(
        serviceName,
        description,
      ) {
        return this.OvhHttp
          .put(
            '/dedicatedCloud/{serviceName}',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
              data: { description },
              broadcast: 'global_display_name_change',
              broadcastParam: {
                serviceName,
                displayName: description,
              },
              clearAllCache: this.dedicatedCloudCache.all,
            },
          );
      }

      getNewPrices(serviceName) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}/newPrices',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
              cache: 'UNIVERS_DEDICATED_CLOUD_NEW_PRICES',
            },
          );
      }

      /* ------- DATACENTER ------- */
      getDatacenters(serviceName) {
        return this.OvhHttp
          .get(
            '/sws/dedicatedCloud/{serviceName}/datacenters-summary',
            {
              rootPath: '2api',
              urlParams: { serviceName },
            },
          );
      }

      getDatacentersInformations(
        serviceName,
        elementsByPage,
        elementsToSkip,
      ) {
        return this.OvhHttp
          .get(
            '/sws/dedicatedCloud/{serviceName}/datacenters',
            {
              rootPath: '2api',
              urlParams: { serviceName },
              params: {
                count: elementsByPage,
                offset: elementsToSkip,
              },
            },
          );
      }

      getOrderableHostsProfiles(
        serviceName,
        location,
        datacenterId,
      ) {
        return this.OvhHttp
          .get(
            '/sws/dedicatedCloud/{serviceName}/hostprofiles/{location}/{datacenterId}',
            {
              rootPath: '2api',
              urlParams: {
                serviceName,
                location,
                datacenterId,
              },
            },
          );
      }

      getOrderableDatastoresProfiles(
        serviceName,
        location,
        datacenterId,
      ) {
        return this.OvhHttp
          .get(
            '/sws/dedicatedCloud/{serviceName}/datastoreprofiles/{location}/{datacenterId}',
            {
              rootPath: '2api',
              urlParams: {
                serviceName,
                location,
                datacenterId,
              },
            },
          );
      }

      getMonthlyHostOrder(
        serviceName,
        datacenterId,
        name,
        quantity,
      ) {
        return this.OvhHttp
          .get(
            '/order/dedicatedCloud/{serviceName}/host/{duration}',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                duration: '01',
              },
              params: {
                name,
                datacenterId,
                quantity,
              },
            },
          );
      }

      getMonthlyDatastoreOrder(
        serviceName,
        datacenterId,
        name,
        quantity,
      ) {
        return this.OvhHttp
          .get(
            '/order/dedicatedCloud/{serviceName}/filer/{duration}',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                duration: '01',
              },
              params: {
                name,
                datacenterId,
                quantity,
              },
            },
          );
      }

      orderHosts(
        serviceName,
        datacenterId,
        name,
        quantity,
      ) {
        return this.OvhHttp
          .post(
            '/order/dedicatedCloud/{serviceName}/host/{duration}',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                duration: '01',
              },
              data: {
                name,
                datacenterId,
                quantity,
              },
            },
          );
      }

      orderDatastores(
        serviceName,
        datacenterId,
        name,
        quantity,
      ) {
        return this.OvhHttp
          .post(
            '/order/dedicatedCloud/{serviceName}/filer/{duration}',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                duration: '01',
              },
              data: {
                datacenterId,
                name,
                quantity,
              },
            },
          );
      }

      getHostHourlyConsumption(
        serviceName,
        datacenterId,
        hostId,
      ) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/host/{hostId}/hourlyConsumption',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                datacenterId,
                hostId,
              },
            },
          );
      }

      getCommercialRangeList(serviceName) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}/commercialRange/orderable',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
            },
          );
      }

      addDatacenter(
        serviceName,
        commercialRangeName,
      ) {
        return this.OvhHttp
          .post(
            '/dedicatedCloud/{serviceName}/datacenter',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
              data: { commercialRangeName },
            },
          );
      }

      deleteDatacenter(
        serviceName,
        datacenterId,
      ) {
        return this.OvhHttp
          .delete(
            '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                datacenterId,
              },
            },
          );
      }

      /* eslint-disable class-methods-use-this */
      hasDiscount() { return false; }
      /* eslint-enable */

      /* ------- SUB DATACENTER ------- */
      getDatacenterInfoProxy(
        serviceName,
        datacenterId,
      ) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                datacenterId,
              },
            },
          );
      }

      getDatacenterInformations(
        serviceName,
        datacenterId,
        forceRefresh,
      ) {
        return this.OvhHttp
          .get(
            '/sws/dedicatedCloud/{serviceName}/datacenters/{datacenterId}',
            {
              rootPath: '2api',
              urlParams: {
                serviceName,
                datacenterId,
              },
              cache: 'SUB_DATACENTERS',
              clearCache: forceRefresh,
            },
          );
      }

      updateDatacenterName(
        serviceName,
        datacenterId,
        name,
      ) {
        return this.OvhHttp
          .put(
            '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                datacenterId,
              },
              data: { name },
            },
          );
      }

      updateDatacenterDescription(
        serviceName,
        datacenterId,
        description,
      ) {
        return this.OvhHttp
          .put(
            '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                datacenterId,
              },
              data: { description },
            },
          );
      }

      /* ------- SUB DATACENTER HOSTS -------*/
      getHosts(
        serviceName,
        datacenterId,
        elementsByPage,
        elementsToSkip,
        forceRefresh,
      ) {
        return this.OvhHttp
          .get(
            '/sws/dedicatedCloud/{serviceName}/datacenters/{datacenterId}/hosts',
            {
              rootPath: '2api',
              urlParams: {
                serviceName,
                datacenterId,
              },
              params: {
                count: elementsByPage,
                offset: elementsToSkip,
              },
              cache: 'SUB_DATACENTERS_HOST',
              clearCache: forceRefresh,
            },
          );
      }

      getHostsLexi(
        serviceName,
        datacenterId,
      ) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/host',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                datacenterId,
              },
            },
          );
      }

      getHost(
        serviceName,
        datacenterId,
        hostId,
      ) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/host/{hostId}',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                datacenterId,
                hostId,
              },
            },
          );
      }

      getHostPrice(
        commercialRange,
        commercialSubRange,
        location,
        billingType,
        hostProfile,
      ) {
        const hostHasNoPrice = billingType === 'freeSpare';

        if (hostHasNoPrice) { return this.$q.when({}); }

        return this.OvhHttp
          .get(
            '/price/dedicatedCloud/{commercialRange}/{location}/{commercialSubRange}/host/{billingType}/{hostProfile}',
            {
              rootPath: 'apiv6',
              urlParams: {
                commercialRange,
                location,
                commercialSubRange,
                billingType,
                hostProfile,
              },
              cache: 'UNIVERS_DEDICATED_DEDICATED_CLOUD_PRICE',
            },
          );
      }

      /* ------- SUB DATACENTER DATASTORES ------- */
      getDatastores(
        serviceName,
        datacenterId,
        elementsByPage,
        elementsToSkip,
        forceRefresh,
      ) {
        return this.OvhHttp
          .get(
            '/sws/dedicatedCloud/{serviceName}/datacenters/{datacenterId}/datastores',
            {
              rootPath: '2api',
              urlParams: {
                serviceName,
                datacenterId,
              },
              params: {
                count: elementsByPage,
                offset: elementsToSkip,
              },
              cache: 'SUB_DATACENTERS_FILER',
              clearCache: forceRefresh,
            },
          );
      }

      getDatastoreHourlyConsumption(
        serviceName,
        datacenterId,
        filerId,
      ) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/filer/{filerId}/hourlyConsumption',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                datacenterId,
                filerId,
              },
            },
          );
      }

      /* ------- SUB DATACENTER BACKUP ------- */
      getVeeam(
        serviceName,
        datacenterId,
        forceRefresh,
      ) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/backup',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                datacenterId,
              },
              clearCache: forceRefresh,
            },
          );
      }

      enableVeeam(
        serviceName,
        datacenterId,
      ) {
        return this.OvhHttp
          .post(
            '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/backup/enable',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                datacenterId,
              },
            },
          );
      }

      disableVeeam(
        serviceName,
        datacenterId,
      ) {
        return this.OvhHttp
          .post(
            '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/backup/disable',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                datacenterId,
              },
            },
          );
      }

      /* ------- SUB DATACENTER LICENCES ------- */

      getDatacenterLicence(serviceName) {
        if (this.constants.target === 'US') {
          return this.OvhHttp
            .get(
              '/dedicatedCloud/{serviceName}',
              {
                rootPath: 'apiv6',
                urlParams: { serviceName },
              },
            )
            .then(pcc => ({
              canOrderSpla: !pcc.spla,
              isSplaActive: pcc.spla,
            }));
        }

        return this.$q
          .all({
            pcc: this.OvhHttp
              .get(
                '/dedicatedCloud/{serviceName}',
                {
                  rootPath: 'apiv6',
                  urlParams: { serviceName },
                },
              ),
            order: this.OvhHttp
              .get(
                '/order/dedicatedCloud/{serviceName}',
                {
                  rootPath: 'apiv6',
                  urlParams: { serviceName },
                },
              ),
          })
          .then(data => ({
            canOrderSpla: data.order.indexOf('spla') !== -1,
            isSplaActive: data.pcc.spla,
          }))
          .catch(err => this.$q.reject({
            canOrderSpla: false,
            isSplaActive: false,
            messages: Array.isArray(err) ? err : [err],
            state: 'ERROR',
          }));
      }

      getSplaOrder(serviceName) {
        return this.OvhHttp
          .get(
            '/order/dedicatedCloud/{serviceName}/spla',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
            },
          );
      }

      postSplaOrder(serviceName) {
        return this.OvhHttp
          .post(
            '/order/dedicatedCloud/{serviceName}/spla',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
            },
          );
      }

      /* ------- USER ------- */
      getUsers(
        serviceName,
        name,
      ) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}/user',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
              params: { name },
            },
          );
      }

      getUserDetail(
        serviceName,
        userId,
      ) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}/user/{userId}',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                userId,
              },
            },
          );
      }

      addUser(
        serviceName,
        user,
      ) {
        return this.OvhHttp
          .post('/dedicatedCloud/{serviceName}/user',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
              data: {
                name: user.name,
                right: user.right,
                email: user.email,
                password: user.password,
              },
              broadcast: 'dedicatedCloud.users.refresh',
            });
      }

      resetUserPassword(
        serviceName,
        user,
        password,
      ) {
        return this.OvhHttp
          .post(
            '/dedicatedCloud/{serviceName}/user/{userId}/changePassword',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                userId: user.userId,
              },
              data: { password },
            },
          )
          .then((task) => {
            this.pollUserTasks(
              serviceName,
              {
                namespace: 'dedicatedCloud.password.update.poll',
                task,
                user,
                successSates: ['canceled',
                  'done'],
                errorsSates: ['error'],
              },
            );
          });
      }

      deleteUser(
        serviceName,
        userId,
      ) {
        return this.OvhHttp
          .delete(
            '/dedicatedCloud/{serviceName}/user/{userId}',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                userId,
              },
              broadcast: 'dedicatedCloud.users.refresh',
            },
          );
      }

      enableUser(
        serviceName,
        userId,
      ) {
        return this.OvhHttp
          .post(
            '/dedicatedCloud/{serviceName}/user/{userId}/enable',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                userId,
              },
              broadcast: 'dedicatedCloud.users.refresh',
            },
          )
          .then(task => this.Products
            .getSelectedProduct(serviceName)
            .then((selectedProduct) => {
              this.pollRequestState({
                serviceName: selectedProduct.name,
                task,
                namespace: 'enableUser',
              });
            }));
      }

      disableUser(
        serviceName,
        userId,
      ) {
        return this.OvhHttp
          .post(
            '/dedicatedCloud/{serviceName}/user/{userId}/disable',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                userId,
              },
              broadcast: 'dedicatedCloud.users.refresh',
            },
          )
          .then(task => this.Products
            .getSelectedProduct(serviceName)
            .then((selectedProduct) => {
              this.pollRequestState({
                serviceName: selectedProduct.name,
                task,
                namespace: 'disableUser',
              });
            }));
      }

      getUserRights(
        serviceName,
        userId,
        elementsByPage,
        elementsToSkip,
      ) {
        return this.OvhHttp
          .get(
            '/sws/dedicatedCloud/{serviceName}/users/{userId}/rights',
            {
              rootPath: '2api',
              urlParams: {
                serviceName,
                userId,
              },
              params: {
                count: elementsByPage,
                offset: elementsToSkip,
              },
            },
          );
      }

      setUserRights(
        serviceName,
        userId,
        right,
      ) {
        return this.OvhHttp
          .put(
            '/dedicatedCloud/{serviceName}/user/{userId}/right/{rightId}',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                userId,
                rightId: right.rightId,
              },
              data: {
                right: _.camelCase(right.right),
                canAddRessource: right.canAddRessource,
                vmNetworkRole: _.camelCase(right.vmNetworkRole),
                networkRole: _.camelCase(right.networkRole),
              },
              broadcast: 'dedicatedCloud.users.right.refresh',
            },
          );
      }

      getUserRight(
        serviceName,
        userId,
        rightId,
      ) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}/user/{userId}/right/{rightId}',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                userId,
                rightId,
              },
            },
          );
      }

      getPasswordPolicy(serviceName) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}/passwordPolicy',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
            },
          );
      }

      /* ------- SECURITY ------- */

      getSecurityInformations(serviceName) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
            },
          )
          .then(dedicatedCloud => ({
            userLimitConcurrentSession: dedicatedCloud.userLimitConcurrentSession,
            userSessionTimeout: dedicatedCloud.userSessionTimeout / 60,
            userAccessPolicy: _.snakeCase(dedicatedCloud.userAccessPolicy).toUpperCase(),
            logoutPolicy: _.snakeCase(dedicatedCloud.userLogoutPolicy).toUpperCase(),
          }));
      }

      getSecurityPolicies(
        serviceName,
        count,
        offset,
        clearCache,
      ) {
        return this.OvhHttp
          .get(
            '/sws/dedicatedCloud/{serviceName}/networks',
            {
              rootPath: '2api',
              urlParams: { serviceName },
              params: {
                count,
                offset,
              },
              clearCache,
            },
          );
      }


      addSecurityPolicy(
        serviceName,
        network,
      ) {
        if (!/\/[0-9]{3}$/.test(network.value)) {
          network.value += '/32'; // eslint-disable-line
        }

        return this.OvhHttp
          .post(
            '/dedicatedCloud/{serviceName}/allowedNetwork',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
              data: {
                description: network.description,
                network: network.value,
              },
              broadcast: 'dedicatedCloud.tabs.policy.refresh',
            },
          );
      }

      deleteSecurityPolicy(
        serviceName,
        entry,
      ) {
        return this.OvhHttp
          .delete(
            '/sws/dedicatedCloud/{serviceName}/networks-delete',
            {
              rootPath: '2api',
              urlParams: { serviceName },
              data: { networkAccessIds: entry },
              broadcast: 'dedicatedCloud.tabs.policy.refresh',
            },
          );
      }

      deleteSecurityPolicies(
        serviceName,
        networkAccessIds,
      ) {
        return this.OvhHttp
          .delete(
            '/sws/dedicatedCloud/{serviceName}/networks-delete',
            {
              rootPath: '2api',
              urlParams: { serviceName },
              data: { networkAccessIds },
              broadcast: 'dedicatedCloud.tabs.policy.refresh',
            },
          );
      }

      modifySecurityPolicy(
        serviceName,
        entry,
      ) {
        return this.OvhHttp
          .put(
            '/dedicatedCloud/{serviceName}/allowedNetwork/{networkAccessId}',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                networkAccessId: entry.id,
              },
              data: _.pick(
                entry,
                'description',
              ),
              broadcast: 'dedicatedCloud.tabs.policy.refresh',
            },
          );
      }

      updateSessionExpiration(
        serviceName,
        expiration,
      ) {
        return this.OvhHttp
          .put(
            '/dedicatedCloud/{serviceName}',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
              data: { userSessionTimeout: expiration * 60 },
              broadcast: 'dedicatedCloud.tabs.policy.info.refresh',
            },
          );
      }

      updateMaxConcurrentConnections(
        serviceName,
        userLimitConcurrentSession,
      ) {
        return this.OvhHttp
          .put(
            '/dedicatedCloud/{serviceName}',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
              data: { userLimitConcurrentSession },
              broadcast: 'dedicatedCloud.tabs.policy.info.refresh',
            },
          );
      }

      modifyPolicyAccess(
        serviceName,
        accessPolicy,
      ) {
        return this.OvhHttp
          .put(
            '/dedicatedCloud/{serviceName}',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
              data: { userAccessPolicy: _.camelCase(accessPolicy) },
              broadcast: 'dedicatedCloud.tabs.policy.info.refreshaccess',
            },
          );
      }

      modifyPolicyLogout(
        serviceName,
        logoutPolicy,
      ) {
        return this.OvhHttp
          .put(
            '/dedicatedCloud/{serviceName}',
            {
              rootPath: 'apiv6',
              urlParams: { serviceName },
              data: { userLogoutPolicy: _.camelCase(logoutPolicy) },
              broadcast: 'dedicatedCloud.tabs.policy.info.refreshaccess',
            },
          );
      }

      updateUser(
        serviceName,
        user,
      ) {
        return this.OvhHttp
          .post(
            '/dedicatedCloud/{serviceName}/user/{userId}/changeProperties',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                userId: user.userId,
              },
              data: {
                canManageIpFailOvers: user.canManageIpFailOvers,
                canManageNetwork: user.canManageNetwork,
                fullAdminRo: user.fullAdminRo,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                tokenValidator: user.tokenValidator,
                nsxRight: user.nsxRight,
              },
            },
          )
          .then((task) => {
            this.pollUserTasks(
              serviceName,
              {
                namespace: 'dedicatedCloud.user.update.poll',
                task,
                user,
                successSates: [
                  'canceled',
                  'done',
                ],
                errorsSates: ['error'],
              },
            );
          });
      }

      /* eslint-disable class-methods-use-this */
      checkPassword(
        policy,
        user,
      ) {
        if (!user.password) { return true; }

        if (user.password.length < policy.minLength || user.password.length > policy.maxLength) {
          return false;
        }

        if (policy.digitMandatory && !/[0-9]+/.test(user.password)) {
          return false;
        }

        if (policy.letterMandatory && !/[A-Za-z]+/.test(user.password)) {
          return false;
        }

        if (policy.lowercaseLetterMandatory && !/[a-z]+/.test(user.password)) {
          return false;
        }

        if (policy.upercaseLetterMandatory && !/[A-Z]+/.test(user.password)) {
          return false;
        }

        if (policy.deniedChars.length && ~policy.deniedChars.indexOf(user.password)) {
          return false;
        }

        if (policy.specialMandatory && !/\W_/.test(user.password)) {
          return false;
        }

        return true;
      }
      /* eslint-enable class-methods-use-this */

      hasSecurityOption(serviceName) {
        const promises = this.DEDICATED_CLOUD_CONSTANTS.securityOptions
          .map(optionName => this.getOptionState(
            optionName,
            serviceName,
          ));

        return this.$q
          .all(promises)
          .then(results => results
            .some(optionInfo => optionInfo !== 'disabled'));
      }

      /* --- Virtual Machine Encryption KMS --- */
      getVMEncryptionKMSList(serviceName) {
        return this.OvhApiDedicatedCloud
          .VMEncryption().kms().v6()
          .query({ serviceName }).$promise
          .then(kmsIds => kmsIds);
      }

      getVMEncryptionKMSDetail(
        serviceName,
        kmsId,
      ) {
        return this.OvhApiDedicatedCloud
          .VMEncryption().kms().v6()
          .get({
            serviceName,
            kmsId,
          }).$promise
          .then(kms => kms);
      }

      createVMEncryptionKMS(
        serviceName,
        {
          ip,
          description,
          sslThumbprint,
        },
      ) {
        return this.OvhApiDedicatedCloud
          .VMEncryption().kms().v6()
          .create(
            { serviceName },
            {
              ip,
              description,
              sslThumbprint,
            },
          ).$promise;
      }

      deleteVMEncryptionKMS(
        serviceName,
        kmsId,
      ) {
        return this.OvhApiDedicatedCloud
          .VMEncryption().kms().v6()
          .delete(
            { serviceName },
            { kmsId },
          ).$promise;
      }

      editVMEncryptionKMS(
        serviceName,
        {
          kmsId,
          description,
          sslThumbprint,
        },
      ) {
        return this.OvhApiDedicatedCloud
          .VMEncryption().kms().v6()
          .changeProperties(
            {
              serviceName,
              kmsId,
            },
            {
              description,
              sslThumbprint,
            },
          ).$promise;
      }

      startVMEncryptionKMSPoller(
        serviceName,
        taskId,
      ) {
        const url = `/dedicatedCloud/${serviceName}/task/${taskId}`;
        const interval = this.VM_ENCRYPTION_KMS.pollingDelay;

        return this.Poller
          .poll(
            url,
            null,
            {
              method: 'get',
              namespace: taskId,
              interval,
              successRule: taskResult => taskResult.state !== 'error',
              errorRule: taskResult => taskResult.state === 'error',
            },
          );
      }

      stopVMEncryptionPoller(taskId) { return this.Poller.kill({ namespace: taskId }); }

      /* ------- Resource -------*/

      getUpgradeResourceDurations(
        serviceName,
        upgradeType,
        upgradedResourceType,
        upgradedResourceId,
      ) {
        const params = { upgradeType };

        if (upgradedResourceType) {
          params.upgradedRessourceType = upgradedResourceType;
          params.upgradedRessourceId = upgradedResourceId;
        } else { params.upgradedRessourceType = 'all'; }

        return this.OvhHttp.get(
          '/order/dedicatedCloud/{serviceName}/upgradeRessource',
          {
            rootPath: 'apiv6',
            urlParams: { serviceName },
            params,
          },
        );
      }

      getUpgradeResourceOrder(
        serviceName,
        upgradeType,
        duration,
        upgradedResourceType,
        upgradedResourceId,
      ) {
        const params = { upgradeType };

        if (upgradedResourceType) {
          params.upgradedRessourceType = upgradedResourceType;
          params.upgradedRessourceId = upgradedResourceId;
        } else { params.upgradedRessourceType = 'all'; }

        return this.OvhHttp.get(
          '/order/dedicatedCloud/{serviceName}/upgradeRessource/{duration}',
          {
            rootPath: 'apiv6',
            urlParams: {
              serviceName,
              duration,
            },
            params,
          },
        );
      }

      upgradedResource(
        serviceName,
        upgradeType,
        duration,
        upgradedResourceType,
        upgradedResourceId,
      ) {
        const params = { upgradeType };

        if (upgradedResourceType) {
          params.upgradedRessourceType = upgradedResourceType;
          params.upgradedRessourceId = upgradedResourceId;
        } else { params.upgradedRessourceType = 'all'; }

        return this.OvhHttp.post(
          '/order/dedicatedCloud/{serviceName}/upgradeRessource/{duration}',
          {
            rootPath: 'apiv6',
            urlParams: {
              serviceName,
              duration,
            },
            data: params,
          },
        );
      }

      /* ------- Upgrade ------- */
      upgrade(serviceName) {
        return this.OvhHttp.post(
          '/dedicatedCloud/{serviceName}/upgradeHypervisor',
          {
            rootPath: 'apiv6',
            urlParams: { serviceName },
          },
        );
      }

      isOptionToggable(
        serviceName,
        optionName,
        state,
        _returnAsBoolean,
      ) {
        let returnAsBoolean = _returnAsBoolean;

        if (_.isUndefined(returnAsBoolean)) { returnAsBoolean = true; }

        if (!_.includes(
          this.availableOptions,
          optionName,
        )) { throw new Error('Valid optionName are nsx, vrops, hds, hipaa and pcidss'); }

        if (_.includes(
          [
            'disabling',
            'enabling',
          ],
          state,
        )) {
          // while enabling/disabling activation button not show,
          // no need for a message (the tooltip)
          return { toggable: false };
        }

        const endpoint = `canBe${state === 'enabled' ? 'Disabled' : 'Enabled'}`;

        return this.OvhHttp.get(
          '/dedicatedCloud/{serviceName}/{optionName}/{endpoint}',
          {
            urlParams: {
              serviceName,
              optionName,
              endpoint,
            },
            rootPath: 'apiv6',
            returnErrorKey: '',
          },
        )
          .then((response) => {
            // API return a funny response, assume it is true if the response was a 200
            if (returnAsBoolean === true) { return { toggable: true }; }

            return response;
          })
          .catch(err => ({
            toggable: false,
            error: err,
          }));
      }

      getOptionState(
        optionName,
        serviceName,
      ) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}/{optionName}',
            {
              urlParams: {
                serviceName,
                optionName,
              },
              rootPath: 'apiv6',
            },
          )
          .then(response => response.state);
      }

      enableOption(
        serviceName,
        optionName,
      ) {
        return this.OvhHttp.post(
          '/dedicatedCloud/{serviceName}/{optionName}/enable',
          {
            rootPath: 'apiv6',
            urlParams: {
              serviceName,
              optionName,
            },
          },
        );
      }

      disableOption(
        serviceName,
        optionName,
      ) {
        return this.OvhHttp.post(
          '/dedicatedCloud/{serviceName}/{optionName}/disable',
          {
            rootPath: 'apiv6',
            urlParams: {
              serviceName,
              optionName,
            },
          },
        );
      }

      fetchAllHostsPrices(
        serviceName,
        currentCommercialRangeName,
        newCommercialRange,
        location,
      ) {
        return this.fetchHosts(serviceName)
          .then((hosts) => {
            const currentHosts = angular.copy(hosts);
            const nextHosts = angular.copy(hosts);

            return this.$q.all({
              current: this.$q.all(currentHosts.map(host => this.fillHostPrice(
                currentCommercialRangeName,
                host.commercialSubRange,
                location,
                host,
              ))),
              next: this.$q.all(nextHosts.map(host => this.fillHostPrice(
                newCommercialRange,
                host.commercialSubRange,
                location,
                host,
              ))),
            });
          });
      }

      fetchHosts(serviceName) {
        return this.getDatacenters(serviceName)
          .then((dataCenters) => {
            if (dataCenters.results && dataCenters.results.length > 0) {
              return this.$q.all(dataCenters.results.map(dataCenter => this
                .getHostsLexi(
                  serviceName,
                  dataCenter.id,
                )
                .then(hostIds => this.$q.all(hostIds.map(hostId => this.getHost(
                  serviceName,
                  dataCenter.id,
                  hostId,
                ))))
                .then(hosts => hosts.map(host => _.assign(
                  host,
                  {
                    datacenter: dataCenter.name,
                    commercialSubRange: dataCenter.commercialRangeName.substr(6).toLowerCase(),
                  },
                )))))
                .then(dataCentersHosts => _.flatten(dataCentersHosts));
            }

            return [];
          });
      }

      fillHostPrice(
        commercialRange,
        commercialSubRange,
        location,
        host,
      ) {
        return this
          .getHostPrice(
            commercialRange,
            commercialSubRange,
            location,
            host.billingType,
            host.profile,
          )
          .then(price => _.assign(
            host,
            { price: price.text },
          ));
      }


      /* ------- Poll request ------- */
      pollRequestState(opts) {
        const taskId = opts.task.taskId || opts.task;

        if (!taskId) {
          return this.$rootScope.$broadcast(
            'dedicatedCloud.error',
            '',
          );
        }

        this.$rootScope.$broadcast(
          [
            'dedicatedCloud',
            opts.namespace,
            'start',
          ].join('.'),
          opts,
        );

        return this.Poll
          .poll(
            [
              'apiv6/dedicatedCloud',
              opts.serviceName,
              'task',
              taskId,
            ].join('/'),
            null,
            {
              successRule: { state: 'done' },
              namespace: 'dedicatedCloud.request',
            },
          )
          .then((task) => {
            this.$rootScope.$broadcast(
              [
                'dedicatedCloud',
                opts.namespace,
                'done',
              ].join('.'),
              task,
            );
          })
          .catch((err) => {
            this.$rootScope.$broadcast(
              [
                'dedicatedCloud',
                opts.namespace,
                'error',
              ].join('.'),
              err,
            );
          });
      }

      killAllPolling() {
        angular.forEach(
          [
            'enableUser',
            'disableUser',
          ],
          (action) => { this.Poll.kill({ namespace: `dedicatedCloud.${action}` }); },
        );
      }

      /* ------- Terminate -------*//*

      /**
       *  DEPRECATED : use OvhApiDedicatedCloudV6.terminate from ovh-api-services instead.
       */
      terminate(serviceName) {
        return this.OvhHttp.post(
          '/dedicatedCloud/{serviceName}/terminate',
          {
            rootPath: 'apiv6',
            urlParams: { serviceName },
          },
        );
      }

      /**
       *  DEPRECATED : use OvhApiDedicatedCloudV6.confirmTermination from ovh-api-services instead.
       */
      confirmTerminate(
        serviceName,
        reason,
        token,
        commentary,
      ) {
        return this.OvhHttp.post(
          '/dedicatedCloud/{serviceName}/confirmTermination',
          {
            rootPath: 'apiv6',
            urlParams: { serviceName },
            data: {
              reason,
              token,
              commentary,
            },
          },
        );
      }

      /* ------- Operations ------- */
      getOperations(
        serviceName,
        opts,
      ) {
        return this.OvhHttp.get(
          '/dedicatedCloud/{serviceName}/task',
          {
            rootPath: 'apiv6',
            urlParams: { serviceName },
            params: opts.params,
          },
        );
      }

      getOperation(
        serviceName,
        opts,
      ) {
        return this.OvhHttp.get(
          '/dedicatedCloud/{serviceName}/task/{taskId}',
          {
            rootPath: 'apiv6',
            urlParams: {
              serviceName,
              taskId: opts.taskId,
            },
          },
        );
      }

      getOperationDescription(
        serviceName,
        opts,
      ) {
        return this.OvhHttp
          .get(
            '/dedicatedCloud/{serviceName}/robot/{name}',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName,
                name: opts.name,
              },
              cache: 'UNIVERS_DEDICATED_DEDICATED_CLOUD_OPERATIONS',
              clearCache: opts.forceRefresh,
              returnErrorKey: '',
            },
          ).catch((err) => {
            if (err.status === 404) {
              return { description: '' };
            }
            return this.$q.reject(err);
          });
      }

      updateOperation(
        serviceName,
        opts,
      ) {
        return this.OvhHttp.post(
          '/dedicatedCloud/{serviceName}/task/{taskId}/changeMaintenanceExecutionDate',
          {
            rootPath: 'apiv6',
            urlParams: {
              serviceName,
              taskId: opts.taskId,
            },
            data: opts.data,
          },
        );
      }

      getUserOperations(
        serviceName,
        opts,
      ) {
        return this.OvhHttp.get(
          '/dedicatedCloud/{serviceName}/user/{userId}/task',
          {
            rootPath: 'apiv6',
            urlParams: {
              serviceName,
              userId: opts.userId,
            },
            params: opts.params,
          },
        );
      }

      getUserOperationsDetail(
        serviceName,
        opts,
      ) {
        return this
          .getUserOperations(
            serviceName,
            opts,
          )
          .then((tasks) => {
            const taskPromises = tasks.map(task => this.OvhHttp.get(
              '/dedicatedCloud/{serviceName}/user/{userId}/task/{taskId}',
              {
                rootPath: 'apiv6',
                urlParams: {
                  serviceName,
                  userId: opts.userId,
                  taskId: task,
                },
              },
            ));

            return this.$q.all(taskPromises);
          });
      }

      getFirstUserOperationDetail(
        serviceName,
        opts,
      ) {
        return this
          .getUserOperations(
            serviceName,
            opts,
          )
          .then((tasks) => {
            if (!tasks.length) { return null; }

            return this.OvhHttp.get(
              [
                '/dedicatedCloud',
                serviceName,
                'user',
                opts.userId,
                'task',
                tasks[0],
              ].join('/'),
              { rootPath: 'apiv6' },
            );
          });
      }

      getModels() {
        return this.OvhHttp.get(
          '/dedicatedCloud.json',
          {
            rootPath: 'apiv6',
            cache: 'UNIVERS_DEDICATED_DEDICATED_CLOUD_OPERATION_MODELS',
          },
        );
      }

      getDedicatedCloudTasksPromise(
        dedicatedCloud,
        taskState,
      ) {
        return this.OvhHttp.get(
          '/dedicatedCloud/{serviceName}/task',
          {
            rootPath: 'apiv6',
            urlParams: { serviceName: dedicatedCloud.name },
            params: { state: taskState },
          },
        );
      }

      getDedicatedCloudTaskPromise(
        dedicatedCloud,
        taskId,
      ) {
        return this.OvhHttp.get(
          '/dedicatedCloud/{serviceName}/task/{taskId}',
          {
            rootPath: 'apiv6',
            urlParams: {
              serviceName: dedicatedCloud.name,
              taskId,
            },
          },
        );
      }

      pollUserTasks(
        serviceName,
        opts,
      ) {
        if (!opts.user || !opts.task) {
          return this.$rootScope.$broadcast(
            `${opts.namespace}.error`,
            '',
          );
        }

        if (!Array.isArray(opts.successSates)) {
          _.set(
            opts,
            'successSates',
            [opts.successSates],
          );
        }

        const url = [
          'apiv6/dedicatedCloud',
          serviceName,
          'user',
          opts.user.userId,
          'task',
          opts.task.taskId,
        ].join('/');

        this.$rootScope.$broadcast(
          `${opts.namespace}.start`,
          opts.task,
          opts.user,
        );

        return this.Poller
          .poll(
            url,
            null,
            {
              namespace: opts.namespace,
              interval: 5000,
              successRule: {
                state(task) { return opts.successSates.indexOf(task.state) !== -1; },
              },
              errorRule: {
                state(task) { return opts.errorsSates.indexOf(task.state) !== -1; },
              },
            },
          )
          .then((
            pollObject,
            task,
          ) => {
            this.$rootScope.$broadcast(
              `${opts.namespace}.done`,
              pollObject,
              task,
              opts.user,
            );
          })
          .catch((err) => {
            this.$rootScope.$broadcast(
              `${opts.namespace}.error`,
              err,
              opts.user,
            );
          })
          .finally((task) => {
            this.$rootScope.$broadcast(
              `${opts.namespace}.doing`,
              task,
              opts.user,
            );
          });
      }

      stopAllPolling(opts) { this.Poller.kill({ namespace: opts.namespace }); }
    },
  );
