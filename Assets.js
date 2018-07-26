const glob = require("glob");
const _ = require("lodash");
module.exports = {
    src: {
        js: [
            "client/app/app.js",
            "client/app/app.controller.js",
            "client/app/**/*.app.js",
            "client/app/**/*.module.js",
            "client/app/**/*.routes.js",
            "client/app/components/**/*.module.js",
            "client/app/components/api/*.js",
            "client/app/components/**/**.js",
            "client/app/js/app/*.js",
            "client/app/account/**/*.js",
            "client/app/dedicated/**/*.js",
            "client/app/cdn/**/*.js",
            "client/app/dedicatedCloud/**/*.js",
            "client/app/double-authentication/**/*.js",
            "client/app/configuration/**/*.js",
            "client/app/user-contracts/**/*.js",
            "client/app/license/**/*.js",
            "client/app/download/**/*.js",
            "client/app/ip/**/*.js",
            "client/app/error/**/*.js"
        ].concat(
            _.flatten(glob.sync("./node_modules/ovh-module-*/Assets.js").map((src) => require(src).src.js))
        ),
        jsES6: [
            "dist/client/app/app.js",
            "dist/client/app/app.controller.js",
            "dist/client/app/**/*.app.js",
            "dist/client/app/**/*.module.js",
            "dist/client/app/**/*.routes.js",
            "dist/client/app/**/*.js",
            "dist/client/app/components/**/*.module.js",
            "dist/client/app/components/api/*.js",
            "dist/client/app/components/**/**.js",
            "dist/client/app/js/app/*.js",
            "dist/client/app/account/**/*.js",
            "dist/client/app/dedicated/**/*.js",
            "dist/client/app/cdn/**/*.js",
            "dist/client/app/dedicatedCloud/**/*.js",
            "dist/client/app/double-authentication/**/*.js",
            "dist/client/app/configuration/**/*.js",
            "dist/client/app/user-contracts/**/*.js",
            "dist/client/app/license/**/*.js",
            "dist/client/app/download/**/*.js",
            "dist/client/app/ip/**/*.js",
            "dist/client/app/error/**/*.js"
        ].concat(
            _.flatten(glob.sync("./node_modules/ovh-module-*/Assets.js").map((src) => require(src).src.js.map((src) => `dist/client/${src}`)))
        ),
        css: [
            "client/app/css/main.css",
            "client/app/css/main-scss.css",
            "client/app/css/main-v3.css",
            "client/app/dedicated/**/*.css",
            "client/app/dedicatedCloud/**/*.css",
            "client/app/user-contracts/**/*.css",
            "client/app/license/**/*.css",
            "client/app/ip/**/*.css",
            "client/app/css/user-account/main.css",
            "client/app/user-account/directives/checkboxSwitch/checkboxSwitch.css",
            "client/app/user-account/directives/sshkeySwitch/sshkeySwitch.css",
            "client/app/css/user-account/newAccountForm.css",
            "client/app/css/user-account/newSecuritySection.css",
            "client/app/css/billing/main.css"
        ].concat(
            _.flatten(glob.sync("./node_modules/ovh-module-*/Assets.js").map((src) => {
                return require(src).src.css;
            }))
        ),
        less: [
            "src/css/**/*.less"
        ]
    },
    server: {
        js: [
            "server/**/*.js"
        ]
    },
    EU: {
        // Note: you need to add to src.css too
        modules: [
            "ovh-module-exchange"
        ]
    },
    CA: {
        modules: [
            "ovh-module-exchange"
        ]
    },
    US: {
        modules: []
    },
    common: {
        js: [
            "assets/randexp.min.js",

            "node_modules/moment/min/moment-with-locales.min.js",
            "node_modules/jquery/dist/jquery.min.js",
            "node_modules/es6-shim/es6-shim.min.js",

            "node_modules/components-jqueryui/ui/minified/version.js",
            "node_modules/components-jqueryui/ui/minified/plugin.js",
            "node_modules/components-jqueryui/ui/minified/widget.js",
            "node_modules/components-jqueryui/ui/minified/data.js",
            "node_modules/components-jqueryui/ui/minified/scroll-parent.js",
            "node_modules/components-jqueryui/ui/minified/safe-active-element.js",
            "node_modules/components-jqueryui/ui/minified/safe-blur.js",
            "node_modules/components-jqueryui/ui/widgets/mouse.js",
            "node_modules/components-jqueryui/ui/widgets/sortable.js",
            "node_modules/components-jqueryui/ui/widgets/draggable.js",

            "node_modules/angular/angular.min.js",
            "node_modules/ovh-ui-angular/dist/oui-angular.min.js",
            "node_modules/angular-route/angular-route.min.js",
            "node_modules/angular-sanitize/angular-sanitize.js",
            "node_modules/angular-cookies/angular-cookies.min.js",
            "node_modules/angular-messages/angular-messages.min.js",
            "node_modules/@bower_components/angular-flash-alert/dist/angular-flash.min.js",
            "node_modules/@bower_components/lodash/lodash.min.js",

            "assets/scrollTo.min.js",

            "node_modules/jquery.cookie/jquery.cookie.js",

            "node_modules/bootstrap/dist/js/bootstrap.min.js",
            "node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
            "node_modules/@bower_components/bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js",
            "node_modules/@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.de.js",
            "node_modules/@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.es.js",
            "node_modules/@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.fr.js",
            "node_modules/@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.it.js",
            "node_modules/@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.lt.js",
            "node_modules/@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.nl.js",
            "node_modules/@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.pl.js",
            "node_modules/@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.pt.js",
            "node_modules/@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.sk.js",
            "node_modules/@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.fi.js",
            "node_modules/@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.cs.js",
            "node_modules/raphael/raphael-min.js",
            "node_modules/angular-dynamic-locale/dist/tmhDynamicLocale.js",
            "node_modules/@ovh-ux/ovh-utils-angular/bin/ovh-utils-angular.min.js",
            "node_modules/@ovh-ux/ovh-utils-angular/lib/core.js",
            "node_modules/punycode/punycode.min.js",
            "node_modules/urijs/src/URI.min.js",
            "node_modules/ipaddr.js/ipaddr.min.js",
            "node_modules/ovh-angular-pagination-front/dist/ovh-angular-pagination-front.min.js",
            "node_modules/ovh-angular-proxy-request/dist/ovh-angular-proxy-request.min.js",
            "node_modules/ovh-angular-q-allsettled/dist/ovh-angular-q-allsettled.min.js",
            "node_modules/ovh-angular-http/dist/ovh-angular-http.min.js",
            "node_modules/validator/validator.min.js",
            "node_modules/@bower_components/angular-ui-utils/ui-utils.min.js",
            "node_modules/df-tab-menu/build/df-tab-menu.min.js",
            "node_modules/ovh-angular-swimming-poll/dist/ovh-angular-swimming-poll.min.js",
            "node_modules/at-internet-smarttag-manager/dist/smarttag.js",
            "node_modules/ng-at-internet/dist/ng-at-internet.min.js",
            "node_modules/at-internet-ui-router-plugin/dist/at-internet-ui-router-plugin.min.js",
            "node_modules/ovh-angular-export-csv/dist/ovh-angular-export-csv.min.js",
            "node_modules/@bower_components/angular-ui-validate/dist/validate.min.js",
            "node_modules/ovh-angular-user-pref/dist/ovh-angular-user-pref.min.js",
            "node_modules/@bower_components/ovh-angular-browser-alert/dist/ovh-angular-browser-alert.js",
            "node_modules/@bower_components/randexp/build/randexp.min.js",
            "node_modules/ovh-angular-sso-auth/dist/ovh-angular-sso-auth.min.js",
            "node_modules/ovh-angular-sso-auth-modal-plugin/dist/ovh-angular-sso-auth-modal-plugin.min.js",
            "node_modules/raven-js/dist/raven.min.js",
            "node_modules/raven-js/dist/plugins/angular.min.js",
            "node_modules/ovh-ng-raven-config/dist/ovh-ng-raven-config.min.js",
            "node_modules/ui-select/dist/select.min.js",
            "node_modules/angular-resource/angular-resource.min.js",
            "node_modules/jsurl/lib/jsurl.js",
            "node_modules/intl-tel-input/build/js/intlTelInput.min.js",
            "node_modules/intl-tel-input/lib/libphonenumber/build/utils.js",
            "node_modules/@bower_components/international-phone-number/releases/international-phone-number.min.js",
            "node_modules/@bower_components/qrcode/lib/qrcode.js",
            "node_modules/angular-qr/angular-qr.min.js",
            "node_modules/u2f-api-polyfill/u2f-api-polyfill.js",
            "node_modules/ovh-angular-otrs/dist/ovh-angular-otrs.min.js",
            "node_modules/ovh-angular-apiv7/dist/ovh-angular-apiv7.min.js",
            "node_modules/ovh-api-services/dist/ovh-api-services.min.js",
            "node_modules/ovh-angular-apiv7/dist/ovh-angular-apiv7.min.js",
            "node_modules/ovh-angular-toaster/dist/ovh-angular-toaster.min.js",
            "node_modules/ovh-jquery-ui-draggable-ng/dist/ovh-jquery-ui-draggable-ng.min.js",
            "node_modules/@bower_components/angular-ui-router/release/angular-ui-router.min.js",
            "node_modules/ovh-angular-sidebar-menu/dist/ovh-angular-sidebar-menu.min.js",
            "node_modules/angular-translate/dist/angular-translate.min.js",
            "node_modules/angular-translate/dist/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
            "node_modules/angular-translate/dist/angular-translate-loader-partial/angular-translate-loader-partial.min.js",
            "node_modules/@bower_components/ng-slide-down/dist/ng-slide-down.min.js",
            "node_modules/ovh-angular-actions-menu/dist/ovh-angular-actions-menu.min.js",
            "node_modules/ovh-angular-responsive-popover/dist/ovh-angular-responsive-popover.min.js",
            "node_modules/matchmedia-ng/matchmedia-ng.js",
            "node_modules/angular-aria/angular-aria.min.js",
            "node_modules/chart.js/dist/Chart.min.js",
            "node_modules/angular-chart.js/dist/angular-chart.min.js",
            "node_modules/ovh-angular-responsive-tabs/dist/ovh-angular-responsive-tabs.min.js",
            "node_modules/@bower_components/ckeditor/ckeditor.js",
            "node_modules/@bower_components/ng-ckeditor/ng-ckeditor.js",
            "node_modules/@bower_components/messenger/build/js/messenger.min.js",
            "node_modules/flatpickr/dist/flatpickr.min.js"
        ],
        css: [
            "node_modules/@bower_components/bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
            "node_modules/@ovh-ux/ovh-utils-angular/bin/template/contracts/contracts.css",
            "node_modules/@ovh-ux/ovh-utils-angular/bin/template/tooltipBox/*.css",
            "node_modules/@ovh-ux/ovh-utils-angular/bin/template/dateTimePicker/bootstrap-datetimepicker.min.css",
            "node_modules/@ovh-ux/ovh-utils-angular/bin/template/contracts/*.css",
            "node_modules/@ovh-ux/ovh-utils-angular/bin/template/inputNumber/*.css",
            "node_modules/@ovh-ux/ovh-utils-angular/bin/template/wizard/wizardStep/*.css",
            "node_modules/pagination-front/dist/pagination-front.min.css",
            "node_modules/font-awesome/css/font-awesome.min.css",
            "node_modules/ovh-manager-webfont/dist/css/ovh-font.css",
            "node_modules/animate.css/animate.min.css",
            "node_modules/ovh-angular-sso-auth-modal-plugin/dist/ovh-angular-sso-auth-modal-plugin.min.css",
            "node_modules/ui-select/dist/select.min.css",
            "node_modules/intl-tel-input/build/css/intlTelInput.css",
            "node_modules/ovh-angular-toaster/dist/ovh-angular-toaster.min.css",
            "node_modules/flatpickr/dist/flatpickr.min.css"
        ]
    },
    resources: {
        i18n: [
            "client/app/**/translations/*.xml"
        ]
    }
};
