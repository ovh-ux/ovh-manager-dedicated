class SessionService {
    constructor ($q, $translate, $translatePartialLoader, constants, CdnDomain, DedicatedCloud, Nas, NavbarNotificationService, Products, User, LANGUAGES, OtrsPopupService, ssoAuthentication, featureAvailability) {
        this.$q = $q;
        this.$translate = $translate;
        this.$translatePartialLoader = $translatePartialLoader;
        this.constants = constants;
        this.$translate = $translate;
        this.cdnDomain = CdnDomain;
        this.dedicatedCloud = DedicatedCloud;
        this.nas = Nas;
        this.navbarNotificationService = NavbarNotificationService;
        this.products = Products;
        this.user = User;
        this.LANGUAGES = LANGUAGES;
        this.otrsPopupService = OtrsPopupService;
        this.ssoAuthentication = ssoAuthentication;
        this.featureAvailability = featureAvailability;
    }

    getProducts () {
        const productsFiltered = {
            dedicatedServers: {
                housing: [],
                servers: []
            },
            dedicatedClouds: [],
            networks: {
                nas: [],
                cdn: []
            },
            microsoft: {
                exchange: []
            }
        };

        return this.$q.all({
            nas: this.nas.getNas().then(({ results }) => results),
            products: this.products.getProductsByType()
        }).then(({ nas, products }) => {
            // Get DedicatedServers/Housing
            productsFiltered.dedicatedServers.housing = _.chain(products.dedicatedServers)
                .filter(({ type }) => type === "HOUSING")
                .sortBy(({ name }) => angular.lowercase(name))
                .value();

            // Get DedicatedServers/Servers
            productsFiltered.dedicatedServers.servers = _.chain(products.dedicatedServers)
                .filter(({ type }) => type === "SERVER")
                .sortBy(({ name }) => angular.lowercase(name))
                .value();

            // Get Networks/NAS
            productsFiltered.networks.nas = nas;

            // Get Microsoft/Exchange
            productsFiltered.microsoft.exchange = _.chain(products.exchanges)
                .sortBy(({ name }) => angular.lowercase(name))
                .value();

            // CDN/PCC Products filtered
            const cdnProducts = _.chain(products.networks)
                .filter(({ type }) => type === "CDN")
                .sortBy(({ name }) => angular.lowercase(name))
                .value();
            const pccProducts = _.chain(products.dedicatedClouds)
                .sortBy(({ name }) => angular.lowercase(name))
                .value();

            // Get deferred products for CDN and PCC
            return this.$q.all({
                cdn: this.getDeferredProducts(cdnProducts, this.cdnDomain.getDomains),
                dedicatedClouds: this.getDeferredProducts(pccProducts, this.dedicatedCloud.getDatacenters)
            });
        }).then(({ cdn, dedicatedClouds }) => {
            // Get Networks/CDN
            productsFiltered.networks.cdn = cdn;

            // Get DedicatedClouds
            productsFiltered.dedicatedClouds = dedicatedClouds;

            return productsFiltered;
        }).catch(() => this.$q.when(undefined));
    }

    getDeferredProducts (products, promiseFn) {
        const deferred = this.$q.defer();
        const promises = _.map(products, (elt) => promiseFn(elt.name));

        // Add services to products object
        const parseResult = (result) => {
            products.forEach((elt, index) => {
                elt.services = result[index].results;
            });

            deferred.resolve(products);
        };

        // Get services of each products
        this.$q.allSettled(promises)
            .then(parseResult, parseResult);

        return deferred.promise;
    }

    getDedicatedServersMenu (products) {
        const subLinks = (services) => _.map(services, (service) => ({
            title: service.displayName,
            state: `app.dedicated.${service.type.toLowerCase()}`,
            stateParams: {
                productId: service.name
            }
        }));

        return [{
            name: "dedicatedServers.housing",
            title: this.$translate.instant("otrs_service_category_HOUSING"),
            subLinks: subLinks(products.housing)
        }, {
            name: "dedicatedServers.servers",
            title: this.$translate.instant("otrs_service_category_SERVER"),
            subLinks: subLinks(products.servers)
        }];
    }

    getDedicatedCloudsMenu (products) {
        return _.map(products, (product) => {
            if (!product.services || !product.services.length) {
                return {
                    title: product.displayName,
                    state: "app.dedicatedClouds",
                    stateParams: {
                        productId: product.name
                    }
                };
            }

            // Build submenu
            const subLinks = _.map(product.services, (service) => ({
                title: service.displayName,
                state: "app.dedicatedClouds.dataCenter",
                stateParams: {
                    productId: product.name,
                    datacenterId: service.id
                }
            }));

            // Add first entry in submenu
            subLinks.unshift({
                title: this.$translate.instant("dedicatedCloud_tab_dashboard"),
                state: "app.dedicatedClouds",
                stateParams: {
                    productId: product.name
                }
            });

            return {
                name: `networks.cdn.${product.name}`,
                title: product.displayName,
                subLinks
            };
        });
    }

    getNetworksMenu (products) {
        return [{
            name: "networks.cdn",
            title: this.$translate.instant("otrs_service_category_CDN"),
            subLinks: _.map(products.cdn, (product) => {
                if (!product.services || !product.services.length) {
                    return {
                        title: product.displayName,
                        state: "app.networks.cdn",
                        stateParams: {
                            productId: product.name
                        }
                    };
                }

                // Build submenu
                const subLinks = _.map(product.services, (service) => ({
                    title: service.displayName,
                    state: "app.networks.cdn.domain",
                    stateParams: {
                        productId: product.name,
                        domain: service.id
                    }
                }));

                // Add first entry in submenu
                subLinks.unshift({
                    title: this.$translate.instant("cdn_tab_statistics"),
                    state: "app.networks.cdn",
                    stateParams: {
                        productId: product.name
                    }
                });

                return {
                    name: `networks.cdn.${product.name}`,
                    title: product.displayName,
                    subLinks
                };
            })
        }, {
            name: "networks.nas",
            title: this.$translate.instant("otrs_service_category_NAS"),
            subLinks: _.map(products.nas, (product) => ({
                title: product.displayName,
                state: "app.networks.nas.details",
                stateParams: {
                    nasType: "nas",
                    nasId: product.id
                }
            }))
        }];
    }

    getMicrosoftMenu (products) {
        return [{
            name: "microsoft.exchange",
            title: this.$translate.instant("navigation_left_exchange"),
            subLinks: _.map(products.exchange, (product) => ({
                title: product.displayName || product.name,
                state: product.type === "EXCHANGE_PROVIDER" ?
                    "app.microsoft.exchange.provider" :
                    product.type === "EXCHANGE_DEDICATED" ?
                        "app.microsoft.exchange.dedicated" :
                        "app.microsoft.exchange.hosted",
                stateParams: {
                    organization: product.organization,
                    productId: product.name
                }
            }))
        }];
    }

    getUniverseMenu (products) {
        return [{
            name: "dedicatedServers",
            title: this.$translate.instant("navigation_left_dedicatedServers"),
            subLinks: this.getDedicatedServersMenu(products.dedicatedServers)
        }, {
            name: "dedicatedClouds",
            title: this.$translate.instant("navigation_left_dedicatedClouds"),
            subLinks: this.getDedicatedCloudsMenu(products.dedicatedClouds)
        }, {
            name: "networks",
            title: this.$translate.instant("navigation_left_nas_and_cdn"),
            subLinks: this.getNetworksMenu(products.networks)
        }, {
            name: "licences",
            title: this.$translate.instant("navigation_left_licences"),
            state: "app.license.dashboard"
        }, {
            name: "ip",
            title: this.$translate.instant("navigation_left_ip"),
            state: "app.ip"
        },
        this.featureAvailability.hasExchange() && {
            name: "microsoft",
            title: this.$translate.instant("navigation_left_microsoft"),
            subLinks: this.getMicrosoftMenu(products.microsoft)
        }];
    }

    getAssistanceMenu (currentUser) {
        const currentSubsidiaryURLs = this.constants.urls[currentUser.ovhSubsidiary];
        const assistanceMenu = [];

        // Guides (External)
        if (_(currentSubsidiaryURLs).has("guides.home")) {
            assistanceMenu.push({
                title: this.$translate.instant("otrs_menu_all_guides"),
                url: currentSubsidiaryURLs.guides.home,
                isExternal: true
            });
        }

        // New ticket
        assistanceMenu.push({
            title: this.$translate.instant("otrs_menu_new_ticket"),
            click: (callback) => {
                if (!this.otrsPopupService.isLoaded()) {
                    this.otrsPopupService.init();
                } else {
                    this.otrsPopupService.toggle();
                }

                if (_.isFunction(callback)) {
                    callback();
                }
            }
        });

        // Tickets list
        assistanceMenu.push({
            title: this.$translate.instant("otrs_menu_list_ticket"),
            state: "app.account.otrs-ticket"
        });

        // Telephony (External)
        if (_(currentSubsidiaryURLs).has("support_contact") && this.constants.target !== "US") {
            assistanceMenu.push({
                title: this.$translate.instant("otrs_menu_telephony_contact"),
                url: currentSubsidiaryURLs.support_contact,
                isExternal: true
            });
        }

        return {
            name: "assistance",
            title: this.$translate.instant("otrs_menu_assistance"),
            iconClass: "icon-assistance",
            subLinks: assistanceMenu
        };
    }

    getLanguageMenu () {
        const currentLanguage = _(this.LANGUAGES).find({ value: this.$translate.use() });

        return {
            name: "languages",
            label: _(currentLanguage).get("name"),
            "class": "oui-navbar-menu_language",
            title: _(currentLanguage).get("value").split("_")[0].toUpperCase(),
            headerTitle: this.$translate.instant("global_language"),
            subLinks: _(this.LANGUAGES)
                .filter((language) => _(language).has("name", "value"))
                .map((language) => ({
                    title: language.name,
                    isActive: language.value === currentLanguage.value,
                    click: (callback) => {
                        localStorage["univers-selected-language"] = language.value;
                        window.location.reload();

                        if (_.isFunction(callback)) {
                            callback();
                        }
                    },
                    lang: _(language.value).chain()
                        .words()
                        .head()
                        .value()
                }))
                .value()
        };
    }

    getUserMenu (currentUser) {
        return {
            name: "user",
            title: currentUser.firstName,
            iconClass: "icon-user",
            nichandle: currentUser.nichandle,
            fullName: `${currentUser.firstName} ${currentUser.lastName}`,
            subLinks: [
                // My Account
                {
                    name: "user.account",
                    title: this.$translate.instant("menu_account_title"),
                    state: "app.account.useraccount.infos",
                    subLinks: [{
                        title: this.$translate.instant("menu_infos"),
                        state: "app.account.useraccount.infos"
                    }, {
                        title: this.$translate.instant("menu_security"),
                        state: "app.account.useraccount.security"
                    },
                    (this.constants.target === "EU" || this.constants.target === "CA") && {
                        title: this.$translate.instant("menu_emails"),
                        state: "app.account.useraccount.emails"
                    }, {
                        title: this.$translate.instant("menu_ssh"),
                        state: "app.account.useraccount.ssh"
                    }, {
                        title: this.$translate.instant("menu_advanced"),
                        state: "app.account.useraccount.advanced"
                    }, {
                        title: this.$translate.instant("menu_users_management"),
                        state: "app.account.useraccount.users"
                    }]
                },

                // Billing
                !currentUser.isEnterprise && {
                    name: "user.billing",
                    title: this.$translate.instant("menu_billing"),
                    state: "app.account.billing.history",
                    subLinks: [{
                        title: this.$translate.instant("menu_bills"),
                        state: "app.account.billing.history"
                    }, {
                        title: this.$translate.instant("menu_payments"),
                        state: "app.account.billing.payments"
                    }]
                },

                // Services
                (this.constants.target === "EU" || this.constants.target === "CA") && (!currentUser.isEnterprise ? {
                    name: "user.services",
                    title: this.$translate.instant("menu_services"),
                    state: "app.account.service.billing.autoRenew",
                    subLinks: [{
                        title: this.$translate.instant("menu_services_management"),
                        state: "app.account.service.billing.autoRenew"
                    }, {
                        title: this.$translate.instant("menu_agreements"),
                        state: "app.account.service.useraccount.agreements"
                    }]
                } : {
                    title: this.$translate.instant("menu_agreements"),
                    state: "app.account.service.useraccount.agreements"
                }),

                // Payment
                !currentUser.isEnterprise && {
                    name: "user.payment",
                    title: this.$translate.instant("menu_means"),
                    state: "app.account.payment.mean",
                    subLinks: [{
                        title: this.$translate.instant("menu_means"),
                        state: "app.account.payment.mean"
                    },
                    (this.constants.target === "EU" || this.constants.target === "CA") && {
                        title: this.$translate.instant("menu_ovhaccount"),
                        state: "app.account.payment.ovhaccount"
                    },
                    (this.constants.target === "EU" || this.constants.target === "CA") && {
                        title: this.$translate.instant("menu_vouchers"),
                        state: "app.account.payment.vouchers"
                    }, {
                        title: this.$translate.instant("menu_refunds"),
                        state: "app.account.payment.refunds"
                    },
                    (this.constants.target === "EU") && {
                        title: this.$translate.instant("menu_fidelity"),
                        state: "app.account.payment.fidelity"
                    }, {
                        title: this.$translate.instant("menu_credits"),
                        state: "app.account.payment.credits"
                    }]
                },

                // Orders
                (!currentUser.isEnterprise && this.constants.target === "EU" && currentUser.ovhSubsidiary === "FR") && {
                    title: this.$translate.instant("menu_orders"),
                    state: "app.account.orders"
                },

                // Contacts
                (this.constants.target === "EU") && {
                    title: this.$translate.instant("menu_contacts"),
                    state: "app.account.useraccount.contacts.services"
                },

                // Tickets
                {
                    title: this.$translate.instant("menu_tickets"),
                    state: "app.account.otrs-ticket"
                },

                // Logout
                {
                    title: this.$translate.instant("global_logout"),
                    "class": "logout",
                    click: (callback) => {
                        this.ssoAuthentication.logout();

                        if (_.isFunction(callback)) {
                            callback();
                        }
                    }
                }
            ]
        };
    }

    loadTranslations () {
        this.$translatePartialLoader.addPart("components/sidebar-menu");
        this.$translatePartialLoader.addPart("components/sidebar-menu/account");
        this.$translatePartialLoader.addPart("components/ovh-angular-otrs");
        return this.$translate.refresh();
    }

    // Get managers links for main-links attribute
    getManagerLinks (products) {
        const currentUniverse = this.constants.UNIVERS;
        const managerUrls = this.constants.MANAGER_URLS;
        const managerNames = Object.keys(managerUrls);

        return _.map(managerNames, (managerName) => {
            const managerLink = {
                name: managerName,
                "class": managerName,
                title: this.$translate.instant(`universe_univers-${managerName}_name`),
                url: managerUrls[managerName],
                isPrimary: ["partners", "labs"].indexOf(managerName) === -1
            };

            if (products && managerName === currentUniverse) {
                managerLink.subLinks = this.getUniverseMenu(products);
            }

            return managerLink;
        });
    }

    // Get products and build responsive menu
    getResponsiveLinks () {
        return this.getProducts()
            .then((products) => this.getManagerLinks(products))
            .catch(() => this.getManagerLinks());
    }

    // Get navbar navigation and user infos
    getNavbar () {
        const managerUrls = this.constants.MANAGER_URLS;

        // Get base structure for the navbar
        const getBaseNavbar = (user, notificationsMenu) => {
            const baseNavbar = {
                // Set OVH Logo
                brand: {
                    label: this.$translate.instant("index_nav_bar_logo_alt"),
                    url: managerUrls.dedicated,
                    iconAlt: "OVH",
                    iconClass: "navbar-logo",
                    iconSrc: "images/navbar/icon-logo-ovh.svg"
                },

                // Set Manager Links
                managerLinks: this.getManagerLinks()
            };

            // Set Internal Links
            if (user) {
                baseNavbar.internalLinks = [
                    this.getLanguageMenu(), // Language
                    this.getAssistanceMenu(user), // Assistance
                    this.getUserMenu(user) // User
                ];
            }

            if (notificationsMenu.show) {
                baseNavbar.internalLinks.splice(1, 0, notificationsMenu);
            }

            return baseNavbar;
        };

        return this.$q.all({
            translate: this.loadTranslations(),
            user: this.user.getUser(),
            notifications: this.navbarNotificationService.getNavbarContent()
        })
            .then(({ user, notifications }) => getBaseNavbar(user, notifications))
            .catch(() => getBaseNavbar());
    }
}

angular.module("services")
    .service("SessionService", SessionService);
