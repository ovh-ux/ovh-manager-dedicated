import ovhContacts from '@ovh-ux/ng-ovh-contacts';
import ovhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';
import ngOvhSsoAuthModalPlugin from '@ovh-ux/ng-ovh-sso-auth-modal-plugin';
import uiRouter from '@uirouter/angularjs';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';
import ngOvhProxyRequest from '@ovh-ux/ng-ovh-proxy-request';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';
import ngOvhWebUniverseComponents from '@ovh-ux/ng-ovh-web-universe-components';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import stepper from './components/stepper';
import config from './config/config';
import dedicatedCloudDasboard from './dedicatedCloud/dashboard/main';
import dedicatedCloudServicePack from './dedicatedCloud/servicePack';
import dedicatedCloudServicePackHome from './dedicatedCloud/servicePack/home';
import dedicatedCloudServicePackOption from './dedicatedCloud/servicePack/option';
import dedicatedUniverseComponents from './dedicatedUniverseComponents';
import resourceUpgrade from './dedicatedCloud/resource/upgrade';

angular
  .module('App', [
    stepper,
    resourceUpgrade,
    dedicatedCloudDasboard,
    dedicatedCloudServicePack,
    dedicatedCloudServicePackHome,
    dedicatedCloudServicePackOption,
    'ovh-angular-pagination-front',
    'ovh-utils-angular',
    'ui.bootstrap',
    'ui.router',
    'ngRoute',
    'ngSanitize',
    'ngMessages',
    'controllers',
    'services',
    'filters',
    'directives',
    'Billing',
    'UserAccount',
    'ui.utils',
    'ovh-angular-q-allSettled',
    'ovh-angular-export-csv',
    'ovh-angular-tail-logs',
    'ovhBrowserAlert',
    'ui.validate',
    ngAtInternet,
    ngAtInternetUiRouterPlugin,
    ngOvhApiWrappers,
    ngOvhHttp,
    ngOvhProxyRequest,
    ngOvhSsoAuth,
    ngOvhSsoAuthModalPlugin,
    ngOvhSwimmingPoll,
    ngOvhUserPref,
    ngOvhWebUniverseComponents,
    ngTranslateAsyncLoader,
    'oui',
    'ui.select',
    uiRouter,
    'Module.ip',
    'Module.license',
    'Module.download',
    'internationalPhoneNumber',
    'ovh-angular-sidebar-menu',
    'ovh-angular-otrs',
    'pascalprecht.translate',
    'chart.js',
    'ovh-angular-responsive-tabs',
    'ngCkeditor',
    'Module.otrs',
    dedicatedUniverseComponents,
    'xeditable',
    ovhPaymentMethod,
    ovhContacts,
    WEBPACK_ENV.region === 'eu' || WEBPACK_ENV.region === 'ca' ? 'Module.exchange' : undefined,
  ])
  .constant('constants', {
    aapiHeaderName: 'X-Ovh-Session',
    aapiRootPath: config.aapiRootPath,
    DEFAULT_LANGUAGE: config.constants.DEFAULT_LANGUAGE,
    FALLBACK_LANGUAGE: config.constants.FALLBACK_LANGUAGE,
    MANAGER_URLS: config.constants.MANAGER_URLS,
    prodMode: config.prodMode,
    REDIRECT_URLS: config.constants.REDIRECT_URLS,
    renew: config.constants.RENEW_URL,
    swsProxyRootPath: config.swsProxyRootPath,
    target: config.target,
    TOP_GUIDES: config.constants.TOP_GUIDES,
    travauxUrl: config.constants.travauxUrl,
    UNIVERS: config.constants.UNIVERS,
    urls: config.constants.URLS,
    vmsUrl: config.constants.vmsUrl,
    vrackUrl: config.constants.vrackUrl,
  })
  .constant('LANGUAGES', config.constants.LANGUAGES)
  .constant('website_url', config.constants.website_url)
  .config(/* @ngInject */(ovhProxyRequestProvider) => {
    ovhProxyRequestProvider.proxy('$http');
    ovhProxyRequestProvider.pathPrefix('apiv6');
  })
  .config(($locationProvider) => {
    $locationProvider.hashPrefix('');
  })
  .config((tmhDynamicLocaleProvider) => {
    tmhDynamicLocaleProvider.localeLocationPattern('resources/angular/i18n/angular-locale_{{locale}}.js');
  })
  .config((OvhHttpProvider, constants) => {
    _.set(OvhHttpProvider, 'rootPath', constants.swsProxyPath);
    _.set(OvhHttpProvider, 'clearCacheVerb', ['POST', 'PUT', 'DELETE']);
    _.set(OvhHttpProvider, 'returnSuccessKey', 'data'); // By default, request return response.data
    _.set(OvhHttpProvider, 'returnErrorKey', 'data'); // By default, request return error.data
  })
  .config(($urlServiceProvider) => {
    $urlServiceProvider.rules.otherwise('/configuration');
  })

/*= ========= AT-INTERNET ========== */
  .config((atInternetProvider, atInternetUiRouterPluginProvider, constants) => {
    const level2 = constants.target === 'US' ? '57' : '3';

    atInternetProvider.setEnabled(constants.prodMode && window.location.port.length <= 3);
    atInternetProvider.setDebug(!constants.prodMode);

    atInternetProvider.setDefaults({
      level2,
    });

    atInternetUiRouterPluginProvider.setTrackStateChange(constants.prodMode
      && window.location.port.length <= 3);
    atInternetUiRouterPluginProvider.addStateNameFilter(routeName => (routeName ? routeName.replace(/^app/, 'dedicated').replace(/\./g, '::') : ''));
  })
  .constant('REGEX', {
    ROUTABLE_BLOCK: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(\d|[1-2]\d|3[0-2]))$/,
    ROUTABLE_IP: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    ROUTABLE_BLOCK_OR_IP: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(\d|[1-2]\d|3[0-2]))?$/,
  })
  .config((BillingVantivConfiguratorProvider, BILLING_VANTIV) => {
    BillingVantivConfiguratorProvider.setScriptUrl(BILLING_VANTIV.SCRIPTS.PROD);
  })
  .run((ssoAuthentication, User) => {
    ssoAuthentication.login().then(() => User.getUser());
  })
  .run(($transitions, $rootScope, $state, constants) => {
    $rootScope.$on('$locationChangeStart', () => {
      delete $rootScope.isLeftMenuVisible; // eslint-disable-line
    });

    // manage restriction on billing section for enterprise account
    // see src/billing/billingApp.js for resolve restriction on billing states
    $transitions.onError({}, (transition) => {
      const error = transition.error();
      if (_.get(error, 'status') === 403 && _.get(error, 'code') === 'FORBIDDEN_BILLING_ACCESS') {
        $state.go('app.error', { error });
      }
    });

    _.set($rootScope, 'worldPart', constants.target);
  })
  .run(($location) => {
    const queryParams = $location.search();

    if (queryParams && queryParams.redirectTo) {
      $location.path(queryParams.redirectTo);
      delete queryParams.redirectTo;
      $location.search(queryParams);
    }
  })
  .run((storage) => {
    storage.setKeyPrefix('com.ovh.univers.dedicated.');
  })
  .run((zendesk) => {
    zendesk.init();
  })
  .factory('translateInterceptor', ($q) => {
    const regexp = new RegExp(/Messages\w+\.json$/i);
    return {
      responseError(rejection) {
        if (regexp.test(rejection.config.url)) {
          return {};
        }
        return $q.reject(rejection);
      },
    };
  })
  .factory('translateMissingTranslationHandler', $sanitize => function missingTranslationHandler(translationId) {
    // Fix security issue: https://github.com/angular-translate/angular-translate/issues/1418
    return $sanitize(translationId);
  })
  .config((LANGUAGES, $translateProvider, constants) => {
    let defaultLanguage = constants.DEFAULT_LANGUAGE;

    // if there is a stored language value, be sure it's a valid one
    if (localStorage['univers-selected-language'] && _.find(LANGUAGES, { value: localStorage['univers-selected-language'] })) {
      defaultLanguage = localStorage['univers-selected-language'];
    } else {
      localStorage['univers-selected-language'] = defaultLanguage;
    }

    $translateProvider.useLoader('asyncLoader');
    $translateProvider.useMissingTranslationHandler('translateMissingTranslationHandler');
    $translateProvider.useLoaderCache(true);
    $translateProvider.useSanitizeValueStrategy('sceParameters');

    $translateProvider.preferredLanguage(defaultLanguage);
    $translateProvider.use(defaultLanguage);
    $translateProvider.fallbackLanguage(constants.FALLBACK_LANGUAGE);
  })
  .config(($transitionsProvider, $httpProvider) => {
    $httpProvider.interceptors.push('translateInterceptor');
  })
  .config(($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  })
  .config((OtrsPopupProvider, constants) => {
    OtrsPopupProvider.setBaseUrlTickets(_.get(constants, 'REDIRECT_URLS.listTicket', null));
  })
  .run(($translate) => {
    moment.locale(_.first($translate.use().split('_')));
  })
  .constant('UNIVERSE', 'DEDICATED');
