import config from "../config/environment";
import fs from "fs";
import path from "path";
import { Router } from "express";

const router = new Router();

if (config.env === "development") {

    let mocks = [];
    const normalizedPath = path.join(__dirname, "apiv6");
    fs.readdirSync(normalizedPath).forEach((file) => {
        const newMocks = require(`./apiv6/${file}`).default;
        if (Array.isArray(newMocks) && newMocks.length) {
            console.log(`[MOCKS] Subscribed mocks apiv6/${file}`);
            mocks = mocks.concat(newMocks);
        }
    });

    router.all("*", (req, res, next) => {
        let matchingMock;
        mocks.forEach((mock) => {
            if (matchingMock) {
                return;
            }

            if (mock.method !== req.method.toLowerCase()) {
                return;
            }

            if (!mock.pattern.test(req.path)) {
                return;
            }

            matchingMock = mock;
        });

        if (matchingMock) {
            const params = matchingMock.pattern.exec(req.path);
            matchingMock.handler(req, res, params);
            console.log(`[MOCK] ${req.method} ${req.path} ${res.statusCode}`);
        } else {
            next();
        }
    });
}

export default router;
