import { Router } from "express"
import { getTest } from "../controllers/test"
import { search, getPlay, getAct, listPlays } from "../controllers/shakespeare"

const router: Router = Router()

router.get("/test", getTest)

router.get("/shakespeare", search)

router.get("/shakespeare/list", listPlays)

router.post("/shakespeare/play", getPlay)

router.post("/shakespeare/act", getAct)

export default router