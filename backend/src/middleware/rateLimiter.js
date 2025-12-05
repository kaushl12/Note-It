import ratelimiter from "express-rate-limit"

export const authLimiter=ratelimiter({
    windowMs:15*60*1000,
    max:30,
     message: {
    success: false,
    message: "Too many login attempts. Try again later."
  },
  standardHeaders: true,          // Return rate limit info in headers
  legacyHeaders: false, 
})


export const noteLimiter = ratelimiter({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req, res) => {
    return req.user?._id?.toString() || req.ip;
  },
});


// Limit register route moderately
export const registerLimiter = ratelimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many register attempts. Try again later.",
  },
});

