import { Router } from "express"
import { getTest } from "../controllers/test"
import { search, getPlay, getAct, listPlays, getSearchResult } from "../controllers/shakespeare"

const router: Router = Router()

router.get("/test", getTest)

router.get("/shakespeare/list", listPlays)

router.get("/shakespeare", search)

router.post("/shakespeare", getSearchResult)

router.post("/shakespeare/play", getPlay)

router.post("/shakespeare/act", getAct)

export default router