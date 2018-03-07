import * as _ from "lodash";
import path from "path";

const zone = process.env.ZONE || "EU";

// All configurations will extend these options
// ============================================
const all = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(`${__dirname}/../../../..`),

    // Server port
    port: process.env.PORT || 9000,

    // Server IP
    ip: process.env.IP || "0.0.0.0",

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: "manager-secret"
    },

    // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },

    // List of user roles
    userRoles: ["guest", "user", "admin"],

    // SDEV proxy config
    sdev: {
        nic: "",
        url: "",
        routes: [] // Routes to redirect to SDEV (can be a regex (eg.: [/^\/dedicated\/server\/\w+/]) or string)
    }

};

const zoneConfig = {
    EU: {
        ssoAuth: {
            host: "www.ovh.com",
            baseUrl: "https://www.ovh.com/cgi-bin/crosslogin.cgi",
            devLoginUrl: "https://www.ovh.com/auth/requestDevLogin/"
        },
        apiv6: {
            url: "https://www.ovh.com/engine/apiv6"
        },
        apiv7: {
            url: "https://www.ovh.com/engine/apiv7"
        },
        aapi: {
            url: process.env.LOCAL_2API === "true" ? "http://localhost:8080" : "https://www.ovh.com/engine/2api"
        }
    },
    CA: {
        ssoAuth: {
            host: "ca.ovh.com",
            baseUrl: "https://ca.ovh.com/cgi-bin/crosslogin.cgi",
            devLoginUrl: "https://ca.ovh.com/auth/requestDevLogin/"
        },
        apiv6: {
            url: "https://ca.ovh.com/engine/apiv6"
        },
        apiv7: {
            url: "https://ca.ovh.com/engine/apiv7"
        },
        aapi: {
            url: process.env.LOCAL_2API === "true" ? "http://localhost:8080" : "https://ca.ovh.com/engine/2api"
        }
    },
    US: {
        ssoAuth: {
            host: "ovhcloud.com",
            baseUrl: "https://ovhcloud.com/cgi-bin/crosslogin.cgi",
            devLoginUrl: "https://ovhcloud.com/auth/requestDevLogin/"
        },
        apiv6: {
            url: "https://ovhcloud.com/engine/apiv6"
        },
        apiv7: {
            url: "https://ovhcloud.com/engine/apiv7"
        },
        aapi: {
            url: process.env.LOCAL_2API === "true" ? "http://localhost:8080" : "https://ovhcloud.com/engine/2api"
        }
    }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
    { zone },
    zoneConfig[zone],
    require(`./${process.env.NODE_ENV}.js`) || {}
);
