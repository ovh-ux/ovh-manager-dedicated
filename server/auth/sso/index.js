import { auth, checkAuth } from "./sso.controller";
import { Router } from "express";

const router = new Router();

router.get("/", auth);
router.get("/check", checkAuth);

export default router;
