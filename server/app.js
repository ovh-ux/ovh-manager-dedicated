/**
 * Main application file
 */

import chalk from "chalk";
import config from "./config/environment";
import express from "express";
import fs from "fs";
import spdy from "spdy";
import winston from "winston";

const ctx = new chalk.constructor({ level: 1 });

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
    app.angularFullstack = server.listen(config.port, config.ip, (err) => {
        if (err) {
            console.log(err);
            return process.exit(1);
        }
        winston.info("Express server listening on %d, in %s mode", config.port, app.get("env"));
        return console.log(ctx.black.bgGreen(" OPEN "), ctx.green(`https://localhost:${config.port}`));
    });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
