module.exports = {
  secret: process.env.JWT_SECRET || "terreplus-2026",
  jwtExpiration: 3600,         
  jwtRefreshExpiration: 86400, 
};