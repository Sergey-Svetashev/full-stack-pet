import { Router } from "https://deno.land/x/oak@v13.2.3/router.ts";
import * as Content from './controllers/content.ts'

export const router = new Router();

router.get("/get", Content.getMain);

router.post("/add", Content.createFile);