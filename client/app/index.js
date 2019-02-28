/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved, import/extensions */
import 'babel-polyfill';
import 'script-loader!../assets/randexp.min.js';
import 'script-loader!moment/min/moment-with-locales.min.js';
import 'script-loader!jquery/dist/jquery.min.js';
import 'script-loader!es6-shim/es6-shim.min.js';
import 'script-loader!components-jqueryui/ui/minified/version.js';
import 'script-loader!components-jqueryui/ui/minified/plugin.js';
import 'script-loader!components-jqueryui/ui/minified/widget.js';
import 'script-loader!components-jqueryui/ui/minified/data.js';
import 'script-loader!components-jqueryui/ui/minified/scroll-parent.js';
import 'script-loader!components-jqueryui/ui/minified/safe-active-element.js';
import 'script-loader!components-jqueryui/ui/minified/safe-blur.js';
import 'script-loader!components-jqueryui/ui/widgets/mouse.js';
import 'script-loader!components-jqueryui/ui/widgets/sortable.js';
import 'script-loader!components-jqueryui/ui/widgets/draggable.js';
import 'angular';
import 'angular-xeditable';
import 'script-loader!ovh-ui-angular/dist/oui-angular.min.js';
import 'angular-route';
import 'angular-sanitize';
import 'angular-cookies';
import 'angular-messages';
import 'script-loader!@bower_components/lodash/lodash.min.js';
import 'script-loader!../assets/scrollTo.min.js';
import 'script-loader!jquery.cookie/jquery.cookie.js';
import 'bootstrap';
import 'angular-ui-bootstrap';
import 'script-loader!@bower_components/bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js';
import 'script-loader!@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.de.js';
import 'script-loader!@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.es.js';
import 'script-loader!@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.fr.js';
import 'script-loader!@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.it.js';
import 'script-loader!@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.lt.js';
import 'script-loader!@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.nl.js';
import 'script-loader!@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.pl.js';
import 'script-loader!@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.pt.js';
import 'script-loader!@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.sk.js';
import 'script-loader!@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.fi.js';
import 'script-loader!@bower_components/bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.cs.js';
import 'script-loader!@bower_components/angular-scroll-glue/src/scrollglue.js';
import 'ovh-angular-tail-logs';
import 'raphael';
import 'script-loader!angular-dynamic-locale/dist/tmhDynamicLocale.js';
import 'script-loader!@ovh-ux/ovh-utils-angular/bin/ovh-utils-angular.min.js';
import 'script-loader!@ovh-ux/ovh-utils-angular/lib/core.js';
import 'script-loader!punycode/punycode.js';
import 'script-loader!urijs/src/URI.min.js';
import 'script-loader!ipaddr.js/ipaddr.min.js';
import 'ovh-angular-pagination-front';
import 'ovh-angular-q-allsettled';
import 'script-loader!validator/validator.min.js';
import 'script-loader!@bower_components/angular-ui-utils/ui-utils.min.js';
import 'script-loader!df-tab-menu/build/df-tab-menu.min.js';
import 'ng-at-internet';
import 'at-internet-ui-router-plugin';
import 'script-loader!ovh-angular-export-csv/dist/ovh-angular-export-csv.min.js';
import 'script-loader!@bower_components/angular-ui-validate/dist/validate.min.js';
import 'script-loader!@bower_components/ovh-angular-browser-alert/dist/ovh-angular-browser-alert.js';
import 'script-loader!@bower_components/randexp/build/randexp.min.js';
import 'script-loader!ui-select/dist/select.min.js';
import 'angular-resource';
import 'script-loader!jsurl/lib/jsurl.js';
import 'script-loader!intl-tel-input/build/js/intlTelInput.min.js';
import 'script-loader!intl-tel-input/lib/libphonenumber/build/utils.js';
import 'script-loader!@bower_components/international-phone-number/releases/international-phone-number.min.js';
import 'script-loader!@bower_components/qrcode/lib/qrcode.js';
import 'angular-qr';
import 'script-loader!u2f-api-polyfill/u2f-api-polyfill.js';
import 'ovh-api-services';
import 'ovh-angular-toaster';
import 'script-loader!ovh-jquery-ui-draggable-ng/dist/ovh-jquery-ui-draggable-ng.min.js';
import 'script-loader!ovh-angular-sidebar-menu/dist/ovh-angular-sidebar-menu.min.js';
import 'angular-translate';
import 'script-loader!angular-translate/dist/angular-translate-loader-partial/angular-translate-loader-partial.min.js';
import 'ng-slide-down';
import 'ovh-angular-actions-menu';
import 'ovh-angular-responsive-popover';
import 'script-loader!matchmedia-ng/matchmedia-ng.js';
import 'angular-aria';
import 'script-loader!chart.js/dist/Chart.min.js';
import 'script-loader!angular-chart.js/dist/angular-chart.min.js';
import 'ovh-angular-responsive-tabs';
import 'script-loader!@bower_components/ckeditor/ckeditor.js';
import 'script-loader!@bower_components/ng-ckeditor/ng-ckeditor.js';
import 'script-loader!@bower_components/messenger/build/js/messenger.min.js';
import 'script-loader!flatpickr/dist/flatpickr.min.js';
import 'script-loader!filesize/lib/filesize.js';

// Ckeditor 4.x
import 'script-loader!ng-ckeditor/dist/ng-ckeditor';

import './app.less';
import './css/source.scss';
/* eslint-enable import/no-webpack-loader-syntax, import/no-unresolved, import/extensions */
