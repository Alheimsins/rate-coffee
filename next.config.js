const withOffline = require('next-offline')

module.exports = {
  publicRuntimeConfig: {
    HOST_URL: process.env.DOMAIN || 'http://localhost:3000'
  },
  serverRuntimeConfig: {
    GOOGLE_API_TOKEN: process.env.GOOGLE_API_TOKEN || false
  },
  ...withOffline()
}
