angular.module('App')
  .run((
    $q,
    $translate,
    atInternet,
    CdnDomain,
    constants,
    DedicatedCloud,
    ipFeatureAvailability,
    Nas,
    Products,
    SidebarMenu,
    User,
  ) => {
    function buildSidebarActions() {
      return $q.all({
        dedicatedOrder: User.getUrlOf('dedicatedOrder'),
        vrackOrder: User.getUrlOf('vrackOrder'),
        cloudProjectOrder: User.getUrlOf('cloudProjectOrder'),
      }).then((results) => {
        const actionsMenuOptions = [];

        actionsMenuOptions.push({
          id: 'order-pci-project-new',
          title: $translate.instant('sidebar_actions_menu_cloud_project'),
          icon: 'ovh-font ovh-font-public-cloud',
          href: results.cloudProjectOrder,
        });

        if (constants.target === 'EU') {
          actionsMenuOptions.push({
            id: 'order-nas',
            title: 'Nas',
            icon: 'ovh-font ovh-font-cloudnas',
            state: 'app.networks.nas.order',
          });
        }

        actionsMenuOptions.push({
          id: 'order-dedicated-server',
          title: $translate.instant('navigation_left_dedicatedServers'),
          icon: 'ovh-font ovh-font-server',
          href: results.dedicatedOrder,
          target: '_blank',
        });

        if (constants.target === 'US') {
          actionsMenuOptions.push({
            id: 'order-vrack',
            title: $translate.instant('navigation_left_vrack'),
            icon: 'ovh-font ovh-font-vRack',
            href: results.vrackOrder,
            target: '_blank',
          });
        }

        if (ipFeatureAvailability.allowIPFailoverAgoraOrder()) {
          actionsMenuOptions.push({
            id: 'order-additional-ip',
            title: $translate.instant('navigation_left_additional_ip'),
            icon: 'ovh-font ovh-font-ip',
            state: 'app.ip.agora-order',
          });
        }

        actionsMenuOptions.push({
          id: 'order-license',
          title: $translate.instant('navigation_left_licences'),
          icon: 'ovh-font ovh-font-certificate',
          state: 'app.license.order',
        });

        SidebarMenu.addActionsMenuItemClickHandler((id) => {
          atInternet.trackClick({
            name: id,
            type: 'action',
          });
        });

        return SidebarMenu.addActionsMenuOptions(actionsMenuOptions);
      });
    }

    function buildSidebar() {
      const dedicatedServersMenuItem = SidebarMenu.addMenuItem({
        name: 'dedicatedServers',
        title: $translate.instant('navigation_left_dedicatedServers'),
        allowSubItems: true,
        allowSearch: true,
        loadOnState: 'app.dedicated',
        icon: 'ovh-font ovh-font-server',
      });

      const dedicatedCloudsMenuItem = SidebarMenu.addMenuItem({
        name: 'dedicatedClouds',
        title: $translate.instant('navigation_left_dedicatedClouds'),
        allowSubItems: true,
        allowSearch: true,
        loadOnState: 'app.dedicatedClouds',
        icon: 'ovh-font ovh-font-dedicatedCloud',
      });


      let networksMenuItem;
      if (constants.target === 'EU') {
        networksMenuItem = SidebarMenu.addMenuItem({
          name: 'networks',
          title: $translate.instant('navigation_left_nas_and_cdn'),
          allowSubItems: true,
          allowSearch: true,
          loadOnState: 'app.networks',
          icon: 'ovh-font ovh-font-network',
        });
      }

      let microsoftItem;
      let exchangesItem;
      if (constants.target === 'CA') {
        microsoftItem = SidebarMenu.addMenuItem({
          title: $translate.instant('navigation_left_microsoft'),
          category: 'microsoft',
          icon: 'ms-Icon ms-Icon--WindowsLogo',
          allowSubItems: true,
          loadOnState: 'app.microsoft',
          allowSearch: true,
        });

        exchangesItem = SidebarMenu.addMenuItem({
          title: $translate.instant('navigation_left_exchange'),
          category: 'microsoft',
          icon: 'ms-Icon ms-Icon--ExchangeLogo',
          allowSubItems: true,
          loadOnState: 'app.microsoft.exchange',
        }, microsoftItem);
      }

      SidebarMenu.addMenuItem({
        name: 'licences',
        title: $translate.instant('navigation_left_licences'),
        loadOnState: 'app.license',
        state: 'app.license.dashboard',
        icon: 'ovh-font ovh-font-certificate',
      });

      SidebarMenu.addMenuItem({
        name: 'ip',
        title: $translate.instant('navigation_left_ip'),
        state: 'app.ip',
        icon: 'ovh-font ovh-font-ip',
      });

      if (constants.target === 'US') {
        SidebarMenu.addMenuItem({
          name: 'vrack',
          title: $translate.instant('navigation_left_vrack'),
          url: constants.vrackUrl,
          target: '_self',
          icon: 'ovh-font ovh-font-vRack',
        });
      }

      const productsPromise = Products.getProductsByType().then((products) => {
        const pending = [];

        if (products) {
          _.chain(products.dedicatedServers)
            .sortBy(elt => angular.lowercase(elt.displayName))
            .forEach((server) => {
              SidebarMenu.addMenuItem({
                title: server.displayName,
                state: server.type.toLowerCase() === 'housing' ? 'app.dedicated.housing' : 'app.dedicated.server',
                stateParams: {
                  productId: server.name,
                },
                icon: `ovh-font ovh-font-${server.type.toLowerCase()}`,
              }, dedicatedServersMenuItem);
            })
            .value();

          _.chain(products.dedicatedClouds)
            .sortBy(elt => angular.lowercase(elt.name))
            .forEach((pcc) => {
              const sidebarItem = SidebarMenu.addMenuItem({
                title: pcc.displayName,
                state: 'app.dedicatedClouds',
                stateParams: {
                  productId: pcc.name,
                },
                icon: `ovh-font ovh-font-${_.camelCase(pcc.type)}`,
                allowSubItems: true,
                onLoad: () => DedicatedCloud.getDatacenters(pcc.name).then(({ results }) => {
                  _.forEach(results, (result) => {
                    SidebarMenu.addMenuItem({
                      title: result.displayName,
                      state: 'app.dedicatedClouds.datacenter',
                      stateParams: {
                        productId: pcc.name,
                        datacenterId: result.id,
                      },
                    }, sidebarItem);
                  });
                }),
              }, dedicatedCloudsMenuItem);
            })
            .value();

          _.chain(products.networks)
            .filter(network => network.type === 'CDN' || network.type === 'NAS' || network.type === 'NASHA')
            .sortBy(elt => angular.lowercase(elt.name))
            .forEach((network) => {
              if (network.type === 'CDN' && constants.target === 'EU') {
                const sidebarItem = SidebarMenu.addMenuItem({
                  title: network.name,
                  state: 'app.networks.cdn.dedicated',
                  stateParams: {
                    productId: network.name,
                  },
                  icon: 'ovh-font ovh-font-cdn',
                  allowSubItems: true,
                  onLoad: () => CdnDomain.getDomains(network.name).then(({ results }) => {
                    _.forEach(results, (result) => {
                      SidebarMenu.addMenuItem({
                        title: result.displayName,
                        state: 'app.networks.cdn.dedicated.domain',
                        stateParams: {
                          productId: network.name,
                          domain: result.id,
                        },
                      }, sidebarItem);
                    });
                  }),
                }, networksMenuItem);
              } else if (constants.target === 'EU') {
                pending.push(Nas.getNas().then(({ results }) => {
                  _.forEach(results, (result) => {
                    SidebarMenu.addMenuItem({
                      title: result.displayName,
                      state: 'app.networks.nas.details',
                      stateParams: {
                        nasType: 'nas',
                        nasId: result.id,
                      },
                      icon: 'ovh-font ovh-font-cloudnas',
                    }, networksMenuItem);
                  });
                }));
              }
            })
            .value();

          /* eslint-disable no-nested-ternary */
          if (constants.target === 'CA') {
            _.chain(products.exchanges)
              .sortBy(elt => angular.lowercase(elt.name))
              .forEach((exchange) => {
                SidebarMenu.addMenuItem({
                  title: exchange.displayName || exchange.name,
                  state: exchange.type === 'EXCHANGE_PROVIDER' ? 'app.microsoft.exchange.provider' : exchange.type === 'EXCHANGE_DEDICATED' ? 'app.microsoft.exchange.dedicated' : 'app.microsoft.exchange.hosted',
                  stateParams: {
                    organization: exchange.organization,
                    productId: exchange.name,
                  },
                  icon: 'ms-Icon ms-Icon--ExchangeLogo',
                }, exchangesItem);
              })
              .value();
          }
          /* eslint-enable no-nested-ternary */
        }

        return $q.all(pending);
      });

      // SidebarMenu.loadDeferred cannot be used here since we use "two sidebars"
      // and they share the same Service ... it's hackish but hopefully temporary
      return productsPromise.then(() => {
        SidebarMenu.manageStateChange();
      });
    }

    const mainPromise = $translate
      .refresh()
      .then(() => buildSidebarActions())
      .then(() => buildSidebar());

    SidebarMenu.setInitializationPromise(mainPromise);
  });
