import express from "express";

const router = express.Router();

// router.use(/^\/cgi-bin\/crosslogin.cgi/, require("./sso").default);
router.use(/^\/auth/, require("./sso").default);

export default router;
