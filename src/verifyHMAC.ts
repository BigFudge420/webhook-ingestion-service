import { Request, Response, NextFunction } from "express"
import crypto from 'crypto'

const verifyHMAC = (req : Request, res : Response, next : NextFunction) => {
    const signatureHeader = req.header("X-Signature")
    if (!signatureHeader) {
        return res.status(401).json({message : 'Missing signature'})
    }

    const secret = process.env.WEBHOOK_SECRET
    if (!secret) {
        throw new Error("WEBHOOK_SECRET not set")
    }

    const receivedSignature = signatureHeader.replace('sha256=', '')

    const computedSignature = crypto.createHmac("sha256", secret).update((req as any).rawBody).digest("hex")

    const valid = 
        receivedSignature.length === computedSignature.length && 
        crypto.timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(computedSignature))
    
    if (!valid) {
        return res.status(401).json({message: "Invalid signature"})
    }

    next ()
}

export default verifyHMAC