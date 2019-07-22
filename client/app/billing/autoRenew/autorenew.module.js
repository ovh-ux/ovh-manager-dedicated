import agreements from './agreements/user-agreements.module';
import cancelResiliation from './actions/cancel-resiliation/cancel-resiliation.module';
import debtBeforePaying from './actions/debtBeforePaying/debtBeforePaying.module';
import deleteModule from './actions/delete/delete.module';
import exchangeRenew from './actions/exchange/exchange-renew.module';
import ssh from './ssh/ssh.module';
import terminateEmail from './actions/terminateEmail/email.module';
import terminateHostingWeb from './actions/terminateHostingWeb/hosting-web.module';
import terminatePrivateDatabase from './actions/terminatePrivateDatabase/private-database.module';
import update from './actions/update/update.module';
import warnNicBilling from './actions/warnNicBilling/warnNicBilling.module';
import warnPendingDebt from './actions/warnPendingDebt/pending-debt.module';

import service from './billing-autoRenew.service';

import routing from './autorenew.routing';

const moduleName = 'ovhManagerBillingAutorenew';

angular.module(moduleName, [
  'ui.router',
  agreements,
  cancelResiliation,
  debtBeforePaying,
  deleteModule,
  exchangeRenew,
  ssh,
  terminateEmail,
  terminateHostingWeb,
  terminatePrivateDatabase,
  update,
  warnNicBilling,
  warnPendingDebt,
])
  .config(routing)
  .service('BillingAutoRenew', service);

export default moduleName;