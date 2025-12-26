import { Router } from "express";
import { getEvent, createEvent } from './controllers'

const router = Router()

router.post('/', createEvent)
router.post('/:id', getEvent)

export default router