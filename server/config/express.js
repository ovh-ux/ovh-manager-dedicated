/**
 * Express configuration
 */

import compression from "compression";
import config from "./environment";
import errorHandler from "errorhandler";
import express from "express";
import favicon from "serve-favicon";
import fs from "fs";
import lusca from "lusca";
import methodOverride from "method-override";
import morgan from "morgan";
import path from "path";
import session from "express-session";

export default function (app) {
    const env = app.get("env");

    app.set("views", `${config.root}/server/views`);
    app.engine("html", require("ejs").renderFile);
    app.set("view engine", "html");

    app.use(compression());
    app.use(methodOverride());

    // Persist sessions with MongoStore / sequelizeStore
    // We need to enable sessions for passport-twitter because it's an
    // oauth 1.0 strategy, and Lusca depends on sessions
    app.use(session({
        secret: config.secrets.session,
        saveUninitialized: true,
        resave: false
    }));

    /**
     * Lusca - express server security
     * https://github.com/krakenjs/lusca
     */
    if (env !== "test" && env !== "development") {
        app.use(lusca({
            csrf: {
                angular: true
            },
            xframe: "SAMEORIGIN",
            hsts: {
                maxAge: 31536000, // 1 year, in seconds
                includeSubDomains: true,
                preload: true
            },
            xssProtection: true
        }));
    }

    if (env === "production") {
        app.use(favicon(path.join(config.root, "client", "favicon.ico")));
        app.use(express.static(app.get("appPath")));
        app.use(morgan("dev"));
    }

    if (env === "development") {
        app.use(require("connect-livereload")());
    }

    if (env === "development" || env === "test") {
        app.use(express.static(path.join(config.root, "client/app")));

        app.set("appPath", fs.realpathSync("client/app"));
        app.set("rootPath", "/");

        app.use("/assets", express.static(path.join(config.root, "client/assets")));
        app.use("/tmp", express.static(path.join(config.root, "tmp")));
        app.use("/client", express.static(path.join(config.root, "client")));
        app.use("/client/node_modules", express.static(path.join(config.root, "node_modules")));
        app.use("/dist", express.static(path.join(config.root, "dist")));
        app.use("/node_modules", express.static(path.join(config.root, "node_modules")));

        app.use(morgan("dev"));
        app.use(errorHandler()); // Error handler - has to be last
    }
}
