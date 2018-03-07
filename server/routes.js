/**
 * Main application routes
 */

import config from "./config/environment";
import errors from "./components/errors";
import path from "path";
import request from "request";

export default function (app) {

    // Auth
    app.use("/", require("./auth").default);

    if (config.proxy) {
        app.use((req, res) => {
            const headers = req.headers;
            const url = config.proxy.target + req.url;

            req.pipe(request({
                url,
                method: req.method,
                proxy: config.proxy.host,
                headers
            })).pipe(res);
        });
    }

    // APIv6
    app.use(/^\/(?:engine\/)?api(?:v6)?/, require("./mocks").default);
    app.use(/^\/(?:engine\/)?api(?:v6)?/, require("./proxy/apiv6").default);

    // APIv7
    app.use(/^\/(?:engine\/)?apiv7/, require("./proxy/apiv7").default);

    // 2API
    app.use(/^\/(?:engine\/)?2api/, require("./proxy/2api").default);

    // All undefined asset or api routes should return a 404
    app.route("/:url(api|auth|components|app|node_modules|bower_components|assets)/*").get(errors[404]);
}
