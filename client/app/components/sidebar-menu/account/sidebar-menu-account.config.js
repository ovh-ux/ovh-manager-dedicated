angular
  .module('App')
  .run(
    /* @ngInject */
    (
      $q,
      $rootScope,
      $translate,
      coreConfig,
      SidebarMenu,
      User,
    ) => {
      function buildMyAccountMenu() {
        SidebarMenu.addMenuItem({
          name: 'userAccountMenu',
          title: $translate.instant('menu_account_title'),
          allowSubItems: false,
          allowSearch: false,
          loadOnState: 'app.account.user',
          state: 'app.account.user.dashboard',
          namespace: 'account',
        });
      }

      function buildBillingMenu() {
        if (coreConfig.getRegion() === 'US') {
          SidebarMenu.addMenuItem({
            name: 'billingMenu',
            title: $translate.instant('menu_billing'),
            state: 'app.account.billing.main.pay-as-you-go',
            loadOnState: 'app.account.billing.main',
            namespace: 'account',
          });
        } else {
          SidebarMenu.addMenuItem({
            name: 'billingMenu',
            title: $translate.instant('menu_billing'),
            state: 'app.account.billing.main.history',
            namespace: 'account',
          });
        }
      }

      function buildServicesMenu(user) {
        SidebarMenu.addMenuItem({
          name: 'servicesMenu',
          title: $translate.instant('menu_services'),
          state: user.isEnterprise ? 'app.account.billing.autorenew.ssh' : 'app.account.billing.autorenew',
          namespace: 'account',
        });
      }

      function buildPaymentMenu() {
        return SidebarMenu.addMenuItem({
          name: 'paymentMenu',
          title: $translate.instant('menu_payment_methods'),
          state: 'app.account.billing.payment',
          namespace: 'account',
        });
      }

      function init() {
        $rootScope.$on('global_display_name_change', (evt, { displayName, serviceName }) => {
          SidebarMenu.updateItemDisplay(
            {
              title: displayName,
            },
            {
              stateParams: {
                productId: serviceName,
              },
            },
          );
        });

        return $q.all({
          translate: $translate.refresh(),
          user: User.getUser(),
        }).then((result) => {
          SidebarMenu.addMenuItem({
            name: 'billingBack',
            title: $translate.instant('menu_back'),
            state: 'app.configuration',
            namespace: 'account',
          });

          buildMyAccountMenu();

          // remove billing menu for accounts flagged as enterprise
          if (!result.user.isEnterprise) {
            buildBillingMenu();
          }
          buildServicesMenu(result.user);

          // remove payment menu and orders menu for accounts flagged as enterprise
          if (!result.user.isEnterprise) {
            buildPaymentMenu();

            SidebarMenu.addMenuItem({
              name: 'billingOrders',
              title: $translate.instant('menu_orders'),
              state: 'app.account.billing.orders',
              namespace: 'account',
            });
          }

          if (coreConfig.getRegion() === 'EU') {
            SidebarMenu.addMenuItem({
              name: 'billingContacts',
              title: $translate.instant('menu_contacts'),
              state: 'app.account.contacts.services',
              namespace: 'account',
            });
          }

          SidebarMenu.addMenuItem({
            name: 'accountTickets',
            title: $translate.instant('menu_tickets'),
            state: 'app.account.otrs-ticket',
            namespace: 'account',
          });
        });
      }

      init();
    },
  );
