import { Router } from "express";
import { getEvent, createEvent } from './controllers'
import verifyHMAC from "./verifyHMAC";

const router = Router()

router.get("/health", (_req, res) => {
    return res.status(200).json({status : "ok"})
})
router.post('/', verifyHMAC,createEvent)
router.get('/', getEvent)

export default router