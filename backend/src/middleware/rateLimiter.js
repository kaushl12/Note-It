import ratelimiter from "express-rate-limit"

export const authLimiter=ratelimiter({
    windowMs:15*60*1000,
    max:20,
     message: {
    success: false,
    message: "Too many login attempts. Try again later."
  },
  standardHeaders: true,          // Return rate limit info in headers
  legacyHeaders: false, 
})

export const noteLimiter=ratelimiter({
    windowMs:1*60*1000,
    max:50,
    message:{
        success:false,
        message:"Too many request .Please slow down"
    },
    standardHeaders:true,
    legacyHeaders:false
})