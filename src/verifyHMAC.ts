import { Request, Response, NextFunction } from "express"
import crypto from 'crypto'
import config from "./config"

const verifyHMAC = (req : Request, res : Response, next : NextFunction) => {
    const signatureHeader = req.header("X-Signature")
    if (!signatureHeader) {
        return res.status(401).json({message : 'Missing signature'})
    }
    else if (!signatureHeader.startsWith('sha256=')) {
        return res.status(401).json({message : 'Invalid signature format'})
    }

    const secret = config.webhookSecret
    
    const receivedSignature = signatureHeader.slice(7)

    if (!req.rawBody) {
        return res.status(500).json({message : 'Raw body not available'})
    }

    const computedSignature = crypto.createHmac("sha256", secret).update(req.rawBody).digest("hex")

    const valid = 
        receivedSignature.length === computedSignature.length && 
        crypto.timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(computedSignature))
    
    if (!valid) {
        return res.status(401).json({message: "Invalid signature"})
    }

    next ()
}

export default verifyHMAC