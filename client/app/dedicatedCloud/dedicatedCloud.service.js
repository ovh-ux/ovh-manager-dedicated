angular
    .module("services")
    .constant("VEEAM_STATE_ENUM", {
        ENABLED: "enabled",
        DISABLED: "disabled",
        DISABLING: "DISABLING",
        ENABLING: "ENABLING",
        ERROR: "ERROR",
        REMOVING: "REMOVING"
    })
    .constant("COMMERCIAL_RANGE_ENUM", {
        "2014v1Infrastructure": "2014 Infrastructure",
        "2014v1Enterprise": "2014 Enterprise",
        "2013v1": "2013"
    })
    .service("DedicatedCloud", function (Products, $http, $q, constants, $cacheFactory, $rootScope, Poll, Poller, OvhHttp, DEDICATED_CLOUD_CONSTANTS) {
        "use strict";

        const self = this;
        const dedicatedCloudCache = {
            all: "UNIVERS_DEDICATED_CLOUD",
            datacenters: $cacheFactory("UNIVERS_DEDICATED_CLOUD_DATACENTERS"),
            user: $cacheFactory("UNIVERS_DEDICATED_CLOUD_USER"),
            security: "UNIVERS_DEDICATED_CLOUD_SECURITY",
            price: $cacheFactory("UNIVERS_DEDICATED_CLOUD_PRICE"),
            subdatacenters: $cacheFactory("UNIVERS_DEDICATED_CLOUD_SUB_DATACENTERS"),
            subdatacentershost: $cacheFactory("UNIVERS_DEDICATED_CLOUD_SUB_DATACENTERS_HOST"),
            subdatacentersfiler: $cacheFactory("UNIVERS_DEDICATED_CLOUD_SUB_DATACENTERS_FILER"),
            subdatacentersveeam: $cacheFactory("UNIVERS_DEDICATED_CLOUD_SUB_DATACENTERS_VEEAM"),
            subdatacenterslicences: $cacheFactory("UNIVERS_DEDICATED_CLOUD_SUB_DATACENTERS_LICENCES")
        };
        const availableOptions = _.flatten(["nsx", "vrops", DEDICATED_CLOUD_CONSTANTS.securityOptions]);

        /* ------- INFORMATIONS -------*/

        this.getSelected = function (serviceName, forceRefresh) {
            return OvhHttp.get("/sws/dedicatedCloud/{serviceName}", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                },
                cache: dedicatedCloudCache.all,
                clearAllCache: forceRefresh
            });
        };

        this.getDescription = function (serviceName) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                }
            });
        };

        this.updateDescription = function (serviceName, description) {
            return OvhHttp.put("/dedicatedCloud/{serviceName}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data: {
                    description
                },
                broadcast: "global_display_name_change",
                broadcastParam: {
                    serviceName,
                    displayName: description
                },
                clearAllCache: dedicatedCloudCache.all
            });
        };

        this.getNewPrices = function (serviceName) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/newPrices", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                cache: "UNIVERS_DEDICATED_CLOUD_NEW_PRICES"
            });
        };

        /* ------- DATACENTER -------*/

        this.getDatacenters = function (serviceName) {
            return OvhHttp.get("/sws/dedicatedCloud/{serviceName}/datacenters-summary", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                }
            });
        };

        this.getDatacentersInformations = function (serviceName, elementsByPage, elementsToSkip) {
            return OvhHttp.get("/sws/dedicatedCloud/{serviceName}/datacenters", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                },
                params: {
                    count: elementsByPage,
                    offset: elementsToSkip
                }
            });
        };

        this.getOrderableHostsProfiles = function (serviceName, location, datacenterId) {
            return OvhHttp.get("/sws/dedicatedCloud/{serviceName}/hostprofiles/{location}/{datacenterId}", {
                rootPath: "2api",
                urlParams: {
                    serviceName,
                    location,
                    datacenterId
                }
            });
        };

        this.getOrderableDatastoresProfiles = function (serviceName, location, datacenterId) {
            return OvhHttp.get("/sws/dedicatedCloud/{serviceName}/datastoreprofiles/{location}/{datacenterId}", {
                rootPath: "2api",
                urlParams: {
                    serviceName,
                    location,
                    datacenterId
                }
            });
        };

        this.getMonthlyHostOrder = function (serviceName, datacenterId, name, quantity) {
            return OvhHttp.get("/order/dedicatedCloud/{serviceName}/host/{duration}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    duration: "01"
                },
                params: {
                    name,
                    datacenterId,
                    quantity
                }
            });
        };

        this.getMonthlyDatastoreOrder = function (serviceName, datacenterId, name, quantity) {
            return OvhHttp.get("/order/dedicatedCloud/{serviceName}/filer/{duration}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    duration: "01"
                },
                params: {
                    name,
                    datacenterId,
                    quantity
                }
            });
        };

        this.orderHosts = function (serviceName, datacenterId, name, quantity) {
            return OvhHttp.post("/order/dedicatedCloud/{serviceName}/host/{duration}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    duration: "01"
                },
                data: {
                    name,
                    datacenterId,
                    quantity
                }
            });
        };

        this.orderDatastores = function (serviceName, datacenterId, name, quantity) {
            return OvhHttp.post("/order/dedicatedCloud/{serviceName}/filer/{duration}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    duration: "01"
                },
                data: {
                    datacenterId,
                    name,
                    quantity
                }
            });
        };

        this.getHostHourlyConsumption = function (serviceName, datacenterId, hostId) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/host/{hostId}/hourlyConsumption", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    datacenterId,
                    hostId
                }
            });
        };

        this.getCommercialRangeList = function (serviceName) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/commercialRange/orderable", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                }
            });
        };

        this.addDatacenter = function (serviceName, commercialRangeName) {
            return OvhHttp.post("/dedicatedCloud/{serviceName}/datacenter", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data: {
                    commercialRangeName
                }
            });
        };

        this.deleteDatacenter = function (serviceName, datacenterId) {
            return OvhHttp.delete("/dedicatedCloud/{serviceName}/datacenter/{datacenterId}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    datacenterId
                }
            });
        };

        this.hasDiscount = function (/* datacenter*/) {
            // return datacenter.commercialRange === "2014v2Enterprise" || datacenter.commercialRangeName === "2014v2Enterprise";
            return false; // Use this to remove the discount quickly.
        };

        /* ------- SUB DATACENTER -------*/

        this.getDatacenterInfoProxy = function (serviceName, datacenterId) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/datacenter/{datacenterId}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    datacenterId
                }
            });
        };

        this.getDatacenterInformations = function (serviceName, datacenterId, forceRefresh) {
            return OvhHttp.get("/sws/dedicatedCloud/{serviceName}/datacenters/{datacenterId}", {
                rootPath: "2api",
                urlParams: {
                    serviceName,
                    datacenterId
                },
                cache: "SUB_DATACENTERS",
                clearCache: forceRefresh
            });
        };

        this.updateDatacenterName = function (serviceName, datacenterId, name) {
            return OvhHttp.put("/dedicatedCloud/{serviceName}/datacenter/{datacenterId}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    datacenterId
                },
                data: {
                    name
                }
            });
        };

        this.updateDatacenterDescription = function (serviceName, datacenterId, description) {
            return OvhHttp.put("/dedicatedCloud/{serviceName}/datacenter/{datacenterId}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    datacenterId
                },
                data: {
                    description
                }
            });
        };

        /* ------- SUB DATACENTER HOSTS -------*/

        this.getHosts = function (serviceName, datacenterId, elementsByPage, elementsToSkip, forceRefresh) {
            return OvhHttp.get("/sws/dedicatedCloud/{serviceName}/datacenters/{datacenterId}/hosts", {
                rootPath: "2api",
                urlParams: {
                    serviceName,
                    datacenterId
                },
                params: {
                    count: elementsByPage,
                    offset: elementsToSkip
                },
                cache: "SUB_DATACENTERS_HOST",
                clearCache: forceRefresh
            });
        };

        this.getHostsLexi = function (serviceName, datacenterId) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/host", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    datacenterId
                }
            });
        };

        this.getHost = function (serviceName, datacenterId, hostId) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/host/{hostId}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    datacenterId,
                    hostId
                }
            });
        };

        this.getHostPrice = function (commercialRange, commercialSubRange, location, billingType, hostProfile) {
            if (self.hostHasNoPrice(billingType)) {
                return $q.when({});
            }
            return OvhHttp.get("/price/dedicatedCloud/{commercialRange}/{location}/{commercialSubRange}/host/{billingType}/{hostProfile}", {
                rootPath: "apiv6",
                urlParams: {
                    commercialRange,
                    location,
                    commercialSubRange,
                    billingType,
                    hostProfile
                },
                cache: "UNIVERS_DEDICATED_DEDICATED_CLOUD_PRICE"
            });
        };

        this.hostHasNoPrice = function (billingType) {
            return billingType === "freeSpare";
        };

        /* ------- SUB DATACENTER DATASTORES -------*/

        this.getDatastores = function (serviceName, datacenterId, elementsByPage, elementsToSkip, forceRefresh) {
            return OvhHttp.get("/sws/dedicatedCloud/{serviceName}/datacenters/{datacenterId}/datastores", {
                rootPath: "2api",
                urlParams: {
                    serviceName,
                    datacenterId
                },
                params: {
                    count: elementsByPage,
                    offset: elementsToSkip
                },
                cache: "SUB_DATACENTERS_FILER",
                clearCache: forceRefresh
            });
        };

        this.getDatastoreHourlyConsumption = function (serviceName, datacenterId, filerId) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/filer/{filerId}/hourlyConsumption", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    datacenterId,
                    filerId
                }
            });
        };

        /* ------- SUB DATACENTER BACKUP -------*/

        this.getVeeam = function (serviceName, datacenterId, forceRefresh) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/backup", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    datacenterId
                },
                clearCache: forceRefresh
            });
        };

        this.enableVeeam = function (serviceName, datacenterId) {
            return OvhHttp.post("/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/backup/enable", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    datacenterId
                },
                broadcast: "datacenter.veeam.reload"
            });
        };

        this.disableVeeam = function (serviceName, datacenterId) {
            return OvhHttp.post("/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/backup/disable", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    datacenterId
                },
                broadcast: "datacenter.veeam.reload"
            });
        };

        /* ------- SUB DATACENTER LICENCES -------*/

        this.getDatacenterLicence = function (serviceName) {
            if (constants.target === "US") {
                return OvhHttp.get("/dedicatedCloud/{serviceName}", {
                    rootPath: "apiv6",
                    urlParams: {
                        serviceName
                    }
                }).then((pcc) => ({
                    canOrderSpla: !pcc.spla,
                    isSplaActive: pcc.spla
                }));
            }
            return $q
                .all({
                    pcc: OvhHttp.get("/dedicatedCloud/{serviceName}", {
                        rootPath: "apiv6",
                        urlParams: {
                            serviceName
                        }
                    }),
                    order: OvhHttp.get("/order/dedicatedCloud/{serviceName}", {
                        rootPath: "apiv6",
                        urlParams: {
                            serviceName
                        }
                    })
                })
                .then((data) => ({
                    canOrderSpla: data.order.indexOf("spla") !== -1,
                    isSplaActive: data.pcc.spla
                }))
                .catch((err) =>
                    $q.reject({
                        canOrderSpla: false,
                        isSplaActive: false,
                        messages: Array.isArray(err) ? err : [err],
                        state: "ERROR"
                    })
                );
        };

        this.getSplaOrder = function (serviceName) {
            return OvhHttp.get("/order/dedicatedCloud/{serviceName}/spla", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                }
            });
        };

        this.postSplaOrder = function (serviceName) {
            return OvhHttp.post("/order/dedicatedCloud/{serviceName}/spla", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                }
            });
        };

        /* ------- USER -------*/

        this.getUsers = function (serviceName, name) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/user", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                params: {
                    name
                }
            });
        };

        this.getUserDetail = function (serviceName, userId) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/user/{userId}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    userId
                }
            });
        };

        this.addUser = function (serviceName, user) {
            return OvhHttp.post("/dedicatedCloud/{serviceName}/user", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data: {
                    name: user.name,
                    right: user.right,
                    email: user.email,
                    password: user.password
                },
                broadcast: "dedicatedCloud.users.refresh"
            });
        };

        this.resetUserPassword = function (serviceName, user, password) {
            return OvhHttp.post("/dedicatedCloud/{serviceName}/user/{userId}/changePassword", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    userId: user.userId
                },
                data: {
                    password
                }
            }).then((task) => {
                self.pollUserTasks(serviceName, {
                    namespace: "dedicatedCloud.password.update.poll",
                    task,
                    user,
                    successSates: ["canceled", "done"],
                    errorsSates: ["error"]
                });
            });
        };

        this.deleteUser = function (serviceName, userId) {
            return OvhHttp.delete("/dedicatedCloud/{serviceName}/user/{userId}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    userId
                },
                broadcast: "dedicatedCloud.users.refresh"
            });
        };

        this.enableUser = function (serviceName, userId) {
            return OvhHttp.post("/dedicatedCloud/{serviceName}/user/{userId}/enable", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    userId
                },
                broadcast: "dedicatedCloud.users.refresh"
            }).then((task) => {
                Products.getSelectedProduct(serviceName).then((selectedProduct) => {
                    self.pollRequestState({ serviceName: selectedProduct.name, task, namespace: "enableUser" });
                });
            });
        };

        this.disableUser = function (serviceName, userId) {
            return OvhHttp.post("/dedicatedCloud/{serviceName}/user/{userId}/disable", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    userId
                },
                broadcast: "dedicatedCloud.users.refresh"
            }).then((task) => {
                Products.getSelectedProduct(serviceName).then((selectedProduct) => {
                    self.pollRequestState({ serviceName: selectedProduct.name, task, namespace: "disableUser" });
                });
            });
        };

        this.getUserRights = function (serviceName, userId, elementsByPage, elementsToSkip) {
            return OvhHttp.get("/sws/dedicatedCloud/{serviceName}/users/{userId}/rights", {
                rootPath: "2api",
                urlParams: {
                    serviceName,
                    userId
                },
                params: {
                    count: elementsByPage,
                    offset: elementsToSkip
                }
            });
        };

        this.setUserRights = function (serviceName, userId, right) {
            return OvhHttp.put("/dedicatedCloud/{serviceName}/user/{userId}/right/{rightId}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    userId,
                    rightId: right.rightId
                },
                data: {
                    right: _.camelCase(right.right),
                    canAddRessource: right.canAddRessource,
                    vmNetworkRole: _.camelCase(right.vmNetworkRole),
                    networkRole: _.camelCase(right.networkRole)
                },
                broadcast: "dedicatedCloud.users.right.refresh"
            });
        };

        this.getUserRight = function (serviceName, userId, rightId) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/user/{userId}/right/{rightId}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    userId,
                    rightId
                }
            });
        };

        this.getPasswordPolicy = function (serviceName) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/passwordPolicy", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                }
            });
        };

        /* ------- SECURITY -------*/

        this.getSecurityInformations = function (serviceName) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                }
            }).then((dedicatedCloud) => ({
                userLimitConcurrentSession: dedicatedCloud.userLimitConcurrentSession,
                userSessionTimeout: dedicatedCloud.userSessionTimeout / 60,
                userAccessPolicy: _.snakeCase(dedicatedCloud.userAccessPolicy).toUpperCase(),
                logoutPolicy: _.snakeCase(dedicatedCloud.userLogoutPolicy).toUpperCase()
            }));
        };

        this.getSecurityPolicies = function (serviceName, count, offset, clearCache) {
            return OvhHttp.get("/sws/dedicatedCloud/{serviceName}/networks", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                },
                params: {
                    count,
                    offset
                },
                clearCache
            });
        };

        this.addSecurityPolicy = function (serviceName, network) {
            if (!/\/[0-9]{3}$/.test(network.value)) {
                network.value += "/32";
            }
            return OvhHttp.post("/dedicatedCloud/{serviceName}/allowedNetwork", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data: {
                    description: network.description,
                    network: network.value
                },
                broadcast: "dedicatedCloud.tabs.policy.refresh"
            });
        };

        this.deleteSecurityPolicy = function (serviceName, entry) {
            return OvhHttp.delete("/sws/dedicatedCloud/{serviceName}/networks-delete", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                },
                data: {
                    networkAccessIds: entry
                },
                broadcast: "dedicatedCloud.tabs.policy.refresh"
            });
        };

        this.deleteSecurityPolicies = function (serviceName, networkAccessIds) {
            return OvhHttp.delete("/sws/dedicatedCloud/{serviceName}/networks-delete", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                },
                data: {
                    networkAccessIds
                },
                broadcast: "dedicatedCloud.tabs.policy.refresh"
            });
        };

        this.modifySecurityPolicy = function (serviceName, entry) {
            return OvhHttp.put("/dedicatedCloud/{serviceName}/allowedNetwork/{networkAccessId}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    networkAccessId: entry.id
                },
                data: _.pick(entry, "description"),
                broadcast: "dedicatedCloud.tabs.policy.refresh"
            });
        };

        this.updateSessionExpiration = function (serviceName, expiration) {
            return OvhHttp.put("/dedicatedCloud/{serviceName}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data: {
                    userSessionTimeout: expiration * 60
                },
                broadcast: "dedicatedCloud.tabs.policy.info.refresh"
            });
        };

        this.updateMaxConcurrentConnections = function (serviceName, userLimitConcurrentSession) {
            return OvhHttp.put("/dedicatedCloud/{serviceName}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data: {
                    userLimitConcurrentSession
                },
                broadcast: "dedicatedCloud.tabs.policy.info.refresh"
            });
        };

        this.modifyPolicyAccess = function (serviceName, accessPolicy) {
            return OvhHttp.put("/dedicatedCloud/{serviceName}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data: {
                    userAccessPolicy: _.camelCase(accessPolicy)
                },
                broadcast: "dedicatedCloud.tabs.policy.info.refreshaccess"
            });
        };

        this.modifyPolicyLogout = function (serviceName, logoutPolicy) {
            return OvhHttp.put("/dedicatedCloud/{serviceName}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data: {
                    userLogoutPolicy: _.camelCase(logoutPolicy)
                },
                broadcast: "dedicatedCloud.tabs.policy.info.refreshaccess"
            });
        };

        this.updateUser = function (serviceName, user) {
            return OvhHttp.post("/dedicatedCloud/{serviceName}/user/{userId}/changeProperties", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    userId: user.userId
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
                    nsxRight: user.nsxRight
                }
            }).then((task) => {
                self.pollUserTasks(serviceName, {
                    namespace: "dedicatedCloud.user.update.poll",
                    task,
                    user,
                    successSates: ["canceled", "done"],
                    errorsSates: ["error"]
                });
            });
        };

        this.checkPassword = function (policy, user) {
            if (!user.password) {
                return true;
            }

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
        };

        this.hasSecurityOption = function (serviceName) {
            const promises = DEDICATED_CLOUD_CONSTANTS.securityOptions.map((optionName) => self.getOptionState(optionName, serviceName));
            return $q.all(promises).then((results) => results.some((optionInfo) => optionInfo !== "disabled"));
        };

        /* ------- Resource -------*/

        this.getUpgradeResourceDurations = function (serviceName, upgradeType, upgradedResourceType, upgradedResourceId) {
            const params = {
                upgradeType
            };

            if (upgradedResourceType) {
                params.upgradedRessourceType = upgradedResourceType;
                params.upgradedRessourceId = upgradedResourceId;
            } else {
                params.upgradedRessourceType = "all";
            }

            return OvhHttp.get("/order/dedicatedCloud/{serviceName}/upgradeRessource", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                params
            });
        };

        this.getUpgradeResourceOrder = function (serviceName, upgradeType, duration, upgradedResourceType, upgradedResourceId) {
            const params = {
                upgradeType
            };

            if (upgradedResourceType) {
                params.upgradedRessourceType = upgradedResourceType;
                params.upgradedRessourceId = upgradedResourceId;
            } else {
                params.upgradedRessourceType = "all";
            }

            return OvhHttp.get("/order/dedicatedCloud/{serviceName}/upgradeRessource/{duration}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    duration
                },
                params
            });
        };

        this.upgradedResource = function (serviceName, upgradeType, duration, upgradedResourceType, upgradedResourceId) {
            const params = {
                upgradeType
            };
            if (upgradedResourceType) {
                params.upgradedRessourceType = upgradedResourceType;
                params.upgradedRessourceId = upgradedResourceId;
            } else {
                params.upgradedRessourceType = "all";
            }

            return OvhHttp.post("/order/dedicatedCloud/{serviceName}/upgradeRessource/{duration}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    duration
                },
                data: params
            });
        };

        /* ------- Upgrade -------*/
        this.upgrade = function (serviceName) {
            return OvhHttp.post("/dedicatedCloud/{serviceName}/upgradeHypervisor", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                }
            });
        };

        this.isOptionToggable = function (serviceName, optionName, state, _returnAsBoolean) {
            let returnAsBoolean = _returnAsBoolean;

            if (_.isUndefined(returnAsBoolean)) {
                returnAsBoolean = true;
            }

            if (!_.includes(availableOptions, optionName)) {
                throw new Error("Valid optionName are nsx, vrops, hds, hipaa and pcidss");
            }

            if (_.includes(["disabling", "enabling"], state)) {
                // while enabling/disabling activation button not show, no need for a message (the tooltip)
                return { toggable: false };
            }

            const endpoint = `canBe${state === "enabled" ? "Disabled" : "Enabled"}`;

            return OvhHttp.get("/dedicatedCloud/{serviceName}/{optionName}/{endpoint}", {
                urlParams: {
                    serviceName,
                    optionName,
                    endpoint
                },
                rootPath: "apiv6",
                returnErrorKey: ""
            })
                .then((response) => {
                    // API return a funny response, assume it is true if the response was a 200
                    if (returnAsBoolean === true) {
                        return { toggable: true };
                    }
                    return response;
                })
                .catch((err) =>
                    // when false the API return a 403 (if not compatible) or 409 (if already activated or in incorrect state)
                    ({ toggable: false, error: err })
                );
        };

        this.getOptionState = function (optionName, serviceName) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/{optionName}", {
                urlParams: {
                    serviceName,
                    optionName
                },
                rootPath: "apiv6"
            }).then((response) => response.state);
        };

        this.enableOption = function (serviceName, optionName) {
            return OvhHttp.post("/dedicatedCloud/{serviceName}/{optionName}/enable", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    optionName
                }
            });
        };

        this.disableOption = function (serviceName, optionName) {
            return OvhHttp.post("/dedicatedCloud/{serviceName}/{optionName}/disable", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    optionName
                }
            });
        };

        this.fetchAllHostsPrices = function (serviceName, currentCommercialRangeName, newCommercialRange, location) {
            return self.fetchHosts(serviceName).then((hosts) => {
                const currentHosts = angular.copy(hosts);
                const nextHosts = angular.copy(hosts);
                return $q.all({
                    current: $q.all(currentHosts.map((host) => self.fillHostPrice(currentCommercialRangeName, host.commercialSubRange, location, host))),
                    next: $q.all(nextHosts.map((host) => self.fillHostPrice(newCommercialRange, host.commercialSubRange, location, host)))
                });
            });
        };

        this.fetchHosts = function (serviceName) {
            return self.getDatacenters(serviceName).then((dataCenters) => {
                if (dataCenters.results && dataCenters.results.length > 0) {
                    return $q
                        .all(
                            dataCenters.results.map((dataCenter) =>
                                self
                                    .getHostsLexi(serviceName, dataCenter.id)
                                    .then((hostIds) => $q.all(hostIds.map((hostId) => self.getHost(serviceName, dataCenter.id, hostId))))
                                    .then((hosts) =>
                                        hosts.map((host) =>
                                            _.assign(host, {
                                                datacenter: dataCenter.name,
                                                commercialSubRange: dataCenter.commercialRangeName.substr(6).toLowerCase()
                                            })
                                        )
                                    )
                            )
                        )
                        .then((dataCentersHosts) => _.flatten(dataCentersHosts));
                }
                return [];
            });
        };

        this.fillHostPrice = function (commercialRange, commercialSubRange, location, host) {
            return self.getHostPrice(commercialRange, commercialSubRange, location, host.billingType, host.profile).then((price) => _.assign(host, { price: price.text }));
        };

        /**
             * Poll request
             */
        this.pollRequestState = function (opts) {
            const taskId = opts.task.taskId || opts.task;

            if (!taskId) {
                return $rootScope.$broadcast("dedicatedCloud.error", "");
            }

            $rootScope.$broadcast(["dedicatedCloud", opts.namespace, "start"].join("."), opts);

            return Poll.poll(["apiv6/dedicatedCloud", opts.serviceName, "task", taskId].join("/"), null, {
                successRule: { state: "done" },
                namespace: "dedicatedCloud.request"
            }).then(
                (task) => {
                    $rootScope.$broadcast(["dedicatedCloud", opts.namespace, "done"].join("."), task);
                },
                (err) => {
                    $rootScope.$broadcast(["dedicatedCloud", opts.namespace, "error"].join("."), err);
                }
            );
        };

        this.killAllPolling = function () {
            angular.forEach(["enableUser", "disableUser"], (action) => {
                Poll.kill({ namespace: `dedicatedCloud.${action}` });
            });
        };

        /* ------- Terminate -------*/

        /**
         *  DEPRECATED : use OvhApiDedicatedCloudV6.terminate from ovh-api-services instead.
         */
        this.terminate = function (serviceName) {
            return OvhHttp.post("/dedicatedCloud/{serviceName}/terminate", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                }
            });
        };

        /**
         *  DEPRECATED : use OvhApiDedicatedCloudV6.confirmTermination from ovh-api-services instead.
         */
        this.confirmTerminate = function (serviceName, reason, token, commentary) {
            return OvhHttp.post("/dedicatedCloud/{serviceName}/confirmTermination", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data: {
                    reason,
                    token,
                    commentary
                }
            });
        };

        /* ------- Operations -------*/
        this.getOperations = function (serviceName, opts) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/task", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                params: opts.params
            });
        };

        this.getOperation = function (serviceName, opts) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/task/{taskId}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    taskId: opts.taskId
                }
            });
        };

        this.getOperationDescription = function (serviceName, opts) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/robot/{name}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    name: opts.name
                },
                cache: "UNIVERS_DEDICATED_DEDICATED_CLOUD_OPERATIONS",
                clearCache: opts.forceRefresh,
                returnErrorKey: ""
            }).catch((err) => {
                if (err.status === 404) {
                    return {
                        description: ""
                    };
                }
                return $q.reject(err);
            });
        };

        this.updateOperation = function (serviceName, opts) {
            return OvhHttp.post("/dedicatedCloud/{serviceName}/task/{taskId}/changeMaintenanceExecutionDate", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    taskId: opts.taskId
                },
                data: opts.data
            });
        };

        this.getUserOperations = function (serviceName, opts) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/user/{userId}/task", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    userId: opts.userId
                },
                params: opts.params
            });
        };

        this.getUserOperationsDetail = function (serviceName, opts) {
            return this.getUserOperations(serviceName, opts).then((tasks) => {
                const taskPromises = tasks.map((task) =>
                    OvhHttp.get("/dedicatedCloud/{serviceName}/user/{userId}/task/{taskId}", {
                        rootPath: "apiv6",
                        urlParams: {
                            serviceName,
                            userId: opts.userId,
                            taskId: task
                        }
                    })
                );

                return $q.all(taskPromises);
            });
        };

        this.getFirstUserOperationDetail = function (serviceName, opts) {
            return this.getUserOperations(serviceName, opts).then((tasks) => {
                if (!tasks.length) {
                    return null;
                }

                return OvhHttp.get(["/dedicatedCloud", serviceName, "user", opts.userId, "task", tasks[0]].join("/"), {
                    rootPath: "apiv6"
                });
            });
        };

        this.getModels = function () {
            return OvhHttp.get("/dedicatedCloud.json", {
                rootPath: "apiv6",
                cache: "UNIVERS_DEDICATED_DEDICATED_CLOUD_OPERATION_MODELS"
            });
        };

        self.getDedicatedCloudTasksPromise = function (dedicatedCloud, taskState) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/task", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName: dedicatedCloud.name
                },
                params: {
                    state: taskState
                }
            });
        };

        self.getDedicatedCloudTaskPromise = function (dedicatedCloud, taskId) {
            return OvhHttp.get("/dedicatedCloud/{serviceName}/task/{taskId}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName: dedicatedCloud.name,
                    taskId
                }
            });
        };

        self.pollUserTasks = function (serviceName, opts) {
            if (!opts.user || !opts.task) {
                return $rootScope.$broadcast(`${opts.namespace}.error`, "");
            }

            if (!Array.isArray(opts.successSates)) {
                opts.successSates = [opts.successSates];
            }

            const url = ["apiv6/dedicatedCloud", serviceName, "user", opts.user.userId, "task", opts.task.taskId].join("/");

            $rootScope.$broadcast(`${opts.namespace}.start`, opts.task, opts.user);
            return Poller.poll(url, null, {
                namespace: opts.namespace,
                interval: 5000,
                successRule: {
                    state (task) {
                        return opts.successSates.indexOf(task.state) !== -1;
                    }
                },
                errorRule: {
                    state (task) {
                        return opts.errorsSates.indexOf(task.state) !== -1;
                    }
                }
            }).then(
                (pollObject, task) => {
                    $rootScope.$broadcast(`${opts.namespace}.done`, pollObject, task, opts.user);
                },
                (err) => {
                    $rootScope.$broadcast(`${opts.namespace}.error`, err, opts.user);
                },
                (task) => {
                    $rootScope.$broadcast(`${opts.namespace}.doing`, task, opts.user);
                }
            );
        };

        self.stopAllPolling = function (opts) {
            Poller.kill({ namespace: opts.namespace });
        };
    });
