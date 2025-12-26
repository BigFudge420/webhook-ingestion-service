import { Router } from "express";
import { getEvent, createEvent } from './controllers'
import verifyHMAC from "./verifyHMAC";

const router = Router()

router.post('/', verifyHMAC,createEvent)
router.get('/', getEvent)

export default router