angular
    .module("Module.search")
    .constant("SEARCH_TARGET_URL", {
        "/cdn/dedicated/{serviceName}": {
            univers: "dedicated",
            url: "configuration/cdn/{serviceName}"
        },
        "/cloud/project/{serviceName}": {
            univers: "cloud",
            url: "iaas/pci/project/{serviceName}/compute/infrastructure/diagram"
        },
        "/dedicated/nas/{serviceName}": {
            univers: "dedicated",
            url: "configuration/nas/nas/nas_{serviceName}"
        },
        "/dedicated/nasha/{serviceName}": {
            univers: "dedicated",
            url: "configuration/nas/nas/nasha_{serviceName}"
        },
        "/domain/zone/{zoneName}": {
            univers: "web",
            url: "configuration/domain/{serviceName}"
        },
        "/hosting/web/{serviceName}": {
            univers: "web",
            url: "configuration/hosting/{serviceName}"
        },
        "/hosting/privateDatabase/{serviceName}": {
            univers: "web",
            url: "configuration/private_database/{serviceName}"
        },
        "/email/domain/{domain}": {
            univers: "web",
            url: "configuration/email-domain/{serviceName}"
        },
        "/email/pro/{service}": {
            univers: "web",
            url: "configuration/email_pro/{serviceName}"
        },
        "/license/office/{serviceName}": {
            univers: "web",
            url: "configuration/microsoft/office/license/{serviceName}"
        },
        "/dbaas/logs/{serviceName}": {
            univers: "cloud",
            url: "dbaas/logs/{serviceName}/home"
        },
        "/dedicated/housing/{serviceName}": {
            univers: "dedicated",
            url: "configuration/housing/{serviceName}"
        },
        "/dedicated/server/{serviceName}": {
            univers: "dedicated",
            url: "#/configuration/server/{serviceName}"
        },
        "/dedicatedCloud/{serviceName}": {
            univers: "dedicated",
            url: "#/configuration/dedicated_cloud/{serviceName}"
        },
        "/domain/{serviceName}": {
            univers: "web",
            url: "configuration/domain/{serviceName}"
        },
        "/ip/service/{serviceName}": {
            univers: "dedicated",
            url: "configuration/ip"
        },
        "/license/plesk/{serviceName}": {
            univers: "dedicated",
            url: "configuration/license/{serviceName}/detail"
        },
        "/license/windows/{serviceName}": {
            univers: "dedicated",
            url: "configuration/license/{serviceName}/detail"
        },
        "/license/sqlserver/{serviceName}": {
            univers: "dedicated",
            url: "configuration/license/{serviceName}/detail"
        },
        "/license/virtuozzo/{serviceName}": {
            univers: "dedicated",
            url: "configuration/license/{serviceName}/detail"
        },
        "/license/worklight/{serviceName}": {
            univers: "dedicated",
            url: "configuration/license/{serviceName}/detail"
        },
        "/license/cpanel/{serviceName}": {
            univers: "dedicated",
            url: "configuration/license/{serviceName}/detail"
        },
        "/license/directadmin/{serviceName}": {
            univers: "dedicated",
            url: "configuration/license/{serviceName}/detail"
        },
        "/license/cloudlinux/{serviceName}": {
            univers: "dedicated",
            url: "configuration/license/{serviceName}/detail"
        },
        "/pack/xdsl/{packName}": {
            univers: "telecom",
            url: "pack/{serviceName}"
        },
        "/telephony/{billingAccount}": {
            univers: "telecom",
            url: "telephony/{serviceName}"
        },
        "/telephony/lines/{serviceName}": {
            univers: "telecom"
        },
        "/sms/{serviceName}": {
            univers: "telecom",
            url: "sms/{serviceName}"
        },
        "/freefax/{serviceName}": {
            univers: "telecom",
            url: "freefax/{serviceName}"
        },
        "/overTheBox/{serviceName}": {
            univers: "telecom",
            url: "overTheBox/{serviceName}/details"
        },
        "/vps/{serviceName}": {
            univers: "cloud",
            url: "iaas/vps/{serviceName}/dashboard"
        },
        "/vrack/{serviceName}": {
            univers: "cloud",
            url: "vrack/{serviceName}"
        },
        "/deskaas/{serviceName}": {
            univers: "cloud",
            url: "deskaas/{serviceName}"
        }
    })
    .constant("SEARCH_MAPPING_API_ENDPOINTS", {
        /* "/domain/{serviceName}": {
            queryUrl: "apiv6/domain/{serviceName}",
            tplRouteParams: "parentService",
            univers: "web",
            url: "configuration/all_dom/{parentService}/{serviceName}?tab=GENERAL_INFORMATIONS"
        },*/
        "/email/exchange/{organizationName}/service/{exchangeService}": {
            queryUrl: "apiv7/email/exchange/*/service/{serviceName}?$aggreg=1",
            tplRoute: "email/exchange\/(.+)\/service",
            tplRouteParams: "organizationName",
            univers: "web",
            url: "configuration/exchange_{value.offer}/{organizationName}/{serviceName}?tab=INFORMATION",
            urlParams: "value.offer"
        },
        "/msServices/sharepoint/{domain}": {
            queryUrl: "apiv7/msServices/*/sharepoint?$aggreg=1",
            tplRoute: "msServices\/(.+)\/sharepoint",
            tplRouteParams: "organizationName",
            univers: "web",
            url: "configuration/sharepoint/{organizationName}/{serviceName}"
        },
        "/telephony/lines/{serviceName}": {
            queryUrl: "apiv7/telephony/*/line/{serviceName}?$aggreg=1",
            tplRoute: "telephony\/(.+)\/line",
            tplRouteParams: "billingAccount",
            univers: "telecom",
            url: "telephony/{billingAccount}/line/{serviceName}"
        },
        "/telephony/aliases/{serviceName}": {
            queryUrl: "apiv7/telephony/*/number/{serviceName}?$aggreg=1",
            tplRoute: "telephony\/(.+)\/number",
            tplRouteParams: "billingAccount",
            univers: "telecom",
            url: "telephony/{billingAccount}/alias/{serviceName}"
        },
        "/telephony/trunks/{serviceName}": {
            queryUrl: "apiv7/telephony/*/trunk/{serviceName}?$aggreg=1",
            tplRoute: "telephony\/(.+)\/trunk",
            tplRouteParams: "billingAccount",
            univers: "telecom",
            url: "telephony/{billingAccount}/line/{serviceName}"
        }
    });
