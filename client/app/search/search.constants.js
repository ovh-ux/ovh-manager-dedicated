angular
    .module("Module.search")
    .constant("SEARCH_TARGET_URL", {
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
        "/email/pro/{service}": {
            univers: "web",
            url: "configuration/email_pro/{serviceName}"
        },
        "/license/office/{serviceName}": {
            univers: "web",
            url: "configuration/microsoft/office/license/{serviceName}"
        },
        "/dedicated/housing/{serviceName}": {
            univers: "dedicated",
            url: "configuration/housing/{serviceName}"
        },
        "/dedicated/server/{serviceName}": {
            univers: "dedicated",
            url: "configuration/server/{serviceName}"
        },
        "/dedicatedCloud/{serviceName}": {
            univers: "dedicated",
            url: "configuration/dedicated_cloud/{serviceName}"
        },
        "/license/plesk/{serviceName}": {
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
        }
    })
    .constant("SEARCH_MAPPING_API_ENDPOINTS", {
        "/domain/{serviceName}": {
            queryUrl: "apiv6/domain/{serviceName}",
            tplRouteParams: "parentService",
            univers: "web",
            url: "configuration/all_dom/{parentService}/{serviceName}?tab=GENERAL_INFORMATIONS"
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
