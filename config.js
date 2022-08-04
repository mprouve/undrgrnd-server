const colors = require("colors")

// SETUP ENVIRONMENT VARIABLE
let env

if (
  process.env.NODE_ENV === "local" ||
  process.env.NODE_ENV === "undefined" ||
  typeof process.env.NODE_ENV === "undefined"
) {
  env = "local"
} else if (process.env.NODE_ENV === "production") {
  env = "production"
} else {
  env = null
}

const GLOBAL_CONFIG = {
  env,
  NODE_ENV: process.env.NODE_ENV,
}

// ****************************************
// PRODUCTION *****************************
// ****************************************
const production = {
  ...GLOBAL_CONFIG,
  debug: false,
  app: {
    url: "https://theundrgrnd-app.herokuapp.com",
    port: process.env.PORT || 10000,
    public_dir: "public",
    entry_file: "public/index.html",
  },
}

// ****************************************
// LOCAL **********************************
// ****************************************
const local = {
  ...GLOBAL_CONFIG,
  debug: true,
  app: {
    url: "http://localhost:3000",
    port: process.env.PORT || 10000,
    public_dir: "public",
    entry_file: "public/index.html",
  },
}

console.log(colors.brightMagenta("NODE_ENVIRONMENT: ", process.env.NODE_ENV))
console.log(colors.brightMagenta("PLATFORM_ENVIRONMENT: ", env))

const config = {
  production,
  local,
}[env]

module.exports = config
