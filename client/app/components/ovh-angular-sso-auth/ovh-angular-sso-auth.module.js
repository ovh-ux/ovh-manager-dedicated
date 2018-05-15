angular
    .module("App")
    .constant("OVH_SSO_AUTH_LOGIN_URL", "/auth")
    .factory("serviceTypeInterceptor", () => ({
        request (config) {
            if (/^(\/?engine\/)?2api(\-m)?\//.test(config.url)) {
                config.url = config.url.replace(/^(\/?engine\/)?2api(\-m)?/, "");
                config.serviceType = "aapi";
            }

            if (/^apiv6\//.test(config.url)) {
                config.url = config.url.replace(/^apiv6/, "");
                config.serviceType = "apiv6";
            }

            if (/^apiv7\//.test(config.url)) {
                config.url = config.url.replace(/^apiv7/, "");
                config.serviceType = "apiv7";
            }

            return config;
        }
    }))
    .config((ssoAuthenticationProvider, $httpProvider, OVH_SSO_AUTH_LOGIN_URL, constants) => {
        ssoAuthenticationProvider.setLoginUrl(OVH_SSO_AUTH_LOGIN_URL);
        ssoAuthenticationProvider.setLogoutUrl(`${OVH_SSO_AUTH_LOGIN_URL}?action=disconnect`);

        if (!constants.prodMode) {
            ssoAuthenticationProvider.setUserUrl("/engine/apiv6/me");
        }

        ssoAuthenticationProvider.setConfig([
            {
                serviceType: "apiv6",
                urlPrefix: "/engine/apiv6"
            },
            {
                serviceType: "aapi",
                urlPrefix: "/engine/2api"
            },
            {
                serviceType: "apiv7",
                urlPrefix: "/engine/apiv7"
            }
        ]);

        $httpProvider.interceptors.push("serviceTypeInterceptor");
        $httpProvider.interceptors.push("ssoAuthInterceptor");
    });
