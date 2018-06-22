angular
    .module("services")
    .constant("SERVERSTATS_PERIOD_ENUM", {
        HOURLY: {
            standardDays: 0,
            standardHours: 0,
            standardMinutes: 1,
            standardSeconds: 60,
            millis: 60000
        },
        DAILY: {
            standardDays: 0,
            standardHours: 0,
            standardMinutes: 5,
            standardSeconds: 300,
            millis: 300000
        },
        WEEKLY: {
            standardDays: 0,
            standardHours: 0,
            standardMinutes: 30,
            standardSeconds: 1800,
            millis: 1800000
        },
        MONTHLY: {
            standardDays: 0,
            standardHours: 2,
            standardMinutes: 120,
            standardSeconds: 7200,
            millis: 7200000
        },
        YEARLY: {
            standardDays: 1,
            standardHours: 24,
            standardMinutes: 1440,
            standardSeconds: 86400,
            millis: 86400000
        }
    })
    .constant("HARDWARE_RAID_RULE_DEFAULT_NAME", "managerHardRaid")
    .service("Server", function (Products, $http, $q, constants, $cacheFactory, $rootScope, $translate, Api, Polling, OvhHttp, SERVERSTATS_PERIOD_ENUM, HARDWARE_RAID_RULE_DEFAULT_NAME) {
        "use strict";

        const self = this;
        const serverCaches = {
            ipmi: $cacheFactory("UNIVERS_DEDICATED_SERVER_IPMI"),
            ovhTemplates: $cacheFactory("UNIVERS_DEDICATED_SERVER_INSTALLATION_OVH_TEMPLATE")
        };
        const requests = {
            serverDetails: null,
            serverStatistics: null,
            serverStatisticsConst: null
        };
        const path = {
            product: "dedicated/server/{serviceName}",
            blocks: "module/ip/blocks",
            installation: "installation",
            installationMe: "me/installationTemplate",
            ip: "ip",
            sshMe: "me/sshKey",
            order: "order/dedicated/server/{serviceName}",
            sms: "sms",
            proxy: "apiv6",
            dedicatedServer: "apiv6/dedicated/server"
        };

            // TODO delete this
        const serverCache = $cacheFactory("UNIVERS_DEDICATED_SERVER_");

        function resetCache (targetedCache) {
            if (targetedCache && targetedCache !== serverCaches.all) {
                targetedCache.removeAll();
            } else {
                angular.forEach(serverCaches, (_cache) => {
                    _cache.removeAll();
                });

                // TODO DELETE
                serverCache.removeAll();
                for (const request in requests) {
                    if (requests.hasOwnProperty(request)) {
                        requests[request] = null;
                    }
                }
            }
        }

        /**
             * Specific API wrapper (this.<get|put|post|delete>), @see 'Api' service.
             * Extra params:
             *   broadcast, forceRefresh
             */
        angular.forEach(["get", "put", "post", "delete"], (operationType) => {
            self[operationType] = function (productId, url, _opt) {
                const opt = _opt || {};

                let fullUrl;
                let params;
                let urlPath;

                if (opt.forceRefresh) {
                    resetCache(opt.cache);
                }

                return Products.getSelectedProduct(productId).then(
                    (selectedProduct) => {
                        if (!selectedProduct) {
                            return $q.reject(selectedProduct);
                        }

                        urlPath = URI.expand((!opt.urlPath && path.product) || opt.urlPath, {
                            serviceName: selectedProduct.name
                        }).toString();
                        fullUrl = ["apiv6", urlPath];

                        params = angular.extend(
                            {
                                cache: operationType === "get" ? opt.cache : false // [TRICK] Force no cache for POST|PUT|DELETE
                            },
                            opt
                        );

                        return Api[operationType](
                            url ? fullUrl.concat(url).join("/") : fullUrl.join("/"), // Because Play dislike URL finished by a slash...
                            params
                        ).then(
                            (response) => {
                                if (opt.cache && operationType !== "get") {
                                    // [TRICK] Force refresh of datas when POST|PUT|DELETE
                                    resetCache(opt.cache);
                                }
                                if (opt.broadcast) {
                                    if (opt.broadcastParam) {
                                        $rootScope.$broadcast(opt.broadcast, opt.broadcastParam);
                                    } else {
                                        $rootScope.$broadcast(opt.broadcast, response);
                                    }
                                }
                                return response;
                            },
                            (response) => $q.reject(response)
                        );
                    },
                    (response) => $q.reject(response)
                );
            };
        });

        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

        this.getUrlRenew = function (productId) {
            return Products.getSelectedProduct(productId).then((selectedProduct) =>
                URI.expand(constants.renew, {
                    serviceName: selectedProduct.name
                }).toString()
            );
        };

        this.getTaskPath = function (productId, taskId) {
            return `apiv6/dedicated/server/${productId}/task/${taskId}`;
        };

        this.addTaskFast = function (productId, task, scopeId) {
            task.id = task.id || task.taskId;
            const pollPromise = $q.defer();
            Polling.addTaskFast(self.getTaskPath(productId, task.id), task, scopeId).then(
                (state) => {
                    pollPromise.resolve(state);
                    if (Polling.isDone(state)) {
                        $rootScope.$broadcast("tasks.update");
                    }
                },
                (data) => {
                    pollPromise.reject(data);
                    $rootScope.$broadcast("tasks.update");
                }
            );
            return pollPromise.promise;
        };

        this.addTask = function (productId, task, scopeId) {
            const pollPromise = $q.defer();

            Polling.addTask(self.getTaskPath(productId, task.id || task.taskId), task, scopeId).then(
                (state) => {
                    pollPromise.resolve(state);
                    if (Polling.isDone(state)) {
                        $rootScope.$broadcast("tasks.update");
                    }
                },
                (data) => {
                    pollPromise.reject({ type: "ERROR", message: data.comment });
                    $rootScope.$broadcast("tasks.update");
                }
            );

            return pollPromise.promise;
        };

        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

        this.getSelected = function (serviceName) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                },
                broadcast: "dedicated.server.refreshTabs"
            });
        };

        this.reboot = function (serviceName) {
            return OvhHttp.post("/dedicated/server/{serviceName}/reboot", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                broadcast: "dedicated.informations.reboot"
            });
        };

        this.getNetboot = function (serviceName) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/netboot", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                }
            });
        };

        this.setNetBoot = function (serviceName, bootId, rootDevice) {
            return OvhHttp.put("/dedicated/server/{serviceName}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data: {
                    bootId,
                    rootDevice
                },
                broadcast: "dedicated.informations.reload"
            });
        };

        this.updateMonitoring = function (serviceName, monitoring) {
            return OvhHttp.put("/dedicated/server/{serviceName}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data: {
                    monitoring
                },
                broadcast: "dedicated.informations.reload"
            });
        };

        this.getRescueMail = function (productId) {
            return this.get(productId, "", {
                proxypass: true,
                broadcast: "dedicated.informations.reload"
            });
        };

        this.updateRescueMail = function (productId, bootId, rescueMail) {
            return this.put(productId, "", {
                data: {
                    bootId,
                    rescueMail
                },
                proxypass: true,
                broadcast: "dedicated.informations.reload"
            });
        };

        this.removeHack = function (productId) {
            return this.put(productId, "", {
                data: {
                    state: "ok"
                },
                proxypass: true,
                broadcast: "dedicated.informations.reload"
            });
        };

        this.updateReverse = function (productId, serviceName, ip, reverse) {
            return this.post(productId, "{ip}/reverse", {
                urlParams: {
                    ip
                },
                data: {
                    ipReverse: ip,
                    reverse: punycode.toASCII(reverse)
                },
                broadcast: "global_display_name_change",
                broadcastParam: {
                    serviceName,
                    displayName: reverse
                },
                proxypass: true,
                urlPath: path.ip
            });
        };

        this.deleteReverse = function (productId, serviceName, ip) {
            return this.delete(productId, "{ip}/reverse/{ip}", {
                urlParams: {
                    ip
                },
                broadcast: "global_display_name_change",
                broadcastParam: {
                    serviceName,
                    displayName: serviceName
                },
                proxypass: true,
                urlPath: path.ip
            });
        };

        /* ------- SECONDARY DNS -------*/

        this.getSecondaryDnsList = function (serviceName, count, offset) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/secondaryDNS", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                },
                params: {
                    count,
                    offset
                }
            });
        };

        this.listIps = function (serviceName) {
            return OvhHttp.get("/ip", {
                rootPath: "apiv6",
                params: {
                    "routedTo.serviceName": serviceName
                }
            });
        };

        this.addSecondaryDns = function (serviceName, domain, ip) {
            return OvhHttp.post("/dedicated/server/{serviceName}/secondaryDnsDomains", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data: {
                    domain,
                    ip
                },
                broadcast: "dedicated.secondarydns.reload"
            });
        };

        this.deleteSecondaryDns = function (serviceName, domain) {
            return OvhHttp.delete("/dedicated/server/{serviceName}/secondaryDnsDomains/{domain}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    domain
                },
                broadcast: "dedicated.secondarydns.reload"
            });
        };

        this.getDomainZoneInformation = function (productId, domain) {
            return this.get(productId, "secondaryDnsNameDomainToken", {
                params: {
                    domain
                },
                proxypass: true
            });
        };

        /* ------- FTP BACKUP -------*/

        this.getFtpBackup = function (serviceName) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/backupFtp", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                }
            });
        };

        this.activateFtpBackup = function (serviceName) {
            return OvhHttp.post("/dedicated/server/{serviceName}/features/backupFTP", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                broadcast: "dedicated.ftpbackup.active"
            });
        };

        this.deleteFtpBackup = function (serviceName) {
            return OvhHttp.delete("/dedicated/server/{serviceName}/features/backupFTP", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                broadcast: "dedicated.ftpbackup.delete"
            });
        };

        this.requestFtpBackupPassword = function (serviceName) {
            return OvhHttp.post("/dedicated/server/{serviceName}/features/backupFTP/password", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                broadcast: "dedicated.ftpbackup.password"
            });
        };

        this.getFtpBackupIp = function (serviceName, count, offset) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/backupFtp/access", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                },
                params: {
                    count,
                    offset
                }
            });
        };

        this.getAuthorizableBlocks = function (serviceName) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/backupFtp/access/authorizableBlocks", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                }
            });
        };

        this.postFtpBackupIp = function (serviceName, ipBlocksList, ftp, nfs, cifs) {
            return OvhHttp.post("/sws/dedicated/server/{serviceName}/backupFtp/access-add", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                },
                data: {
                    ipBlocksList,
                    ftp,
                    nfs,
                    cifs
                },
                broadcast: "server.ftpBackup.refresh"
            });
        };

        this.putFtpBackupIp = function (serviceName, ipBlock, ftp, nfs, cifs) {
            return OvhHttp.put("/dedicated/server/{serviceName}/features/backupFTP/access/{ipBlock}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    ipBlock
                },
                data: {
                    ftp,
                    nfs,
                    cifs
                },
                broadcast: "server.ftpBackup.refresh"
            });
        };

        this.deleteFtpBackupIp = function (serviceName, ipBlock) {
            return OvhHttp.delete("/dedicated/server/{serviceName}/features/backupFTP/access/{ipBlock}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    ipBlock
                }
            });
        };

        this.getFtpBackupOrder = function (serviceName) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/backupFtp/order", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                }
            });
        };

        this.getFtpBackupOrderDetail = function (serviceName, capacity) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/backupFtp/order/{capacity}/details", {
                rootPath: "2api",
                urlParams: {
                    serviceName,
                    capacity
                }
            });
        };

        this.postFtpBackupOrderDetail = function (serviceName, duration, capacity) {
            return OvhHttp.post("/order/dedicated/server/{serviceName}/backupStorage/{duration}", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName,
                    duration
                },
                data: {
                    capacity
                },
                broadcast: "server.ftpBackup.refresh"
            });
        };

        /* ------- STATISTICS -------*/

        this.getStatisticsConst = function () {
            return self.getModels().then((models) => ({
                types: _.chain(models.data.models["dedicated.server.MrtgTypeEnum"].enum)
                    .map((type) => type.split(":")[0].toUpperCase())
                    .uniq()
                    .value(),
                defaultType: "TRAFFIC",
                periods: models.data.models["dedicated.server.MrtgPeriodEnum"].enum.map((period) => _.snakeCase(period).toUpperCase()),
                defaultPeriod: "DAILY"
            }));
        };

        this.getNetworkInterfaces = (productId) => {
            let serverName = "";
            return self
                .getSelected(productId)
                .then((server) => {
                    serverName = server.name;
                    return $http.get([path.dedicatedServer, serverName, "networkInterfaceController"].join("/"));
                })
                .then((networkInterfaceIds) => {
                    const promises = _.map(networkInterfaceIds.data, (networkInterfaceId) => $http.get([path.dedicatedServer, serverName, "networkInterfaceController", networkInterfaceId].join("/")).then((response) => response.data));
                    return $q.all(promises);
                });
        };

        this.getStatistics = function (productId, mac, type, period) {
            resetCache();
            return aggregateMRTG(productId, mac, type, period);
        };

        function aggregateMRTG (productId, mac, type, period) {
            return self.getSelected(productId).then((server) =>
                $q
                    .all([
                        $http.get([path.dedicatedServer, server.name, "networkInterfaceController", mac, "mrtg"].join("/"), {
                            params: {
                                period: period.toLowerCase(),
                                type: `${type.toLowerCase()}:download`
                            }
                        }),
                        $http.get([path.dedicatedServer, server.name, "networkInterfaceController", mac, "mrtg"].join("/"), {
                            params: {
                                period: period.toLowerCase(),
                                type: `${type.toLowerCase()}:upload`
                            }
                        })
                    ])
                    .then((results) => {
                        const pointInterval = getPointInterval(period);
                        return buildMRTGResponse(results, pointInterval);
                    })
            );
        }

        function buildMRTGResponse (arrayIn, pointInterval) {
            const response = {
                state: "OK",
                messages: [],
                upload: {
                    pointInterval,
                    pointStart: moment(arrayIn[1].data[0].timestamp * 1000).format(),
                    values: []
                },
                download: {
                    pointInterval,
                    pointStart: moment(arrayIn[0].data[0].timestamp * 1000).format(),
                    values: []
                }
            };

            response.download.values = fillGaps(arrayIn[0].data);
            response.upload.values = fillGaps(arrayIn[1].data);
            return response;
        }

        function fillGaps (arrayIn) {
            const graph = [];
            arrayIn.forEach((point, index, array) => {
                let value;
                let unit;
                if (point.value === null) {
                    const prevPoint = array[index - 1];

                    if (!prevPoint || !prevPoint.value) {
                        value = 0;
                        unit = "bps";
                    } else {
                        value = prevPoint.value.value;
                        unit = prevPoint.value.unit;
                    }
                } else {
                    unit = point.value.unit;
                    value = point.value.value;
                }
                graph.push({
                    unit,
                    y: value
                });
            });
            return graph;
        }

        function getPointInterval (period) {
            switch (period) {
            case "HOURLY": {
                return SERVERSTATS_PERIOD_ENUM.HOURLY;
            }
            case "DAILY": {
                return SERVERSTATS_PERIOD_ENUM.DAILY;
            }
            case "WEEKLY": {
                return SERVERSTATS_PERIOD_ENUM.WEEKLY;
            }
            case "MONTHLY": {
                return SERVERSTATS_PERIOD_ENUM.MONTHLY;
            }
            case "YEARLY": {
                return SERVERSTATS_PERIOD_ENUM.YEARLY;
            }
            default:
                return null;
            }
        }

        /* --------------INTERVENTIONS---------------*/

        this.getInterventions = function (serviceName, count, offset) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/interventions", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                },
                params: {
                    count,
                    offset
                }
            });
        };

        /* --------------IPMI---------------*/

        this.isIpmiActivated = function (serviceName) {
            return OvhHttp.get("/dedicated/server/{serviceName}/features/ipmi", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                returnErrorKey: ""
            }).catch((err) => {
                if (err.status === 404) {
                    return {
                        isActivated: false
                    };
                }
                return err;
            });
        };

        this.ipmiStartTest = function (serviceName, type, ttl) {
            return OvhHttp.post("/dedicated/server/{serviceName}/features/ipmi/test", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data: {
                    ttl,
                    type
                }
            });
        };

        this.ipmiStartConnection = function ({ serviceName, type, ttl, ipToAllow, sshKey, withGeolocation }) {
            let promise = $q.when(ipToAllow);

            if (withGeolocation) {
                promise = this.getIpGeolocation().then(({ ip }) => ip);
            }

            return promise.then((ip) => OvhHttp.post("/dedicated/server/{serviceName}/features/ipmi/access", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data: {
                    ttl,
                    type,
                    sshKey,
                    ipToAllow: ip
                }
            }));
        };

        this.ipmiGetConnection = function (serviceName, type) {
            return OvhHttp.get("/dedicated/server/{serviceName}/features/ipmi/access", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                params: {
                    type
                }
            });
        };

        this.ipmiRestart = function (serviceName) {
            return OvhHttp.post("/dedicated/server/{serviceName}/features/ipmi/resetInterface", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                broadcast: "dedicated.ipmi.resetinterfaces"
            });
        };

        this.ipmiSessionsReset = function (serviceName) {
            return OvhHttp.post("/dedicated/server/{serviceName}/features/ipmi/resetSessions", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                broadcast: "dedicated.ipmi.resetsessions"
            });
        };

        this.getIpGeolocation = function () {
            return OvhHttp.post("/me/geolocation", {
                rootPath: "apiv6"
            });
        };

        /* --------------TASK---------------*/

        this.getTasks = function (serviceName, elementsByPage, elementsToSkip) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/tasks", {
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

        this.getTaskInProgress = function (serviceName, type) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/tasks/uncompleted", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                },
                params: {
                    type
                }
            });
        };

        /* ------- INSTALLATION -------*/

        this.getOvhTemplates = function (serviceName) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/installation/templates", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                },
                params: {
                    type: "ovh"
                }
            });
        };

        this.getPersonalTemplates = function (serviceName) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/installation/templates", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                },
                params: {
                    type: "personal"
                }
            });
        };

        this.getPartitionSchemes = function (productId, templateName) {
            return this.get(productId, "{templateName}/partitionScheme", {
                urlParams: {
                    templateName
                },
                proxypass: true,
                urlPath: path.installationMe
            });
        };

        this.getPartitionSchemePriority = function (productId, templateName, schemeName) {
            return this.get(productId, "{templateName}/partitionScheme/{schemeName}", {
                urlParams: {
                    templateName,
                    schemeName
                },
                proxypass: true,
                urlPath: path.installationMe
            });
        };

        this.getOvhPartitionSchemesTemplates = function (serviceName, template, lang, customeInstall) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/installation/{template}/{lang}/partitionSchemes", {
                rootPath: "2api",
                urlParams: {
                    serviceName,
                    template,
                    lang,
                    customeInstall
                }
            });
        };

        this.getOvhPartitionSchemesTemplatesDetail = function (template, partitionScheme) {
            return OvhHttp.get("/sws/dedicated/server/installationTemplate/{template}/{partitionScheme}/partitions", {
                rootPath: "2api",
                urlParams: {
                    template,
                    partitionScheme
                }
            });
        };

        this.postAddPartition = function (gabaritName, gabaritSchemePartitionName, partition) {
            const data = angular.copy(partition);
            data.type = _.camelCase(data.typePartition);
            delete data.typePartition;

            data.filesystem = _.camelCase(data.fileSystem);
            delete data.fileSystem;

            data.size = _.camelCase(data.partitionSize);
            delete data.partitionSize;

            data.raid = data.raid ? parseInt(data.raid.replace(/_/g, ""), 10) : null;

            delete data.oldMountPoint;

            data.step = _.camelCase(data.order);
            delete data.order;

            data.mountpoint = data.mountPoint;
            delete data.mountPoint;

            return OvhHttp.post("/me/installationTemplate/{templateName}/partitionScheme/{schemeName}/partition", {
                rootPath: "apiv6",
                urlParams: {
                    templateName: gabaritName,
                    schemeName: gabaritSchemePartitionName
                },
                data
            });
        };

        this.putSetPartition = function (gabaritName, gabaritSchemePartitionName, partition) {
            const newPartition = angular.copy(partition);
            newPartition.filesystem = _.camelCase(newPartition.fileSystem);
            newPartition.mountpoint = newPartition.mountPoint;
            newPartition.size = {
                value: newPartition.partitionSize,
                unit: "MB"
            };
            newPartition.type = _.camelCase(newPartition.typePartition);
            newPartition.raid = newPartition.raid ? parseInt(newPartition.raid.replace(/_/g, ""), 10) : null;
            delete newPartition.fileSystem;
            delete newPartition.mountPoint;
            delete newPartition.typePartition;
            delete newPartition.partitionSize;
            delete newPartition.oldMountPoint;

            return OvhHttp.put("/me/installationTemplate/{gabaritName}/partitionScheme/{gabaritSchemePartitionName}/partition/{mountpoint}", {
                rootPath: "apiv6",
                urlParams: {
                    gabaritName,
                    gabaritSchemePartitionName,
                    mountpoint: partition.oldMountPoint
                },
                data: newPartition
            });
        };

        this.deleteSetPartition = function (gabaritName, gabaritSchemePartitionName, mountpoint) {
            return OvhHttp.delete("/me/installationTemplate/{templateName}/partitionScheme/{schemeName}/partition/{mountpoint}", {
                rootPath: "apiv6",
                urlParams: {
                    templateName: gabaritName,
                    schemeName: gabaritSchemePartitionName,
                    mountpoint
                }
            });
        };

        this.checkIntegrity = function (gabaritName) {
            return OvhHttp.post("/me/installationTemplate/{gabaritName}/checkIntegrity", {
                rootPath: "apiv6",
                urlParams: {
                    gabaritName
                }
            });
        };

        this.putSetGabarit = function (productId, gabaritName, gabaritNameNew, customization) {
            return this.put(productId, "{gabaritName}", {
                urlParams: {
                    gabaritName
                },
                data: {
                    templateName: gabaritNameNew,
                    customization
                },
                proxypass: true,
                urlPath: path.installationMe
            });
        };

        this.createPartitioningScheme = function (productId, gabaritName, newPartitioningScheme) {
            return self
                .getPartitionSchemePriority(productId, gabaritName, newPartitioningScheme.name)
                .catch((data) => data.status === 404 ? "no_partition" : $q.reject(data))
                .then((status) => {
                    if (status === "no_partition") {
                        return self.post(productId, "{gabaritName}/partitionScheme", {
                            urlParams: {
                                gabaritName
                            },
                            data: newPartitioningScheme,
                            proxypass: true,
                            urlPath: path.installationMe
                        });
                    }
                    return null;
                });
        };

        this.cloneDefaultPartitioningScheme = function (productId, gabaritName, newPartitioningSchemeName) {
            return self
                .get(productId, "{gabaritName}/partitionScheme/default/partition", {
                    urlParams: {
                        gabaritName
                    },
                    proxypass: true,
                    urlPath: path.installationMe
                })
                .then((mountpoints) => {
                    const getMountpoints = _.map(mountpoints, (mountpoint) =>
                        self
                            .get(productId, "{gabaritName}/partitionScheme/{schemeName}/partition/{mountpoint}", {
                                urlParams: {
                                    gabaritName,
                                    schemeName: newPartitioningSchemeName,
                                    mountpoint
                                },
                                proxypass: true,
                                urlPath: path.installationMe,
                                returnErrorKey: null
                            })
                            .catch((data) => data.status === 404 ? "no_mountpoint" : $q.reject(data))
                            .then((status) => {
                                if (status === "no_mountpoint") {
                                    return self
                                        .get(productId, "{gabaritName}/partitionScheme/default/partition/{mountpoint}", {
                                            urlParams: {
                                                gabaritName,
                                                mountpoint
                                            },
                                            proxypass: true,
                                            urlPath: path.installationMe
                                        })
                                        .then((mountpointDetails) =>
                                            self.post(productId, "{gabaritName}/partitionScheme/{schemeName}/partition", {
                                                urlParams: {
                                                    gabaritName,
                                                    schemeName: newPartitioningSchemeName
                                                },
                                                data: {
                                                    filesystem: mountpointDetails.filesystem,
                                                    mountpoint: mountpointDetails.mountpoint,
                                                    raid: mountpointDetails.raid,
                                                    size: mountpointDetails.size.value,
                                                    step: mountpointDetails.order,
                                                    type: mountpointDetails.type,
                                                    volumeName: mountpointDetails.volumeName
                                                },
                                                proxypass: true,
                                                urlPath: path.installationMe
                                            })
                                        );
                                }
                                return null;
                            })
                    );
                    return $q.all(getMountpoints);
                });
        };

        this.startInstallation = function (serviceName, templateName, details) {
            return OvhHttp.post("/dedicated/server/{serviceName}/install/start", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data: {
                    details,
                    templateName
                }
            });
        };

        this.deleteGabarit = function (productId, gabaritName) {
            return this.delete(productId, "{gabaritName}", {
                urlParams: {
                    gabaritName
                },
                broadcast: "dedicated.installation.gabarit.refresh",
                urlPath: path.installationMe,
                proxypass: true
            });
        };

        this.hasSqlServerAvailable = function (productId) {
            return this.get(productId, "installation/sqlserver", {});
        };

        this.getSshKey = function (productId) {
            return this.get(productId, "", {
                proxypass: true,
                urlPath: path.sshMe
            });
        };

        /* ------- PRO USE -------*/
        this.getOrderProUseDuration = function (productId) {
            return this.get(productId, "professionalUse", {
                proxypass: true,
                urlPath: path.order
            });
        };

        this.getOrderProUseOrder = function (productId, duration) {
            return this.get(productId, "professionalUse/{duration}", {
                urlPath: path.order,
                urlParams: {
                    duration
                },
                proxypass: true
            });
        };

        this.orderProUse = function (productId, duration) {
            return this.post(productId, "professionalUse/{duration}", {
                urlPath: path.order,
                urlParams: {
                    duration
                },
                proxypass: true
            });
        };

        /* ------- TASK -------*/

        this.progressInstallation = function (serviceName) {
            return OvhHttp.get("/dedicated/server/{serviceName}/install/status", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                returnErrorKey: ""
            }).catch((error) => {
                if (error.status === 460) {
                    return [];
                }
                return $q.reject(error);
            });
        };

        this.getTemplateCapabilities = function (productId, templateName) {
            return this.get(productId, "install/templateCapabilities", {
                proxypass: true,
                params: {
                    templateName
                }
            });
        };

        this.cancelTask = function (productId, taskId) {
            return this.post(productId, "task/{taskId}/cancel", {
                urlParams: {
                    taskId
                },
                proxypass: true
            });
        };

        /* ------- BANDWIDTH -------*/
        this.getBandwidth = function (productId) {
            return this.get(productId, "specifications/network", {
                proxypass: true
            });
        };

        this.getBandwidthOption = function (productId) {
            return self
                .get(productId, "option/BANDWIDTH", {
                    proxypass: true
                })
                .then(
                    (data) => data.state,
                    (response) => {
                        if (response.status === 404) {
                            return "notSubscribed";
                        }
                        return $q.reject(response);
                    }
                );
        };

        this.getBandwidthVrackOption = function (productId) {
            return self
                .get(productId, "option/BANDWIDTH_VRACK", {
                    proxypass: true
                })
                .then((data) => data.state)
                .catch((response) => {
                    if (response.status === 404) {
                        return "notSubscribed";
                    }
                    return $q.reject(response);
                });
        };

        this.orderBandwidth = function (productId, opt) {
            return this.get(productId, "bandwidth", {
                urlParams: {
                    serviceName: opt.serviceName
                },
                params: {
                    bandwidth: opt.bandwidth,
                    type: opt.type
                },
                urlPath: "order/dedicated/server/{serviceName}",
                proxypass: true
            }).then((durations) => {
                const promises = [];
                const returnData = [];

                angular.forEach(durations, (v) => {
                    promises.push(
                        self
                            .get(productId, "bandwidth/{duration}", {
                                urlParams: {
                                    serviceName: opt.serviceName,
                                    duration: v
                                },
                                params: {
                                    bandwidth: opt.bandwidth,
                                    type: opt.type
                                },
                                urlPath: "order/dedicated/server/{serviceName}",
                                proxypass: true
                            })
                            .then((details) => {
                                returnData.push({
                                    durations: v,
                                    details
                                });

                                return returnData;
                            })
                    );
                });

                return $q.all(promises).then(() => returnData, () => returnData);
            }, () => null);
        };

        this.getOrderables = function (productId, optionName) {
            return this.get(productId, `orderable/${optionName}`);
        };

        this.getOrderableDurations = function (productId, data) {
            const dedicatedServerPath = "order/dedicated/server/{serviceName}";
            return this.get(productId, data.optionName, {
                params: data.params,
                urlPath: dedicatedServerPath,
                proxypass: true
            }).then((durations) => {
                const returnData = [];
                const promises = _.map(durations, (duration) =>
                    self
                        .get(productId, `${data.optionName}/{duration}`, {
                            urlParams: {
                                duration
                            },
                            params: data.params,
                            urlPath: dedicatedServerPath,
                            proxypass: true
                        })
                        .then((details) => {
                            returnData.push({
                                durations: duration,
                                details
                            });
                        })
                );

                return $q
                    .all(promises)
                    .then(() => returnData)
                    .catch(() => returnData);
            });
        };

        this.postOptionOrder = function (productId, data) {
            return this.post(productId, `${data.optionName}/{duration}`, {
                urlParams: {
                    duration: data.duration
                },
                data: data.params,
                urlPath: "order/dedicated/server/{serviceName}",
                proxypass: true
            });
        };

        this.getOption = function (productId, optionName) {
            return self
                .get(productId, `option/${optionName}`, {
                    proxypass: true
                })
                .then((data) => data.state)
                .catch((response) => {
                    if (response.status === 404) {
                        return "notSubscribed";
                    }
                    return $q.reject(response);
                });
        };

        this.cancelOption = function (productId, optionName) {
            return self.delete(productId, `option/${optionName}`, {
                proxypass: true
            });
        };

        this.cancelBandwidthOption = function (productId) {
            return self.delete(productId, "option/BANDWIDTH", {
                proxypass: true
            });
        };

        this.postOrderBandwidth = function (productId, opt) {
            return this.post(productId, "bandwidth/{duration}", {
                urlParams: {
                    serviceName: opt.serviceName,
                    duration: opt.duration
                },
                data: {
                    bandwidth: opt.bandwidth,
                    type: opt.type
                },
                urlPath: "order/dedicated/server/{serviceName}",
                proxypass: true
            }).then((details) => details, () => null);
        };

        /* ------- Order KVM -------*/
        this.canOrderKvm = function (productId) {
            return this.get(productId, "orderable/kvm", {
                cache: serverCaches.ipmi,
                proxypass: true,
                urlPath: path.product
            });
        };

        this.getKvmOrderDurations = function (productId) {
            return this.get(productId, "kvm", {
                urlPath: path.order,
                proxypass: true
            });
        };

        this.getKvmOrderDetail = function (productId, duration) {
            return this.get(productId, "kvm/{duration}", {
                urlPath: path.order,
                proxypass: true,
                urlParams: {
                    duration
                }
            });
        };

        this.getKvmOrderDetails = function (productId, durations) {
            const promises = [];

            durations.forEach((duration) => {
                promises.push($q.when(this.getKvmOrderDetail(productId, duration)));
            });

            return $q.all(promises);
        };

        this.postKvmOrderInfos = function (productId, duration) {
            return this.post(productId, "kvm/{duration}", {
                urlPath: path.order,
                proxypass: true,
                urlParams: {
                    duration
                }
            });
        };

        /* ------- KVM Features -------*/
        this.getKvmFeatures = function (productId) {
            return this.get(productId, "features/kvm", {
                cache: serverCaches.ipmi,
                proxypass: true,
                urlPath: path.product
            });
        };

        this.getHardwareSpecifications = function (productId) {
            return this.get(productId, "specifications/hardware", {
                proxypass: true
            });
        };

        /* ------- USB STORAGE -------*/
        this.getUsbStorageInformations = function (productId) {
            const orderable = this.get(productId, "orderable/usbKey", {
                proxypass: true
            });

            const specification = this.get(productId, "specifications/hardware", {
                proxypass: true
            });

            return $q.all([orderable, specification]);
        };

        this.getUsbStorageDurations = function (productId, capacity) {
            return this.get(productId, "usbKey", {
                urlPath: path.order,
                params: {
                    capacity
                },
                proxypass: true
            });
        };

        this.getUsbStorageOrder = function (productId, capacity, duration) {
            return this.get(productId, "usbKey/{duration}", {
                urlPath: path.order,
                urlParams: {
                    duration
                },
                params: {
                    capacity
                },
                proxypass: true
            });
        };

        this.orderUsbStorage = function (productId, capacity, duration) {
            return this.post(productId, "usbKey/{duration}", {
                urlPath: path.order,
                urlParams: {
                    duration
                },
                data: {
                    capacity
                },
                proxypass: true
            });
        };

        this.getRtmVersion = function (serviceName) {
            return OvhHttp.get("/dedicated/server/{serviceName}/statistics", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                returnErrorKey: ""
            });
        };

        this.getOsInformation = function (productId) {
            return self.get(productId, "statistics/os", {
                proxypass: true
            });
        };

        this.getStatisticsChart = function (productId, opts) {
            return self
                .get(productId, "statistics/chart", {
                    proxypass: true,
                    params: {
                        period: opts.period,
                        type: opts.type
                    }
                })
                .then((results) => {
                    const unit = results.unit;
                    const stats = results.values;
                    const points = [];

                    angular.forEach(stats, (st) => {
                        if (st && st.value) {
                            points.push([+st.timestamp * 1000, st.value]);
                        } else {
                            points.push([+st.timestamp * 1000, 0]);
                        }
                    });

                    return {
                        unit,
                        points
                    };
                });
        };

        this.getStatisticsLoadavg = function (productId, opts) {
            const loadavgList = ["loadavg1", "loadavg15", "loadavg5"];
            const deferedObject = $q.defer();
            const promises = [];
            const data = {};

            angular.forEach(loadavgList, (loadavg) => {
                promises.push(
                    self
                        .getStatisticsChart(productId, {
                            period: opts.period,
                            type: loadavg
                        })
                        .then((results) => {
                            data[loadavg] = results;
                        })
                );
            });

            $q.all(promises).then(
                () => {
                    deferedObject.resolve(data);
                },
                (rejection) => {
                    deferedObject.reject(rejection);
                }
            );

            return deferedObject.promise;
        };

        this.getMotherBoard = (productId) =>
            self.get(productId, "statistics/motherboard", {
                proxypass: true
            });

        this.getCpu = (productId) =>
            self.get(productId, "statistics/cpu", {
                proxypass: true
            });

        this.getMemory = (productId) =>
            self.get(productId, "statistics/memory", {
                proxypass: true
            });

        this.getInfosServer = (productId) => {
            const deferredObject = $q.defer();
            const promises = [];

            const data = {};

            promises.push(
                self
                    .getMotherBoard(productId)
                    .then((results) => {
                        data.motherboard = results;
                    })
                    .catch(() => $q.reject({}))
            );

            promises.push(
                self
                    .getCpu(productId)
                    .then((results) => {
                        data.cpu = results;
                    })
                    .catch(() => $q.reject({}))
            );

            promises.push(
                self
                    .getMemory(productId)
                    .then((results) => {
                        data.memory = {
                            total: 0,
                            list: {}
                        };

                        let total = 0;

                        angular.forEach(results, (memory) => {
                            if (memory.capacity) {
                                total += memory.capacity.value;
                                const key = memory.capacity.value + memory.capacity.unit;
                                if (data.memory.list[key]) {
                                    data.memory.list[key].number++;
                                } else {
                                    data.memory.list[key] = {
                                        value: memory.capacity.value,
                                        unit: memory.capacity.unit,
                                        number: 1
                                    };
                                }
                            }
                        });

                        data.memory.totalMemory = total;
                    })
                    .catch(() => $q.reject({}))
            );

            promises.push(
                self
                    .getRtmVersion(productId)
                    .then((results) => {
                        data.rtmVersion = results;
                    })
                    .catch(() => $q.reject({}))
            );

            promises.push(
                self
                    .getOsInformation(productId)
                    .then((results) => {
                        data.osInfo = results;
                    })
                    .catch(() => $q.reject({}))
            );

            $q
                .all(promises)
                .then(() => {
                    deferredObject.resolve(data);
                })
                .catch((rejection) => {
                    deferredObject.reject(rejection);
                });

            return deferredObject.promise;
        };

        this.getDiskCharts = function (serviceName, period) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/rtm/partitions/{period}", {
                urlParams: {
                    serviceName,
                    period
                }
            }).then((result) => {
                const data = {
                    unit: result.unit,
                    series: []
                };

                angular.forEach(result.series, (serie) => {
                    const dataSerie = {
                        points: [],
                        name: serie.partition
                    };

                    angular.forEach(serie.values, (val) => {
                        if (val && angular.isNumber(val.value) && val.value) {
                            dataSerie.points.push([+val.timestamp * 1000, val.value]);
                        } else {
                            dataSerie.points.push([+val.timestamp * 1000, 0]);
                        }
                    });

                    data.series.push(dataSerie);
                });

                return data;
            });
        };

        this.getLoad = function (productId) {
            return self.get(productId, "statistics/load", {
                proxypass: true
            });
        };

        this.getRaidInfo = function (serviceName) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/rtm/raid", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                }
            });
        };

        this.getPartitions = function (serviceName) {
            return OvhHttp.get("/sws/dedicated/server/{serviceName}/rtm/partitions", {
                rootPath: "2api",
                urlParams: {
                    serviceName
                }
            });
        };

        // Monitoring

        /**
             * Get server models
             */
        this.getModels = function () {
            return $http.get("apiv6/dedicated/server.json", { cache: true });
        };

        this.getAllServiceMonitoring = function (productId) {
            let promises = [];
            return self
                .get(productId, "serviceMonitoring", {
                    proxypass: true
                })
                .then((ids) => {
                    promises = ids.map((id) =>
                        self.get(productId, "serviceMonitoring/{monitoringId}", {
                            proxypass: true,
                            urlParams: {
                                monitoringId: id
                            }
                        })
                    );
                    return $q.all(promises);
                })
                .catch((error) => {
                    if (error.status === 460) {
                        return [];
                    }
                    return $q.reject(error);
                });
        };

        this.getServiceMonitoringIds = function (productId) {
            return self.get(productId, "serviceMonitoring", {
                proxypass: true
            });
        };

        this.getServiceMonitoring = function (productId, monitoringId) {
            return self.get(productId, "serviceMonitoring/{monitoringId}", {
                proxypass: true,
                urlParams: {
                    monitoringId
                }
            });
        };

        this.addServiceMonitoring = function (productId, data) {
            return self.post(productId, "serviceMonitoring", {
                proxypass: true,
                data
            });
        };

        this.updateServiceMonitoring = function (productId, monitoringId, serviceMonitoring) {
            return self.put(productId, "serviceMonitoring/{monitoringId}", {
                proxypass: true,
                urlParams: {
                    monitoringId
                },
                data: serviceMonitoring
            });
        };

        this.deleteServiceMonitoring = function (productId, monitoringId) {
            return self.delete(productId, "serviceMonitoring/{monitoringId}", {
                proxypass: true,
                urlParams: {
                    monitoringId
                }
            });
        };

        this.getAllServiceMonitoringNotifications = function (productId, opts) {
            return self
                .get(productId, "serviceMonitoring/{monitoringId}/alert/{type}", {
                    proxypass: true,
                    urlParams: {
                        monitoringId: opts.monitoringId,
                        type: opts.type
                    }
                })
                .then((ids) => {
                    const promises = ids.map((alertId) =>
                        self.get(productId, "serviceMonitoring/{monitoringId}/alert/{type}/{alertId}", {
                            proxypass: true,
                            urlParams: {
                                monitoringId: opts.monitoringId,
                                type: opts.type,
                                alertId
                            }
                        })
                    );
                    return $q.all(promises);
                });
        };

        this.getServiceMonitoringNotificationsIds = function (productId, opts) {
            return self.get(productId, "serviceMonitoring/{monitoringId}/alert/{type}", {
                proxypass: true,
                urlParams: {
                    monitoringId: opts.monitoringId,
                    type: opts.type
                }
            });
        };

        this.getServiceMonitoringNotifications = function (productId, opts) {
            return self.get(productId, "serviceMonitoring/{monitoringId}/alert/{type}/{alertId}", {
                proxypass: true,
                forceRefresh: true,
                urlParams: {
                    monitoringId: opts.monitoringId,
                    type: opts.type,
                    alertId: opts.alertId
                }
            });
        };

        this.deleteServiceMonitoringNotifications = function (productId, opts) {
            return self.delete(productId, "serviceMonitoring/{monitoringId}/alert/{type}/{alertId}", {
                proxypass: true,
                urlParams: {
                    monitoringId: opts.monitoringId,
                    type: opts.type,
                    alertId: opts.alertId
                },
                broadcast: ["server.monitoring.notifications", opts.type, "reload"].join(".")
            });
        };

        this.addServiceMonitoringNotificationEmail = function (productId, opts) {
            return self.post(productId, "serviceMonitoring/{monitoringId}/alert/email", {
                proxypass: true,
                urlParams: {
                    monitoringId: opts.monitoringId
                },
                data: opts.data,
                broadcast: "server.monitoring.notifications.email.reload"
            });
        };

        this.updateServiceMonitoringNotificationEmail = function (productId, opts) {
            return self.put(productId, "serviceMonitoring/{monitoringId}/alert/email/{alertId}", {
                proxypass: true,
                urlParams: {
                    monitoringId: opts.monitoringId,
                    alertId: opts.alertId
                },
                data: opts.data,
                broadcast: "server.monitoring.notifications.email.reload"
            });
        };

        this.addServiceMonitoringNotificationSMS = function (productId, opts) {
            return self.post(productId, "serviceMonitoring/{monitoringId}/alert/sms", {
                proxypass: true,
                urlParams: {
                    monitoringId: opts.monitoringId
                },
                data: opts.data,
                broadcast: "server.monitoring.notifications.sms.reload"
            });
        };

        this.updateServiceMonitoringNotificationSMS = function (productId, opts) {
            return self.put(productId, "serviceMonitoring/{monitoringId}/alert/sms/{alertId}", {
                proxypass: true,
                urlParams: {
                    monitoringId: opts.monitoringId,
                    alertId: opts.alertId
                },
                data: opts.data,
                broadcast: "server.monitoring.notifications.sms.reload"
            });
        };

        this.getSms = function (productId) {
            let promises = [];
            if (constants.target === "CA") {
                return $q.when([]);
            }
            return self
                .get(productId, "", {
                    proxypass: true,
                    urlPath: path.sms
                })
                .then((ids) => {
                    promises = ids.map((smsId) =>
                        self.get(productId, "{serviceName}", {
                            proxypass: true,
                            urlPath: path.sms,
                            urlParams: {
                                serviceName: smsId
                            }
                        })
                    );
                    return $q.all(promises);
                });
        };

        /* ------- Terminate -------*/

        this.terminate = function (serviceName) {
            return OvhHttp.post("/dedicated/server/{serviceName}/terminate", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                }
            });
        };

        this.getRtmHowtoUrl = function () {
            let link;
            let selectedLanguage;
            let lang;
            let fallbackLang;

            /* Arbitrary fallback to English */
            fallbackLang = "GB";

            selectedLanguage = $translate.use();
            try {
                lang = selectedLanguage.replace(/^\w{2}_/, "").toUpperCase();
            } catch (e) {
                lang = fallbackLang;
                throw e;
            }

            if (constants.urls && constants.urls[lang] && constants.urls[lang].RealTimeMonitoring) {
                link = constants.urls[lang].RealTimeMonitoring;
            } else {
                link = constants.urls[fallbackLang].RealTimeMonitoring;
            }
            return link;
        };

        this.getVrack = function (serviceName) {
            return self.getSelected(serviceName).then((selectedServer) => $http.get(`apiv6/dedicated/server/${selectedServer.name}/vrack`).then((results) => results.data));
        };

        /* ------- Hard Raid -------*/

        this.getHardwareRaidProfile = function (serviceName) {
            return self.getSelected(serviceName).then((selectedServer) => $http.get(`apiv6/dedicated/server/${selectedServer.name}/install/hardwareRaidProfile`).then((results) => results.data));
        };

        this.postHardwareRaid = function (productId, templateName, schemeName, disks, raid) {
            return this.post(productId, "{templateName}/partitionScheme/{schemeName}/hardwareRaid", {
                urlParams: {
                    templateName,
                    schemeName
                },
                data: {
                    disks,
                    mode: raid,
                    name: HARDWARE_RAID_RULE_DEFAULT_NAME,
                    step: 1
                },
                proxypass: true,
                urlPath: path.installationMe
            });
        };

        this.putHardwareRaid = function (productId, templateName, schemeName, disks, raid) {
            return this.put(productId, "{templateName}/partitionScheme/{schemeName}/hardwareRaid/{name}", {
                urlParams: {
                    templateName,
                    schemeName,
                    name: HARDWARE_RAID_RULE_DEFAULT_NAME
                },
                data: {
                    disks,
                    mode: raid,
                    name: HARDWARE_RAID_RULE_DEFAULT_NAME,
                    step: 1
                },
                proxypass: true,
                urlPath: path.installationMe
            });
        };

        this.getPartitionSchemeHardwareRaid = function (productId, templateName, schemeName) {
            return this.get(productId, "{templateName}/partitionScheme/{schemeName}/hardwareRaid", {
                urlParams: {
                    templateName,
                    schemeName
                },
                proxypass: true,
                urlPath: path.installationMe
            }).then((response) => {
                const index = _.indexOf(response, HARDWARE_RAID_RULE_DEFAULT_NAME);
                if (index !== -1) {
                    return self.get(productId, "{templateName}/partitionScheme/{schemeName}/hardwareRaid/{name}", {
                        urlParams: {
                            templateName,
                            schemeName,
                            name: response[index]
                        },
                        proxypass: true,
                        urlPath: path.installationMe
                    });
                } else if (response.length > 0) {
                    return self.get(productId, "{templateName}/partitionScheme/{schemeName}/hardwareRaid/{name}", {
                        urlParams: {
                            templateName,
                            schemeName,
                            name: response[0]
                        },
                        proxypass: true,
                        urlPath: path.installationMe
                    });
                }
                return $q.when();
            });
        };

        this.isHardRaidLocationError = function (error) {
            return error.status === 403 && error.data && error.data.message === "Not available from this location";
        };

        this.isHardRaidUnavailableError = function (error) {
            return error.status === 403 && error.data && error.data.message === "Hardware RAID is not supported by this server";
        };

        this.getHighestPriorityPartitionScheme = function (productId, templateName) {
            return self.getPartitionSchemes(productId, templateName).then((schemes) => {
                const getSchemes = _.map(schemes, (scheme) => self.getPartitionSchemePriority(productId, templateName, scheme));
                return $q.all(getSchemes).then((schemesDetails) => {
                    const list = _.sortBy(schemesDetails, "priority").reverse();
                    return list[0];
                });
            });
        };

        /**
         * Update service infos.
         * @param  {Object} data
         * @return {Promise}
         */
        this.updateServiceInfos = (serviceName, data) =>
            OvhHttp.put("/dedicated/server/{serviceName}/serviceInfos", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                },
                data,
                broadcast: "dedicated.informations.reload"
            });

        // Service info

        this.getServiceInfos = function (serviceName) {
            return OvhHttp.get("/dedicated/server/{serviceName}/serviceInfos", {
                rootPath: "apiv6",
                urlParams: {
                    serviceName
                }
            });
        };

        this.isAutoRenewable = function (productId) {
            return this.getSelected(productId).then((server) => moment(server.expiration).diff(moment().date(), "days") > 0);
        };
    });
