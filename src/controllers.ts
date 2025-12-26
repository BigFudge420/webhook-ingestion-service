import { Request, Response, NextFunction } from "express"
import prisma from "./prisma"
import z from "zod"
import { Prisma } from "@prisma/client"

const payloadSchema = z.object({
    order_id : z.string().trim().min(1),
    status : z.string().trim().min(1),
    timestamp : z.string().refine((v) => !Number.isNaN(Date.parse(v)), { message : "Invalid timestamp" }).transform((v) => new Date(v)),
    provider_event_id : z.string().trim().min(1)
}).strict()

const orderIdSchema = z.string().trim().min(1)

type WebhookPayload = z.infer<typeof payloadSchema>

const createEvent = async (req : Request, res : Response) => {
    try {
        const parsed = payloadSchema.safeParse(req.body)
        
        if (!parsed.success) { 
            return res.status(400).json({message : 'Invalid Payload'})
        }

        const data : WebhookPayload = parsed.data

        await prisma.webhookEvent.create({
            data : {
                orderId  : data.order_id,
                status : data.status,
                providerTimeStamp : data.timestamp,
                providerEventId : data.provider_event_id
            }
        })

        return res.status(201).json({message : 'Event stored'})
    }
    catch (err : any) {
        if (err instanceof Prisma.PrismaClientKnownRequestError)  {
            if (err.code === 'P2002') {
                return res.status(202).json({message : 'Duplicate Event'})
            }

            console.error('Prisma error:', err.code, err.message)
        }
        else {
            console.error('Unexpected error:', err)
        }

        return res.status(500).json({message : 'Internal Server Error'})
    }
}

const getEvent = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const rawOrderId = Array.isArray(req.query.order_id) 
            ? req.query.order_id[0]
            : req.query.order_id

        const parsed = orderIdSchema.safeParse(rawOrderId)

        if (!parsed.success) {
            return res.status(400).json({message : 'Invalid Order Id'})
        }

        const orderId = parsed.data

        const events = await prisma.webhookEvent.findMany({
            where : {orderId},
            orderBy : {createdAt : 'desc'},
            take : 50,
        })

        return res.status(200).json(events)
    }
    catch (err) {
        next(err)
    }
}

export {createEvent, getEvent}