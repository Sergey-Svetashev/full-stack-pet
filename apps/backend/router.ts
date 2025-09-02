import { Router } from "oak/router.ts";
import { signUp, signIn, accessProcess } from "./controllers/authenticator.ts";

export const router = new Router();

router.get("/access-check", accessProcess);
router.post("/signup", signUp);
router.post("/signin", signIn);
