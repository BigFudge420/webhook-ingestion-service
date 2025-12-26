import { Router } from "express";
import { getEvent, createEvent } from './controllers'

const router = Router()

router.post('/', createEvent)
router.post('/', getEvent)

export default router