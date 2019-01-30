const Logger = require("shared/logger");

// Load environment variables
require("shared/environment")([
  "COMMON",
  "PARTNER"
]);

// Load database login
process.env.PG_USER = "partner";
process.env.PG_PASSWORD = process.env.PG_PARTNER_PASSWORD;