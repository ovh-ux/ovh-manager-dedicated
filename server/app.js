/**
 * Main application file
 */

import config from "./config/environment";
import express from "express";
import fs from "fs";
import spdy from "spdy";
import winston from "winston";

const options = {
    key: fs.readFileSync(`${__dirname}/certificate/server.key`),
    cert: fs.readFileSync(`${__dirname}/certificate/server.crt`)
};

// Setup server
const app = express();
const server = spdy.createServer(options, app);

require("./config/express").default(app);
require("./routes").default(app);

// Start server
function startServer () {
    app.set("etag", false);
    app.angularFullstack = server.listen(config.port, config.ip, () => {
        winston.info("Express server listening on %d, in %s mode", config.port, app.get("env"));
    });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
