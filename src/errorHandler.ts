import { Request, Response, NextFunction } from "express"

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next : NextFunction
) {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON payload",
    })
  }

  console.error(err)

  return res.status(500).json({
    message: "Internal server error",
  })
}
