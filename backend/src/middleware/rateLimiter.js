import rateLimit from "express-rate-limit";

// ---------------- AUTH LIMITER (Login/Register) ----------------
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 30,
  message: {
    success: false,
    message: "Too many login attempts. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ---------------- PER-USER NOTE LIMITER ----------------
export const noteLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 30,                   // For testing
  message: {
    success: false,
    message: "Too many requests. Please slow down."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ---------------- REGISTER LIMITER ----------------
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many register attempts. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
