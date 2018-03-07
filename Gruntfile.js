module.exports = function (grunt) {
    "use strict";

    function isProd () {
        return grunt.option("mode") === "prod" || grunt.option("type") !== undefined;
    }

    const _ = require("lodash");
    const assets = require("./Assets");
    const constants = require("./constants.config");

    const Async = require("async");
    const Http = require("http");
    const Https = require("https");
    const glob = require("glob");

    let mode = grunt.option("mode") || "dev";
    const basepath = grunt.option("base-path") || (isProd() ? "" : "../../");
    const target = grunt.option("target") || grunt.option("zone") || "EU";
    const targetsAvailable = ["EU", "CA", "US"];

    const filesJsModules = _.map(
        assets[target].modules,
        (module) => {
            const assetsModule = require(`./node_modules/${module}/Assets.js`);
            return {
                expand: true,
                cwd: `node_modules/${module}/src`,
                src: assetsModule.src.js.map((jsPath) => jsPath.replace("src/", "")),
                dest: "dist/client/app"
            };
        },
        []
    );

    function copyFromEachModules (properties, dest) {
        return _.map(assets[target].modules, (module) => {
            const assetsModule = require(`./node_modules/${module}/Assets.js`);

            return {
                expand: true,
                cwd: `./node_modules/${module}/src`,
                src: _(properties)
                    .map((property) => _.get(assetsModule, property))
                    .flatten()
                    .map((assetsPath) => assetsPath.replace("src/", ""))
                    .value(),
                dest
            };
        });
    }

    grunt.loadNpmTasks("grunt-newer");
    grunt.loadTasks("tasks");
    require("time-grunt")(grunt);

    require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        // Config
        pkg: grunt.file.readJSON("package.json"),
        bowerdir: "node_modules/@bower_components",
        builddir: "tmp",
        publicdir: "client/app",
        distdir: "dist/client", // put in dist/client dir to be ISO with new stack
        componentsdir: "client/app/components",
        serverdir: "server",

        // SWS
        swsProxyPath: "apiv6/",
        aapiPath: isProd() ? "/engine/2api/" : "engine/2api/",

        // Clean
        clean: {
            deleted: [],
            files: [
                "<%= builddir %>",
                "<%= distdir %>",
                "<%= componentsdir %>/ovh-utils-angular/",
                "<%= publicdir %>/index.html",
                "<%= publicdir %>/auth.html",
                "*.war"
            ],
            modules: (
                function () {
                // IIFE to get all files of all targets
                    const files = [];
                    _.forEach(targetsAvailable, (tgt) => {
                        _.forEach(assets[tgt].modules, (module) => {
                            const assetsModule = require(`./node_modules/${module}/Assets.js`);
                            files.push(assetsModule.src.js);
                            files.push(assetsModule.src.css);
                            files.push(assetsModule.src.html);
                            files.push(assetsModule.src.images);
                            files.push(assetsModule.resources.i18n);
                        });
                    });
                    return _.flatten(files);
                })()
        },
        env: {
            dev: {
                NODE_ENV: "development",
                ZONE: target,
                LOCAL_2API: grunt.option("local2API")
            }
        },
        express: {
            options: {
                port: 9000
            },
            dev: {
                options: {
                    script: "<%= builddir %>/server/app.js",
                    debug: false
                }
            }
        },
        open: {
            server: {
                url: "https://localhost:<%= express.options.port %>"
            }
        },

        eslint: {
            options: {
                quiet: true,
                fix: true,
                ignores: [
                    "<%= componentsdir %>/modal/**/*.js",
                    "server/**/*.js"
                ]
            },
            target: assets.src.js.filter((path) => {
                const toRemove = _.flatten(glob.sync("./node_modules/ovh-module-*/Assets.js").map((src) => require(src).src.js));

                return toRemove.indexOf(path) < 0;
            })
        },

        prettier_eslint: {
            dist: {
                files: assets.src.js.filter((path) => {
                    const toRemove = _.flatten(glob.sync("./node_modules/ovh-module-*/Assets.js").map((src) => require(src).src.js));

                    return toRemove.indexOf(path) < 0;
                }),
                dest: "."
            },
            options: {
                eslintConfig: require("./.eslintrc.js")
            }
        },

        // Concatenation
        concat: {
            dist: {
                files: {
                    "<%= builddir %>/js/app.js": ["<%= builddir %>/js/constants-*.js", "!<%= builddir %>/js/constants-login.js", assets.src.jsES6],
                    "<%= builddir %>/js/common.min.js": assets.common.js
                }
            }
        },

        // Obfuscate
        uglify: {
            dist: {
                files: {
                    "<%= distdir %>/js/app/bin/app.min.js": "<%= builddir %>/js/app.js"
                }
            },
            dev: {
                files: {
                    "<%= distdir %>/js/app/bin/app.min.js": "<%= builddir %>/js/app.js"
                }
            }
        },
        cssmin: {
            dist: {
                files: {
                    "<%= distdir %>/css/common.min.css": [
                        assets.common.css
                    ],
                    "<%= distdir %>/css/app.min.css": [
                        assets.src.css
                    ]
                }
            }
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= distdir %>/views/",
                        src: "**/*.html",
                        dest: "<%= distdir %>/views/"
                    }, {
                        expand: true,
                        cwd: "<%= distdir %>/",
                        src: "*.html",
                        dest: "<%= distdir %>/"
                    }
                ]
            }
        },
        babel: {
            options: {
                presets: ["es2015"]
            },
            modules: {
                files: filesJsModules
            },
            dist: {
                files: [{
                    expand: true,
                    src: assets.src.js,
                    dest: "dist"
                }]
            },
            server: {
                files: [{
                    expand: true,
                    src: assets.server.js,
                    dest: "<%= builddir %>"
                }]
            }
        },
        copy: {
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= builddir %>",
                        src: "*.html",
                        dest: "<%= publicdir %>/"
                    },
                    {
                        expand: true,
                        cwd: "<%= serverdir %>",
                        src: "certificate/**/*",
                        dest: "<%= builddir %>/server"
                    },
                    {
                        expand: true,
                        cwd: "node_modules/angular-i18n/",
                        src: "*.js",
                        dest: "<%= publicdir %>/resources/angular/i18n/"
                    },
                    {
                        expand: true,
                        cwd: "node_modules/@ovh-ux/ovh-utils-angular/bin/template/",
                        src: ["**/**.html", "**/**.css"],
                        dest: "<%= componentsdir %>/ovh-utils-angular/"
                    },
                    {
                        expand: true,
                        cwd: "nodes_modules/ovh-ui-kit-bs/dist/fonts",
                        src: ["**/*"],
                        dest: "<%= publicdir %>/css/fonts"
                    },
                    {
                        expand: true,
                        cwd: "<%= serverdir %>/mocks/apiv6",
                        src: "**",
                        dest: "<%= builddir %>/server/mocks/apiv6"
                    },
                    {
                        expand: true,
                        cwd: "node_modules/ovh-ui-kit/dist/icons/",
                        src: ["**"],
                        dest: "<%= publicdir %>/css/icons/"
                    },
                    {
                        expand: true,
                        cwd: "node_modules/ovh-angular-otrs/dist",
                        src: ["**/Messages_*_*.json"],
                        dest: "<%= publicdir %>/components/ovh-angular-otrs"
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= builddir %>/js/",
                        src: "common.min.js",
                        dest: "<%= distdir %>/js/app/bin/"
                    }, {
                        expand: true,
                        cwd: "node_modules/ovh-ui-kit-bs/dist/fonts",
                        src: ["**/*"],
                        dest: "<%= distdir %>/css/fonts"
                    }, {
                        expand: true,
                        cwd: "<%= publicdir %>/css/open-sans/",
                        src: "*",
                        dest: "<%= distdir %>/css/open-sans/"
                    }, {
                        expand: true,
                        cwd: "<%= bowerdir %>/ovh-angular-actions-menu/dist/",
                        src: "**/*.json",
                        dest: "<%= distdir %>/<%= bowerdir %>/ovh-angular-actions-menu/dist/"
                    }, {
                        expand: true,
                        cwd: "node_modules/ovh-manager-webfont/dist/fonts/",
                        src: "*",
                        dest: "<%= distdir %>/css/fonts/"
                    },
                    {
                        expand: true,
                        cwd: "<%= bowerdir %>/ovh-angular-sidebar-menu/dist/",
                        src: "**/*.json",
                        dest: "<%= distdir %>/<%= bowerdir %>/ovh-angular-sidebar-menu/dist/"
                    }, {
                        expand: true,
                        cwd: "node_modules/ovh-ui-kit/packages/oui-typography/fonts/source-sans-pro/",
                        src: "**/*",
                        dest: "<%= distdir %>/css/ovh-ui-kit/packages/oui-typography/fonts/source-sans-pro/"
                    }, {
                        expand: true,
                        cwd: "<%= publicdir %>/images/",
                        src: "**/**/*",
                        dest: "<%= distdir %>/images/"
                    }, {
                        expand: true,
                        cwd: "<%= publicdir %>/",
                        src: "**/*.html",
                        dest: "<%= distdir %>/"
                    }, {
                        expand: true,
                        cwd: "<%= builddir %>",
                        src: "*.html",
                        dest: "<%= distdir %>/"
                    }, {
                        expand: true,
                        cwd: "<%= publicdir %>/components/",
                        src: "**/*.json",
                        dest: "<%= distdir %>/components/"
                    }, {
                        expand: true,
                        cwd: "<%= publicdir %>/resources/i18n/",
                        src: "**/*.json",
                        dest: "<%= distdir %>/resources/i18n/"
                    }, {
                        expand: true,
                        cwd: "<%= publicdir %>/",
                        src: "**/Messages_*_*.json",
                        dest: "<%= distdir %>/"
                    }, {
                        expand: true,
                        cwd: "node_modules/font-awesome/fonts/",
                        src: "*",
                        dest: "<%= distdir %>/fonts/"
                    }, {
                        expand: true,
                        cwd: "node_modules/ovh-manager-webfont/dist/fonts/",
                        src: ["*.eot", "*.svg", "*.ttf", "*.woff", "*.woff2"],
                        dest: "<%= distdir %>/fonts/"
                    }, {
                        expand: true,
                        cwd: "node_modules/angular-i18n/",
                        src: "*.js",
                        dest: "<%= distdir %>/resources/angular/i18n/"
                    }, {
                        expand: true,
                        cwd: "node_modules/@ovh-ux/ovh-utils-angular/bin/template/",
                        src: ["**/**.html", "**/**.css"],
                        dest: "<%= distdir %>/components/ovh-utils-angular/"
                    }, {
                        expand: true,
                        cwd: "<%= bowerdir %>",
                        src: ["es5-shim/es5-shim.min.js", "json3/lib/json3.min.js"],
                        dest: "<%= distdir %>/js/"
                    }, {
                        expand: true,
                        cwd: "<%= bowerdir %>/ckeditor",
                        src: ["**"],
                        dest: "<%= distdir %>/<%= bowerdir %>/ckeditor"
                    }, {
                        expand: true,
                        cwd: "node_modules/ovh-ui-kit/dist/icons/",
                        src: ["**"],
                        dest: "<%= distdir %>/css/icons/"
                    }, {
                        expand: true,
                        cwd: "<%= bowerdir %>/intl-tel-input/build/img/",
                        src: ["**"],
                        dest: "<%= distdir %>/img/"
                    },
                    {
                        expand: true,
                        cwd: "node_modules",
                        src: ["**/Messages_*_*.json"],
                        dest: "<%= distdir %>/node_modules"
                    },
                    {
                        expand: true,
                        cwd: "node_modules/ovh-angular-otrs/dist",
                        src: ["**/Messages_*_*.json"],
                        dest: "<%= distdir %>/components/ovh-angular-otrs"
                    }
                ]
            },
            modules: {
                files: copyFromEachModules(["src.js", "src.html", "src.images", "resources.i18n", "src.css"], "client/app")
            }
        },

        // ejs to html
        template: {
            dist: {
                src: "<%= publicdir %>/index.ejs",
                dest: "<%= builddir %>/index.html",
                variables () {
                    return {
                        prodMode: mode === "prod",
                        basepath,
                        constants: grunt.file.expand([
                            `${grunt.config("builddir")}/js/constants-*.js`
                        ]),
                        commonJsFiles: grunt.file.expand(assets.common.js),
                        jsFiles: grunt.file.expand(assets.src.jsES6),
                        commonCss: grunt.file.expand(assets.common.css),
                        css: grunt.file.expand(assets.src.css),
                        target
                    };
                }
            }
        },

        // Less
        less: {
            development: {
                options: {
                    paths: ["client/app/css/less/", "node_modules", "node_modules/@bower_components/"],
                    plugins: [
                        require("less-plugin-remcalc")
                    ]
                },
                files: {
                    "client/app/css/main.css": "client/app/css/source.less"
                }
            }
        },

        // Sass
        sass: {
            options: {
                outputStyle: "expanded"
            },
            dist: {
                files: {
                    "client/app/css/main-scss.css": "client/app/css/**/*.scss"
                }
            }
        },


        // autoprefixer
        postcss: {
            options: {
                map: true,
                processors: [
                    require("autoprefixer")({ browsers: ["ie >= 10", "last 1 version", "safari >= 8", "ios_saf >= 8"] })
                ]
            },
            dist: {
                src: ["client/app/css/main.css"]
            }
        },

        // Constants
        ngconstant: {
            options: {
                deps: null
            },
            devApp: {
                options: {
                    name: "App",
                    deps: (
                        function () {
                        // IIFE to generate deps for all modules for this target only
                            const deps = [
                                "ovh-angular-proxy-request",
                                "ovh-angular-pagination-front",
                                "ovh-utils-angular",
                                "ui.bootstrap",
                                "ui.router",
                                "ngRoute",
                                "ngSanitize",
                                "ngMessages",
                                "controllers",
                                "services",
                                "filters",
                                "directives",
                                "Billing",
                                "UserAccount",
                                "ovh-angular-http",
                                "ui.utils",
                                "ovh-angular-q-allSettled",
                                "ovh-angular-swimming-poll",
                                "ovh-angular-export-csv",
                                "ng-at-internet",
                                "atInternetUiRouterPlugin",
                                "ovh-angular-user-pref",
                                "ovhBrowserAlert",
                                "ui.validate",
                                "ovh-angular-sso-auth",
                                "ovh-angular-sso-auth-modal-plugin",
                                "oui",
                                "ui.select",
                                "Module.ip",
                                "Module.license",
                                "Module.download",
                                "internationalPhoneNumber",
                                "ovh-angular-sidebar-menu",
                                "ovh-angular-otrs",
                                "pascalprecht.translate",
                                "chart.js",
                                "ovh-angular-responsive-tabs",
                                "ngCkeditor",
                                "Module.otrs"
                            ];
                            _.forEach(assets[target].modules, (module) => {
                                if (/^ovh-module\-([0-9a-zA-Z]+)$/.test(module)) {
                                    deps.push(`Module.${
                                        module.match(/^ovh-module\-([0-9a-zA-Z]+)$/)[1]}`);
                                } else {
                                    grunt.fail.warn(`Impossible to parse ${module}`);
                                }
                            });
                            return deps;
                        })(),
                    dest: "<%= builddir %>/js/constants-app.js"
                },
                constants: {
                    constants: {
                        prodMode: mode === "prod",
                        availableViewMode: {
                            views: ["simple", "expert"],
                            defaultViewMode: "simple"
                        },
                        swsProxyRootPath: "<%= swsProxyPath %>",
                        aapiRootPath: "<%= aapiPath %>",
                        target,
                        renew: constants[target].RENEW_URL,
                        loginUrl: constants[target].loginUrl,
                        urls: constants[target].URLS,
                        UNIVERS: constants[target].UNIVERS,
                        UNIVERSE: constants[target].UNIVERSE,
                        UNIVERSES: constants[target].UNIVERSES,
                        TOP_GUIDES: constants[target].TOP_GUIDES,
                        weatherMapUrl: constants[target].weatherMapUrl,
                        vmsUrl: constants[target].vmsUrl,
                        travauxUrl: constants[target].travauxUrl,
                        aapiHeaderName: "X-Ovh-Session",
                        changelog_url: constants[target].changelog_url,
                        publicCloudUrl: constants[target].publicCloudUrl,
                        vrackUrl: constants[target].vrackUrl,
                        nashaUrl: constants[target].nashaUrl,
                        MANAGER_URLS: constants[target].MANAGER_URLS,
                        NO_AUTORENEW_COUNTRIES: constants[target].NO_AUTORENEW_COUNTRIES
                    },
                    LANGUAGES: constants[target].LANGUAGES,
                    website_url: constants[target].website_url
                }
            },
            devUa: {
                options: {
                    name: "ovh-utils-angular",
                    dest: "<%= builddir %>/js/constants-ovh-utils-angular.js"
                },
                constants: {
                    target
                }
            },
            devBilling: {
                options: {
                    name: "Billing",
                    dest: "<%= builddir %>/js/constants-billing.js",
                    deps: [
                        "ovh-utils-angular",
                        "ngRoute",
                        "ngSanitize",
                        "ui.bootstrap",
                        "Billing.constants",
                        "Billing.services",
                        "Billing.controllers",
                        "Billing.directives",
                        "Billing.filters",
                        "ovh-angular-export-csv"
                    ]
                },
                constants: {
                    BILLING_BASE_URL: "account/billing/",
                    "Billing.constants": {
                        aapiRootPath: "<%= aapiPath %>",
                        swsProxyRootPath: "<%= swsProxyPath %>",
                        paymentMeans: ["bankAccount", "paypal", "creditCard", "deferredPaymentAccount"],
                        target
                    },
                    LANGUAGES: constants[target].LANGUAGES,
                    "Billing.URLS": {
                        renew: constants[target].billingRenew
                    }
                }
            },
            devUserAccount: {
                options: {
                    name: "UserAccount",
                    dest: "<%= builddir %>/js/constants-user.js",
                    deps: [
                        "ja.qr",
                        "ovh-utils-angular",
                        "UserAccount.services",
                        "UserAccount.controllers",
                        "UserAccount.directives",
                        "UserAccount.filters",
                        "ovhSignupApp"
                    ]
                },
                constants: {
                    "UserAccount.conf.BASE_URL": "account/user/",
                    "UserAccount.constants": {
                        aapiRootPath: "<%= aapiPath %>",
                        swsProxyRootPath: "<%= swsProxyPath %>",
                        target
                    },
                    LANGUAGES: constants[target].LANGUAGES,
                    CountryConstants: {
                        support: constants[target].URLS.support
                    },
                    AccountCreationURLS: constants[target].accountCreation
                }
            },

            /* [MODULE] */
            // ],
            distApp: {
                options: {
                    name: "App",
                    deps: (
                        function () {
                        // IIFE to generate deps for all modules for this target only
                            const deps = [
                                "ovh-angular-proxy-request",
                                "ovh-angular-pagination-front",
                                "ovh-utils-angular",
                                "ui.bootstrap",
                                "ui.router",
                                "ngRoute",
                                "ngSanitize",
                                "controllers",
                                "services",
                                "filters",
                                "directives",
                                "Billing",
                                "UserAccount",
                                "ovh-angular-http",
                                "ui.utils",
                                "ovh-angular-q-allSettled",
                                "ovh-angular-swimming-poll",
                                "ngMessages",
                                "ovh-angular-export-csv",
                                "ng-at-internet",
                                "atInternetUiRouterPlugin",
                                "ovh-angular-user-pref",
                                "ovhBrowserAlert",
                                "ui.validate",
                                "ovh-angular-sso-auth",
                                "ovh-angular-sso-auth-modal-plugin",
                                "oui",
                                "ui.select",
                                "ngRaven",
                                "Module.ip",
                                "Module.license",
                                "Module.download",
                                "internationalPhoneNumber",
                                "ovh-angular-sidebar-menu",
                                "ovh-angular-otrs",
                                "chart.js",
                                "ovh-angular-responsive-tabs",
                                "ngCkeditor",
                                "Module.otrs"
                            ];
                            _.forEach(assets[target].modules, (module) => {
                                if (/^ovh-module\-([0-9a-zA-Z]+)$/.test(module)) {
                                    deps.push(`Module.${
                                        module.match(/^ovh-module\-([0-9a-zA-Z]+)$/)[1]}`);
                                } else {
                                    grunt.fail.warn(`Impossible to parse ${module}`);
                                }
                            });
                            return deps;
                        })(),
                    dest: "<%= builddir %>/js/constants-app.js"
                },
                constants: {
                    constants: {
                        prodMode: mode === "prod",
                        availableViewMode: {
                            views: ["simple", "expert"],
                            defaultViewMode: "simple"
                        },
                        aapiRootPath: "<%= aapiPath %>",
                        target,
                        renew: constants[target].RENEW_URL,
                        loginUrl: constants[target].loginUrl,
                        urls: constants[target].URLS,
                        UNIVERS: constants[target].UNIVERS,
                        UNIVERSE: constants[target].UNIVERSE,
                        UNIVERSES: constants[target].UNIVERSES,
                        TOP_GUIDES: constants[target].TOP_GUIDES,
                        weatherMapUrl: constants[target].weatherMapUrl,
                        vmsUrl: constants[target].vmsUrl,
                        travauxUrl: constants[target].travauxUrl,
                        changelog_url: constants[target].changelog_url,
                        swsProxyRootPath: "<%= swsProxyPath %>",
                        aapiHeaderName: "X-Ovh-2api-Session",
                        publicCloudUrl: constants[target].publicCloudUrl,
                        vrackUrl: constants[target].vrackUrl,
                        nashaUrl: constants[target].nashaUrl,
                        MANAGER_URLS: constants[target].MANAGER_URLS,
                        NO_AUTORENEW_COUNTRIES: constants[target].NO_AUTORENEW_COUNTRIES
                    },
                    LANGUAGES: constants[target].LANGUAGES,
                    website_url: constants[target].website_url

                }
            },
            distUa: {
                options: {
                    name: "ovh-utils-angular",
                    dest: "<%= builddir %>/js/constants-ovh-utils-angular.js"
                },
                constants: {
                    target
                }
            },
            distBilling: {
                options: {
                    name: "Billing",
                    dest: "<%= builddir %>/js/constants-billing.js",
                    deps: [
                        "ovh-utils-angular",
                        "ngRoute",
                        "ngSanitize",
                        "ui.bootstrap",
                        "Billing.constants",
                        "Billing.services",
                        "Billing.controllers",
                        "Billing.directives",
                        "Billing.filters",
                        "ovh-angular-export-csv"
                    ]
                },
                constants: {
                    BILLING_BASE_URL: "account/billing/",
                    "Billing.constants": {
                        aapiRootPath: "<%= aapiPath %>",
                        swsProxyRootPath: "<%= swsProxyPath %>",
                        paymentMeans: ["bankAccount", "paypal", "creditCard", "deferredPaymentAccount"],
                        target
                    },
                    "Billing.URLS": {
                        renew: constants[target].billingRenew
                    }
                }
            },
            distUserAccount: {
                options: {
                    name: "UserAccount",
                    dest: "<%= builddir %>/js/constants-user.js",
                    deps: [
                        "ja.qr",
                        "ovh-utils-angular",
                        "UserAccount.services",
                        "UserAccount.controllers",
                        "UserAccount.directives",
                        "UserAccount.filters",
                        "ovhSignupApp"
                    ]
                },
                constants: {
                    "UserAccount.conf.BASE_URL": "account/user/",
                    "UserAccount.constants": {
                        aapiRootPath: "<%= aapiPath %>",
                        swsProxyRootPath: "<%= swsProxyPath %>",
                        target
                    },
                    LANGUAGES: constants[target].LANGUAGES,
                    CountryConstants: {
                        support: constants[target].URLS.support
                    },
                    AccountCreationURLS: constants[target].accountCreation
                }
            }

            /* [MODULE] */
        },

        xml2json: {
            files: assets.resources.i18n
        },

        replace: {
            dist: {
                src: ["<%= builddir %>/js/common.min.js"],
                overwrite: true,
                replacements: [
                    {
                        from: "//@ sourceMappingURL=jquery.min.map",
                        to: ""
                    }, {
                        from: "//# sourceMappingURL=angular.min.js.map",
                        to: ""
                    }, {
                        from: "//# sourceMappingURL=angular-route.min.js.map",
                        to: ""
                    }, {
                        from: "//# sourceMappingURL=angular-sanitize.min.js.map",
                        to: ""
                    }, {
                        from: "//# sourceMappingURL=angular-cookies.min.js.map",
                        to: ""
                    }, {
                        from: "//# sourceMappingURL=angular-messages.min.js.map",
                        to: ""
                    }, {
                        from: "//# sourceMappingURL=raven.min.js.map",
                        to: ""
                    }
                ]
            }/* ,
            version : {
                src          : "version.txt",
                dest         : "<%= distdir%>/",
                replacements : [
                    {
                        from : "VERSION",
                        to   : "<%= pkg.version %>"
                    },
                    {
                        from : "MNGR",
                        to   : "DEDICATED." + target.toUpperCase()
                    }
                ]
            }*/
        },

        protractor: {
            options: {
                configFile: "protractor.conf.js"
            },
            browser: {
                options: {
                    args: {
                        browser: grunt.option("browser") || "phantomjs",
                        suite: grunt.option("suite") || "full"
                    }
                }
            }
        },

        // Auto Build
        watch: {
            js: {
                files: assets.src.js,
                tasks: ["eslint", "newer:babel:dist", "clean:deleted", "template"],
                options: {
                    spawn: false
                }
            },
            html: {
                files: "src/**/*.html",
                tasks: ["newer:copy:dev"],
                options: {
                    spawn: false
                }
            },
            less: {
                files: assets.src.less,
                tasks: ["less", "postcss"],
                options: {
                    spawn: false
                }
            },
            sass: {
                files: "src/css/**/*.scss",
                tasks: ["sass"],
                options: {
                    spawn: false
                }
            },
            i18n: {
                files: assets.resources.i18n,
                tasks: ["newer:xml2json"]
            },
            template: {
                files: "<%= publicdir %>/index.ejs",
                tasks: ["template"]
            },
            all: {
                files: (
                    function () {
                        const files = [
                        // assets.src.css,
                            "src/**/*_flymake.js"
                        ];
                        _.forEach(assets[target].modules, (module) => {
                            const assetsModule = require(`./node_modules/${module}/Assets.js`);
                            _.forEach(assetsModule.src.js, (val) => {
                                files.push(`./node_modules/${module}/${val}`);
                                files.push(`!${val}`);
                            });
                            _.forEach(assetsModule.src.css, (val) => {
                                files.push(`./node_modules/${module}/${val}`);
                                files.push(`!${val}`);
                            });
                            _.forEach(assetsModule.src.html, (val) => {
                                files.push(`./node_modules/${module}/${val}`);
                                files.push(`!${val}`);
                            });
                            _.forEach(assetsModule.resources.i18n, (val) => {
                                files.push(`./node_modules/${module}/${val}`);
                                files.push(`!${val}`);
                            });
                        });
                        return _.flatten(files);
                    })(),
                tasks: "buildDev"
            }
        },

        // To release
        bump: {
            options: {
                pushTo: "origin",
                files: ["package.json"],
                updateConfigs: ["pkg"],
                commitFiles: ["-a"]
            }
        },

        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: "<%= distdir %>",
                    src: "**/*.js",
                    dest: "<%= distdir %>"
                }]
            }
        }

    });

    grunt.event.on("watch", (action, filepath, target) => {
        if (/\.js$/.test(filepath)) {
            if (action === "added" || action === "changed") {
                grunt.config("eslint.target", [filepath]);
                grunt.config("clean.deleted", []);
            } else {
                grunt.config("eslint.target", []);
                grunt.config("clean.deleted", [`<%= distdir %>/${filepath}`]);
            }
        }
    });

    function pingUrl (toPing, next) {
        let getter;
        grunt.verbose.writeln("ping url \"%s\"", toPing.url);

        if (/^https/.test(toPing.url)) {
            getter = Https;
        } else {
            getter = Http;
        }

        getter.get(toPing.url, (res) => {
            grunt.log.write(".");
            toPing.result = res.statusCode;
            if (res.statusCode === 301) {
                grunt.log.writeln(" ");
                grunt.log.warn("%s | \"%s\" -> %s", toPing.path, toPing.url, res.statusCode);
                grunt.log.warn(" please update to \"%s\"", res.headers.location);
            } else if (res.statusCode > 399) {
                grunt.log.writeln(" ");
                grunt.log.error("%s | \"%s\" -> %s", toPing.path, toPing.url, res.statusCode);
            }
            next();
        }).on("error", (e) => {
            grunt.log.writeln(" ");
            grunt.log.warn("%s | \"%s\" -> Error.", toPing.path, toPing.url);
            next(e);
        });
    }

    function deepSearchAndFollowLink (thing, result, path) {
        if (!result) {
            throw new Error("deepSearchAndFollowLink(): missing a ref to push url and path to check.");
        }
        if (!thing) {
            return null;
        }
        if (!path) {
            path = "";
        }

        switch (typeof thing) {
        case "string":
            if (/^https?:\/\//.test(thing) && !/\{\w+\}/.test(thing)) {
                result.push({ path, url: thing, result: null });
            }
            break;
        case "object":
            _.forEach(thing, (value, key) => {
                deepSearchAndFollowLink(value, result, [path, ".", key].join(""));
            });
            break;
        default:
            /* nothing to do */
            break;
        }

    }

    grunt.registerTask("checkUrlsInConstants", "ping all urls found in ./constants.config.js", function () {
        const constants = require("./constants.config.js");
        const linksToPing = [];
        const done = this.async();

        grunt.verbose.writeln("collect all url in constants.");
        deepSearchAndFollowLink(constants, linksToPing);
        grunt.log.writeln("%d urls collected.", linksToPing.length);

        grunt.log.writeln("ping of urls, please be patient:");
        Async.eachLimit(linksToPing, 100, pingUrl, (err) => {
            let errors;
            if (err) {
                grunt.log.error("Unable to ping all urls", err);
                return done(false);
            }

            errors = _.filter(linksToPing, (p) => !p.result || p.result > 399);
            grunt.log.writeln(" done.");
            grunt.log.ok("%d tested urls", linksToPing.length);
            if (errors && errors.length) {
                grunt.log.error("%d urls in error.", errors.length);
                return done(false);
            }
            done(true);
        });
    });

    grunt.registerTask("test", (target, option) => {
        if (target === "e2e") {

            // Check if it's a remote test
            if (process.env.E2E_BASE_URL && !/^https?:\/\/localhost/.test(process.env.E2E_BASE_URL)) {
                option = "remote";
            }

            if (option === "remote") {
                return grunt.task.run([
                    "protractor"
                ]);

            }

            return grunt.task.run([ // not implemented, plz use remote
                "buildDev",
                "protractor"
            ]);


        }
        return grunt.task.run([
            "eslint"/* ,
                "checkUrlsInConstants"*/
        ]);

    });

    grunt.registerTask("default", ["build"]);

    grunt.registerTask("jshintBabel", ["eslint", "babel"]);

    grunt.registerTask("buildProd", [
        "clean",
        "eslint",
        "ngconstant:distApp",
        "ngconstant:distUa",
        "ngconstant:distBilling",
        "ngconstant:distUserAccount",
        "babel",
        "ngAnnotate:dist",
        "copy:modules",
        "less",
        "sass",
        "postcss",
        "concat",
        "replace",
        "uglify",
        "cssmin",
        "xml2json",
        "template",
        "copy:dist",
        "htmlmin"
    ]);

    grunt.registerTask("buildDev", [
        "clean",
        "eslint",
        "ngconstant:devApp",
        "ngconstant:devUa",
        "ngconstant:devBilling",
        "ngconstant:devUserAccount",
        "babel",
        "ngAnnotate:dist",
        "copy:modules",
        "less",
        "sass",
        "postcss",
        "xml2json",
        "template",
        "copy:dev"
    ]);

    /*
     * --mode=prod
     * --mode=dev
     */
    grunt.registerTask("build", "Prod build", () => {

        if (!~targetsAvailable.indexOf(target)) {
            grunt.fail.warn(`Wrong target. Please choose one of them: ${targetsAvailable}`);
        }

        grunt.log.subhead(`You build in ${mode} mode`);
        grunt.log.subhead(`For target ${target}`);
        switch (mode) {
        case "dev":
            grunt.task.run("buildDev");
            break;
        case "prod":
            grunt.task.run("buildProd");
            break;
        default:
            grunt.verbose.or.write(`You try to build in a weird mode [${mode}]`).error();
            grunt.fail.warn("Please try with --mode=dev|prod");
        }
    });

    grunt.registerTask("serve", [
        "buildDev",
        "env:dev",
        "express:dev",
        "open",
        "watch"
    ]);

    /*
     * --type=patch
     * --type=minor
     * --type=major
     */
    grunt.registerTask("release", "Release", () => {
        const type = grunt.option("type");
        if (isProd()) {
            mode = "prod";
            grunt.task.run([`bump-only:${type}`, "bump-commit"]);
        } else {
            grunt.verbose.or.write(`You try to release in a weird version type [${type}]`).error();
            grunt.fail.warn("Please try with --type=patch|minor|major");
        }
    });

};
